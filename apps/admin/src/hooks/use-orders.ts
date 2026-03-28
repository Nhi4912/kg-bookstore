import type {
	CreateOrderRequest,
	OrderListResponse,
	OrderQueryParams,
	OrderResponse,
	UpdateOrderRequest,
} from "@kgbookstore/api-contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";

const orderKeys = {
	all: ["orders"] as const,
	lists: () => [...orderKeys.all, "list"] as const,
	list: (params?: Partial<OrderQueryParams>) =>
		[...orderKeys.lists(), params] as const,
	details: () => [...orderKeys.all, "detail"] as const,
	detail: (id: string) => [...orderKeys.details(), id] as const,
};

const useOrders = (params?: Partial<OrderQueryParams>) => {
	return useQuery({
		queryKey: orderKeys.list(params),
		queryFn: () =>
			apiClient
				.get<OrderListResponse>("/orders/with-admin", { params })
				.then((r) => r.data),
	});
};

const useOrderDetail = (id: string) => {
	return useQuery({
		queryKey: orderKeys.detail(id),
		queryFn: () =>
			apiClient
				.get<OrderResponse>(`/orders/with-admin/${id}`)
				.then((r) => r.data),
		enabled: !!id,
	});
};

const useCreateOrder = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateOrderRequest) =>
			apiClient.post("/orders/with-admin", data).then((r) => r.data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
		},
	});
};

const useUpdateOrder = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: UpdateOrderRequest) =>
			apiClient
				.put(`/orders/with-admin/${data.order_id}`, data)
				.then((r) => r.data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: orderKeys.all });
		},
	});
};

export { orderKeys, useCreateOrder, useOrderDetail, useOrders, useUpdateOrder };
