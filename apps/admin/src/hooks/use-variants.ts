import type {
	CreatedResponse,
	CreateVariantRequest,
	UpdateVariantRequest,
} from "@kgbookstore/api-contract";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { productKeys } from "./use-products";

const useCreateProductVariant = (productId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateVariantRequest) =>
			apiClient
				.post<CreatedResponse>(
					`/products/${productId}/variants/with-admin`,
					data,
				)
				.then((r) => r.data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: productKeys.detail(productId),
			});
		},
	});
};

const useUpdateProductVariant = (productId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			variantId,
			data,
		}: {
			variantId: string;
			data: UpdateVariantRequest;
		}) =>
			apiClient
				.put(`/products/${productId}/variants/${variantId}/with-admin`, data)
				.then((r) => r.data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: productKeys.detail(productId),
			});
		},
	});
};

const useDeleteProductVariant = (productId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (variantId: string) =>
			apiClient
				.delete(`/products/${productId}/variants/${variantId}/with-admin`)
				.then((r) => r.data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: productKeys.detail(productId),
			});
		},
	});
};

export {
	useCreateProductVariant,
	useDeleteProductVariant,
	useUpdateProductVariant,
};
