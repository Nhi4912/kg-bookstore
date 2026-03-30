import type {
	ProductListResponse,
	ProductResponse,
} from "@kgbookstore/api-contract";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const productKeys = {
	all: ["products"] as const,
	list: (params?: Record<string, unknown>) =>
		[...productKeys.all, params] as const,
	detail: (id: string) => [...productKeys.all, "detail", id] as const,
	search: (name: string) => [...productKeys.all, "search", name] as const,
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
			api.get<ProductListResponse>("/products", {
				limit,
				offset: 0,
				collection_ids: params?.collectionIds
					? JSON.stringify(params.collectionIds)
					: undefined,
				is_visible: 1,
			}),
		staleTime: Infinity,
	});
};

export const useSearchProducts = (name: string) =>
	useQuery({
		queryKey: productKeys.search(name),
		queryFn: () =>
			api.get<ProductListResponse>("/products", {
				limit: 4,
				offset: 0,
				name,
				is_visible: 1,
			}),
		enabled: name.length >= 2,
		staleTime: 30_000,
	});

export const useProductDetail = (id: string) =>
	useQuery({
		queryKey: productKeys.detail(id),
		queryFn: () => api.get<ProductResponse>(`/products/${id}`),
		enabled: !!id,
	});
