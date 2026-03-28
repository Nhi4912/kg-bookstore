import type {
	CreatedResponse,
	CreateProductRequest,
	ProductListResponse,
	ProductQueryParams,
	ProductResponse,
	UpdateProductRequest,
} from "@kgbookstore/api-contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";

const productKeys = {
	all: ["products"] as const,
	list: (params?: Partial<ProductQueryParams>) =>
		[...productKeys.all, "list", params] as const,
	detail: (id: string) => [...productKeys.all, "detail", id] as const,
};

const useProducts = (params?: Partial<ProductQueryParams>) => {
	return useQuery({
		queryKey: productKeys.list(params),
		queryFn: () =>
			apiClient
				.get<ProductListResponse>("/products", { params })
				.then((r) => r.data),
	});
};

const useProductDetail = (id: string) => {
	return useQuery({
		queryKey: productKeys.detail(id),
		queryFn: () =>
			apiClient.get<ProductResponse>(`/products/${id}`).then((r) => r.data),
		enabled: !!id,
	});
};

const useCreateProduct = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateProductRequest) =>
			apiClient
				.post<CreatedResponse>("/products/with-admin", data)
				.then((r) => r.data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: productKeys.all });
		},
	});
};

const useUpdateProduct = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateProductRequest }) =>
			apiClient.put(`/products/with-admin/${id}`, data).then((r) => r.data),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: productKeys.all });
			queryClient.invalidateQueries({
				queryKey: productKeys.detail(variables.id),
			});
		},
	});
};

const useDeleteProduct = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) =>
			apiClient.delete(`/products/with-admin/${id}`).then((r) => r.data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: productKeys.all });
		},
	});
};

export {
	productKeys,
	useCreateProduct,
	useDeleteProduct,
	useProductDetail,
	useProducts,
	useUpdateProduct,
};
