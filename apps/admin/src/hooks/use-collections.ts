import type {
	CollectionListResponse,
	CollectionQueryParams,
	CollectionResponse,
	CreateCollectionRequest,
	CreatedResponse,
	UpdateCollectionRequest,
} from "@kgbookstore/api-contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

// ─── Query Key Factory ───

const collectionKeys = {
	all: ["collections"] as const,
	lists: () => [...collectionKeys.all, "list"] as const,
	list: (params?: Partial<CollectionQueryParams>) =>
		[...collectionKeys.lists(), params] as const,
	details: () => [...collectionKeys.all, "detail"] as const,
	detail: (id: string) => [...collectionKeys.details(), id] as const,
};

// ─── Queries ───

const useCollections = (params?: Partial<CollectionQueryParams>) => {
	return useQuery({
		queryKey: collectionKeys.list(params),
		queryFn: () => api.get<CollectionListResponse>("/collections", params),
	});
};

const useCollectionDetail = (id: string) => {
	return useQuery({
		queryKey: collectionKeys.detail(id),
		queryFn: () => api.get<CollectionResponse>(`/collections/${id}`),
		enabled: !!id,
	});
};

// ─── Mutations ───

const useCreateCollection = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateCollectionRequest) =>
			api.post<CreatedResponse>("/collections/with-admin", data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: collectionKeys.all });
		},
	});
};

const useUpdateCollection = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateCollectionRequest }) =>
			api.put(`/collections/with-admin/${id}`, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: collectionKeys.all });
		},
	});
};

const useDeleteCollection = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => api.delete(`/collections/with-admin/${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: collectionKeys.all });
		},
	});
};

export {
	collectionKeys,
	useCollectionDetail,
	useCollections,
	useCreateCollection,
	useDeleteCollection,
	useUpdateCollection,
};
