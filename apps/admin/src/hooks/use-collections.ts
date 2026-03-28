import type {
	CollectionListResponse,
	CollectionQueryParams,
	CollectionResponse,
	CreateCollectionRequest,
	CreatedResponse,
	UpdateCollectionRequest,
} from "@kgbookstore/api-contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";

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
		queryFn: () =>
			apiClient
				.get<CollectionListResponse>("/collections", { params })
				.then((r) => r.data),
	});
};

const useCollectionDetail = (id: string) => {
	return useQuery({
		queryKey: collectionKeys.detail(id),
		queryFn: () =>
			apiClient
				.get<CollectionResponse>(`/collections/${id}`)
				.then((r) => r.data),
		enabled: !!id,
	});
};

// ─── Mutations ───

const useCreateCollection = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateCollectionRequest) =>
			apiClient
				.post<CreatedResponse>("/collections/with-admin", data)
				.then((r) => r.data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: collectionKeys.all });
		},
	});
};

const useUpdateCollection = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateCollectionRequest }) =>
			apiClient.put(`/collections/with-admin/${id}`, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: collectionKeys.all });
		},
	});
};

const useDeleteCollection = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) =>
			apiClient.delete(`/collections/with-admin/${id}`),
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
