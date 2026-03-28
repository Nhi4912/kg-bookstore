import type {
	ProductListResponse,
	ProductResponse,
} from "@kgbookstore/api-contract";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";

export const productKeys = {
	all: ["products"] as const,
	list: (params?: Record<string, unknown>) =>
		[...productKeys.all, params] as const,
	detail: (id: string) => [...productKeys.all, "detail", id] as const,
};

export const useProducts = (params?: {
	collectionIds?: string[];
	limit?: number;
}) => {
	const limit = params?.limit ?? 8;

	return useQuery({
		queryKey: productKeys.list({
			collection_ids: params?.collectionIds,
			limit,
		}),
		queryFn: () =>
			apiClient
				.get<ProductListResponse>("/products", {
					params: {
						limit,
						offset: 0,
						collection_ids: params?.collectionIds
							? JSON.stringify(params.collectionIds)
							: undefined,
						is_visible: 1,
					},
				})
				.then((r) => r.data),
		staleTime: Infinity,
	});
};

export const useProductDetail = (id: string) =>
	useQuery({
		queryKey: productKeys.detail(id),
		queryFn: () =>
			apiClient.get<ProductResponse>(`/products/${id}`).then((r) => r.data),
		enabled: !!id,
	});
