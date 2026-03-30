import type {
	CreatedResponse,
	CreateProductRequest,
	ProductListResponse,
	ProductQueryParams,
	ProductResponse,
	UpdateProductRequest,
} from "@kgbookstore/api-contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

const productKeys = {
	all: ["products"] as const,
	list: (params?: Partial<ProductQueryParams>) =>
		[...productKeys.all, "list", params] as const,
	detail: (id: string) => [...productKeys.all, "detail", id] as const,
};

const useProducts = (params?: Partial<ProductQueryParams>) => {
	return useQuery({
		queryKey: productKeys.list(params),
		queryFn: () => api.get<ProductListResponse>("/products", params),
	});
};

const useProductDetail = (id: string) => {
	return useQuery({
		queryKey: productKeys.detail(id),
		queryFn: () => api.get<ProductResponse>(`/products/${id}`),
		enabled: !!id,
	});
};

const useCreateProduct = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateProductRequest) =>
			api.post<CreatedResponse>("/products/with-admin", data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: productKeys.all });
		},
	});
};

const useUpdateProduct = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateProductRequest }) =>
			api.put(`/products/with-admin/${id}`, data),
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
		mutationFn: (id: string) => api.delete(`/products/with-admin/${id}`),
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
