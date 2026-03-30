import type {
	CreatedResponse,
	CreateVariantRequest,
	UpdateVariantRequest,
} from "@kgbookstore/api-contract";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { productKeys } from "./use-products";

const useCreateProductVariant = (productId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateVariantRequest) =>
			api.post<CreatedResponse>(
				`/products/${productId}/variants/with-admin`,
				data,
			),
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
			api.put(`/products/${productId}/variants/${variantId}/with-admin`, data),
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
			api.delete(`/products/${productId}/variants/${variantId}/with-admin`),
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
