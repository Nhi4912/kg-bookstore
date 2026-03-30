import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";
import { useCreateOrder } from "@/hooks/use-create-order";
import { formatCurrency } from "@/lib/format";
import type { CartItem } from "@/stores/cart-store";

const PHONE_REGEX = /([+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/;

const checkoutSchema = z.object({
	last_name: z.string().min(1, "Vui lòng nhập họ"),
	first_name: z.string().min(1, "Vui lòng nhập tên"),
	phone_number: z
		.string()
		.min(1, "Vui lòng nhập số điện thoại")
		.regex(PHONE_REGEX, "Số điện thoại không hợp lệ"),
	address: z.string().min(1, "Vui lòng nhập địa chỉ"),
	note: z.string().optional(),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
	items: CartItem[];
	totalPrice: number;
	onSuccess: () => void;
}

const CheckoutForm = ({ items, totalPrice, onSuccess }: CheckoutFormProps) => {
	const { mutate: createOrder, isPending } = useCreateOrder({
		onSuccess,
		onError: () => {
			toast.error("Đặt hàng thất bại. Vui lòng thử lại.");
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CheckoutValues>({
		resolver: zodResolver(checkoutSchema),
		defaultValues: {
			last_name: "",
			first_name: "",
			phone_number: "",
			address: "",
			note: "",
		},
	});

	const onSubmit = (data: CheckoutValues) => {
		const variantOrders = items.map((item) => ({
			variant_id: item.id,
			quantity: item.qty,
		}));

		createOrder({
			...data,
			variant_orders: variantOrders,
			final_price: totalPrice,
			payment_method: "COD",
		});
	};

	return (
		<div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
			{/* Total */}
			<div className="mb-4 flex items-center justify-between">
				<span className="text-gray-600 dark:text-gray-400">Tổng cộng:</span>
				<span className="text-lg font-bold">{formatCurrency(totalPrice)}</span>
			</div>

			<hr className="mb-4" />

			{/* Form */}
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
				<div className="grid grid-cols-2 gap-3">
					<div>
						<label
							htmlFor="checkout-last-name"
							className="mb-1 block text-sm font-medium text-[var(--color-text-primary)]"
						>
							Họ
						</label>
						<input
							id="checkout-last-name"
							{...register("last_name")}
							placeholder="Họ"
							aria-label="Họ"
							aria-describedby={
								errors.last_name ? "last-name-error" : undefined
							}
							aria-invalid={errors.last_name ? true : undefined}
							className="w-full rounded border px-3 py-2.5 text-sm outline-none focus:border-[var(--color-brand-green)] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
						/>
						{errors.last_name ? (
							<p
								id="last-name-error"
								role="alert"
								className="mt-1 text-xs text-red-500"
							>
								{errors.last_name.message}
							</p>
						) : null}
					</div>
					<div>
						<label
							htmlFor="checkout-first-name"
							className="mb-1 block text-sm font-medium text-[var(--color-text-primary)]"
						>
							Tên
						</label>
						<input
							id="checkout-first-name"
							{...register("first_name")}
							placeholder="Tên"
							aria-label="Tên"
							aria-describedby={
								errors.first_name ? "first-name-error" : undefined
							}
							aria-invalid={errors.first_name ? true : undefined}
							className="w-full rounded border px-3 py-2.5 text-sm outline-none focus:border-[var(--color-brand-green)] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
						/>
						{errors.first_name ? (
							<p
								id="first-name-error"
								role="alert"
								className="mt-1 text-xs text-red-500"
							>
								{errors.first_name.message}
							</p>
						) : null}
					</div>
				</div>

				<div>
					<label
						htmlFor="checkout-phone"
						className="mb-1 block text-sm font-medium text-[var(--color-text-primary)]"
					>
						Số điện thoại
					</label>
					<input
						id="checkout-phone"
						{...register("phone_number")}
						placeholder="Số điện thoại"
						aria-label="Số điện thoại"
						aria-describedby={errors.phone_number ? "phone-error" : undefined}
						aria-invalid={errors.phone_number ? true : undefined}
						className="w-full rounded border px-3 py-2.5 text-sm outline-none focus:border-[var(--color-brand-green)] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
					/>
					{errors.phone_number ? (
						<p
							id="phone-error"
							role="alert"
							className="mt-1 text-xs text-red-500"
						>
							{errors.phone_number.message}
						</p>
					) : null}
				</div>

				<div>
					<label
						htmlFor="checkout-address"
						className="mb-1 block text-sm font-medium text-[var(--color-text-primary)]"
					>
						Địa chỉ
					</label>
					<input
						id="checkout-address"
						{...register("address")}
						placeholder="Địa chỉ"
						aria-label="Địa chỉ"
						aria-describedby={errors.address ? "address-error" : undefined}
						aria-invalid={errors.address ? true : undefined}
						className="w-full rounded border px-3 py-2.5 text-sm outline-none focus:border-[var(--color-brand-green)] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
					/>
					{errors.address ? (
						<p
							id="address-error"
							role="alert"
							className="mt-1 text-xs text-red-500"
						>
							{errors.address.message}
						</p>
					) : null}
				</div>

				<hr />

				<button
					type="submit"
					disabled={isPending}
					className="flex w-full items-center justify-center gap-2 rounded-md bg-[var(--color-brand-green)] py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-brand-green)]/90 disabled:opacity-50"
				>
					{isPending ? <Loader2 size={16} className="animate-spin" /> : null}
					Mua hàng
				</button>
			</form>
		</div>
	);
};

export default CheckoutForm;
