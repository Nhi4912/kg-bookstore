import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";

export interface CheckoutFormValues {
	first_name: string;
	last_name: string;
	phone_number: string;
	address: string;
	note?: string;
	variant_orders: { variant_id: string; quantity: number }[];
	final_price: number;
	payment_method: string;
}

export const useCreateOrder = (opts?: {
	onSuccess?: () => void;
	onError?: () => void;
}) =>
	useMutation({
		mutationKey: ["create-order"],
		mutationFn: (data: CheckoutFormValues) =>
			apiClient.post("/orders", data).then((r) => r.data),
		onSuccess: () => opts?.onSuccess?.(),
		onError: () => opts?.onError?.(),
	});
