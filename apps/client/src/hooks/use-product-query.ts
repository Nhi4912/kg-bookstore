import type {
	ProductListResponse,
	ProductResponse,
} from "@kgbookstore/api-contract";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import { apiClient } from "@/lib/axios";

interface FilterQuery {
	vendor_ids: string[];
	from_price: number | null;
	to_price: number | null;
}

/**
 * Serializes a query object to a stable string for dependency tracking.
 * This avoids the anti-pattern of using objects in useEffect dependencies
 * or relying on JSON.stringify + useRef for comparison.
 */
const serializeQuery = (q: Record<string, unknown>): string =>
	Object.keys(q)
		.sort()
		.map((k) => `${k}=${JSON.stringify(q[k])}`)
		.join("&");

export const useProductQuery = (defaultQuery: Record<string, unknown>) => {
	const [total, setTotal] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);
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

	// Use serialized string as primitive dependency instead of object ref
	const defaultQueryKey = useMemo(
		() => serializeQuery(defaultQuery),
		[defaultQuery],
	);
	const prevDefaultQueryKey = useRef(defaultQueryKey);

	// Reset when defaultQuery changes (compared as primitive string)
	useEffect(() => {
		if (defaultQueryKey !== prevDefaultQueryKey.current) {
			prevDefaultQueryKey.current = defaultQueryKey;
			setQuery({
				limit: DEFAULT_PAGE_SIZE,
				offset: 0,
				is_visible: 1,
				...defaultQuery,
			});
			setIsLoading(true);
			setIsError(false);
			setListProducts([]);
		}
	}, [defaultQueryKey, defaultQuery]);

	// Fetch products — use serialized query as primitive dependency
	const queryKey = useMemo(() => serializeQuery(query), [query]);
	const prevQueryKey = useRef("");

	useEffect(() => {
		if (queryKey === prevQueryKey.current) return;
		prevQueryKey.current = queryKey;

		const params = { ...query };
		if (
			Array.isArray(params.vendor_ids) &&
			(params.vendor_ids as string[]).length > 0
		) {
			params.vendor_ids = JSON.stringify(params.vendor_ids);
		} else {
			delete params.vendor_ids;
		}

		setIsError(false);

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
				setIsError(true);
				setIsLoading(false);
				setIsLoadingMore(false);
			});
	}, [queryKey, query]);

	// Track canLoadMore
	useEffect(() => {
		setCanLoadMore(listProducts.length < total);
	}, [listProducts.length, total]);

	// Track filter dirty state using primitive dependencies
	const vendorCount = filterQuery.vendor_ids.length;
	const fromPrice = filterQuery.from_price;
	const toPrice = filterQuery.to_price;

	useEffect(() => {
		setIsShowClearFilter(
			vendorCount > 0 || fromPrice !== null || toPrice !== null,
		);
	}, [vendorCount, fromPrice, toPrice]);

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

	const retry = useCallback(() => {
		setIsError(false);
		setIsLoading(true);
		setListProducts([]);
		prevQueryKey.current = "";
		setQuery((prev) => ({ ...prev }));
	}, []);

	// Apply filter changes — use primitive dependency
	const filterKey = useMemo(
		() =>
			`${filterQuery.vendor_ids.join(",")}_${filterQuery.from_price}_${filterQuery.to_price}`,
		[filterQuery],
	);
	const prevFilterKey = useRef(filterKey);

	useEffect(() => {
		if (filterKey === prevFilterKey.current) return;
		prevFilterKey.current = filterKey;

		setListProducts([]);
		setIsLoading(true);
		setIsError(false);
		setQuery((prev) => ({
			...prev,
			vendor_ids:
				filterQuery.vendor_ids.length > 0 ? filterQuery.vendor_ids : undefined,
			from_price: filterQuery.from_price ?? 0,
			to_price: filterQuery.to_price ?? 99999999,
			offset: 0,
		}));
	}, [filterKey, filterQuery]);

	return {
		listProducts,
		total,
		isLoading,
		isError,
		canLoadMore,
		isLoadingMore,
		isShowClearFilter,
		filterQuery,
		loadMore,
		handleChangePrice,
		handleChangeVendors,
		clearFilter,
		retry,
	};
};
