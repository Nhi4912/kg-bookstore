import type {
	ProductListResponse,
	ProductResponse,
} from "@kgbookstore/api-contract";
import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import { apiClient } from "@/lib/axios";

interface FilterQuery {
	vendor_ids: string[];
	from_price: number | null;
	to_price: number | null;
}

export const useProductQuery = (defaultQuery: Record<string, unknown>) => {
	const [total, setTotal] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [canLoadMore, setCanLoadMore] = useState(false);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [listProducts, setListProducts] = useState<ProductResponse[]>([]);
	const [isShowClearFilter, setIsShowClearFilter] = useState(false);

	const [query, setQuery] = useState<Record<string, unknown>>({
		limit: DEFAULT_PAGE_SIZE,
		offset: 0,
		is_visible: 1,
		...defaultQuery,
	});

	const [filterQuery, setFilterQuery] = useState<FilterQuery>({
		vendor_ids: [],
		from_price: null,
		to_price: null,
	});

	const prevDefaultQuery = useRef(JSON.stringify(defaultQuery));

	// Reset when defaultQuery changes
	useEffect(() => {
		const serialized = JSON.stringify(defaultQuery);
		if (serialized !== prevDefaultQuery.current) {
			prevDefaultQuery.current = serialized;
			setQuery({
				limit: DEFAULT_PAGE_SIZE,
				offset: 0,
				is_visible: 1,
				...defaultQuery,
			});
			setIsLoading(true);
			setListProducts([]);
		}
	}, [defaultQuery]);

	// Fetch products
	const prevQuery = useRef("");
	useEffect(() => {
		const serialized = JSON.stringify(query);
		if (serialized === prevQuery.current) return;
		prevQuery.current = serialized;

		const params = { ...query };
		if (
			Array.isArray(params.vendor_ids) &&
			(params.vendor_ids as string[]).length > 0
		) {
			params.vendor_ids = JSON.stringify(params.vendor_ids);
		} else {
			delete params.vendor_ids;
		}

		apiClient
			.get<ProductListResponse>("/products", { params })
			.then((res) => {
				const { items, paging } = res.data;
				setTotal(paging.total);
				setListProducts((prev) => [...prev, ...items]);
				setIsLoadingMore(false);
				setIsLoading(false);
			})
			.catch(() => {
				setIsLoading(false);
				setIsLoadingMore(false);
			});
	}, [query]);

	// Track canLoadMore
	useEffect(() => {
		setCanLoadMore(listProducts.length < total);
	}, [listProducts.length, total]);

	// Track filter dirty state
	useEffect(() => {
		setIsShowClearFilter(
			filterQuery.vendor_ids.length > 0 ||
				filterQuery.from_price !== null ||
				filterQuery.to_price !== null,
		);
	}, [filterQuery]);

	const loadMore = useCallback(() => {
		setQuery((prev) => ({
			...prev,
			offset: ((prev.offset as number) || 0) + DEFAULT_PAGE_SIZE,
		}));
		setIsLoadingMore(true);
	}, []);

	const handleChangeVendors = useCallback((vendorId: string) => {
		setFilterQuery((prev) => {
			const ids = [...prev.vendor_ids];
			const idx = ids.indexOf(vendorId);
			if (idx === -1) ids.push(vendorId);
			else ids.splice(idx, 1);
			return { ...prev, vendor_ids: ids };
		});
	}, []);

	const handleChangePrice = useCallback((from: number, to: number) => {
		setFilterQuery((prev) => ({ ...prev, from_price: from, to_price: to }));
	}, []);

	const clearFilter = useCallback(() => {
		setFilterQuery({ vendor_ids: [], from_price: null, to_price: null });
	}, []);

	// Apply filter changes
	const prevFilter = useRef(JSON.stringify(filterQuery));
	useEffect(() => {
		const serialized = JSON.stringify(filterQuery);
		if (serialized === prevFilter.current) return;
		prevFilter.current = serialized;

		setListProducts([]);
		setIsLoading(true);
		setQuery((prev) => ({
			...prev,
			vendor_ids:
				filterQuery.vendor_ids.length > 0 ? filterQuery.vendor_ids : undefined,
			from_price: filterQuery.from_price ?? 0,
			to_price: filterQuery.to_price ?? 99999999,
			offset: 0,
		}));
	}, [filterQuery]);

	return {
		listProducts,
		total,
		isLoading,
		canLoadMore,
		isLoadingMore,
		isShowClearFilter,
		filterQuery,
		loadMore,
		handleChangePrice,
		handleChangeVendors,
		clearFilter,
	};
};
