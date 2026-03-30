import type { ProductListResponse } from "@kgbookstore/api-contract";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import { api } from "@/lib/api";
import { productKeys } from "./use-products";

interface FilterQuery {
	vendor_ids: string[];
	from_price: number | null;
	to_price: number | null;
}

const buildParams = (
	defaultQuery: Record<string, unknown>,
	filterQuery: FilterQuery,
	offset: number,
): Record<string, unknown> => {
	const params: Record<string, unknown> = {
		limit: DEFAULT_PAGE_SIZE,
		offset,
		is_visible: 1,
		...defaultQuery,
	};

	if (filterQuery.vendor_ids.length > 0) {
		params.vendor_ids = JSON.stringify(filterQuery.vendor_ids);
	}
	if (filterQuery.from_price !== null) {
		params.from_price = filterQuery.from_price;
	}
	if (filterQuery.to_price !== null) {
		params.to_price = filterQuery.to_price;
	}

	return params;
};

const fetchProducts = (params: Record<string, unknown>) =>
	api.get<ProductListResponse>("/products", params);

export const useProductQuery = (defaultQuery: Record<string, unknown>) => {
	const [filterQuery, setFilterQuery] = useState<FilterQuery>({
		vendor_ids: [],
		from_price: null,
		to_price: null,
	});

	const queryKey = useMemo(
		() =>
			productKeys.list({
				...defaultQuery,
				_vendor_ids: filterQuery.vendor_ids,
				_from_price: filterQuery.from_price,
				_to_price: filterQuery.to_price,
			}),
		[defaultQuery, filterQuery],
	);

	const {
		data,
		isLoading,
		isError,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
		refetch,
	} = useInfiniteQuery({
		queryKey,
		queryFn: ({ pageParam }) =>
			fetchProducts(buildParams(defaultQuery, filterQuery, pageParam)),
		initialPageParam: 0,
		getNextPageParam: (lastPage, allPages) => {
			const totalFetched = allPages.reduce(
				(sum, page) => sum + page.items.length,
				0,
			);
			return totalFetched < lastPage.paging.total ? totalFetched : undefined;
		},
		staleTime: 30_000,
	});

	const listProducts = useMemo(
		() => data?.pages.flatMap((page) => page.items) ?? [],
		[data],
	);

	const total = data?.pages.at(-1)?.paging.total ?? 0;

	const isShowClearFilter =
		filterQuery.vendor_ids.length > 0 ||
		filterQuery.from_price !== null ||
		filterQuery.to_price !== null;

	const loadMore = useCallback(() => {
		fetchNextPage();
	}, [fetchNextPage]);

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
		refetch();
	}, [refetch]);

	return {
		listProducts,
		total,
		isLoading,
		isError,
		canLoadMore: hasNextPage,
		isLoadingMore: isFetchingNextPage,
		isShowClearFilter,
		filterQuery,
		loadMore,
		handleChangePrice,
		handleChangeVendors,
		clearFilter,
		retry,
	};
};
