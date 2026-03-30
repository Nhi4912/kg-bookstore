import type {
	CreateOrderRequest,
	OrderListResponse,
	OrderQueryParams,
	OrderResponse,
	UpdateOrderRequest,
} from "@kgbookstore/api-contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

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
		queryFn: () => api.get<OrderListResponse>("/orders/with-admin", params),
	});
};

const useOrderDetail = (id: string) => {
	return useQuery({
		queryKey: orderKeys.detail(id),
		queryFn: () => api.get<OrderResponse>(`/orders/with-admin/${id}`),
		enabled: !!id,
	});
};

const useCreateOrder = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateOrderRequest) =>
			api.post("/orders/with-admin", data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
		},
	});
};

const useUpdateOrder = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: UpdateOrderRequest) =>
			api.put(`/orders/with-admin/${data.order_id}`, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: orderKeys.all });
		},
	});
};

export { orderKeys, useCreateOrder, useOrderDetail, useOrders, useUpdateOrder };
