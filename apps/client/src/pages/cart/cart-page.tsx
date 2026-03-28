import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod/v4";
import { useCreateOrder } from "@/hooks/use-create-order";
import { formatCurrency } from "@/lib/format";
import type { CartItem } from "@/stores/cart-store";
import { useCartStore } from "@/stores/cart-store";

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

/* ─── Cart Item Row ─── */
const CartItemCard = ({ item }: { item: CartItem }) => {
	const updateQuantity = useCartStore((s) => s.updateQuantity);
	const removeItem = useCartStore((s) => s.removeItem);

	return (
		<div className="flex gap-4 rounded-lg border bg-white p-4 shadow-sm">
			{item.imgUrl ? (
				<Link to={`/product/${item.productId}`}>
					<img
						src={item.imgUrl}
						alt={item.productName}
						className="h-[100px] w-[100px] shrink-0 rounded object-cover sm:h-[140px] sm:w-[140px]"
					/>
				</Link>
			) : (
				<div className="flex h-[100px] w-[100px] shrink-0 items-center justify-center rounded bg-gray-100 text-xs text-gray-400 sm:h-[140px] sm:w-[140px]">
					Ảnh
				</div>
			)}

			<div className="flex flex-1 flex-col justify-between">
				<div className="flex items-start justify-between">
					<div>
						<Link
							to={`/product/${item.productId}`}
							className="line-clamp-1 font-semibold hover:text-[var(--color-brand-green)]"
						>
							{item.productName}
						</Link>
						<p className="text-sm text-gray-500">{item.name}</p>
					</div>
					<button
						onClick={() => removeItem(item.id)}
						className="ml-2 shrink-0 text-gray-400 hover:text-red-500"
						aria-label="Xoá"
					>
						<Trash2 size={16} />
					</button>
				</div>

				<div className="mt-2 flex items-center justify-between">
					<div className="text-sm text-gray-600">
						{formatCurrency(item.price)} x {item.qty} ={" "}
						<span className="font-semibold text-[var(--color-brand-green)]">
							{formatCurrency(item.price * item.qty)}
						</span>
					</div>

					<div className="flex items-center gap-2">
						<button
							onClick={() => updateQuantity(item.id, item.qty - 1)}
							disabled={item.qty <= 1}
							className="rounded border p-1 disabled:opacity-40"
						>
							<Minus size={14} />
						</button>
						<span className="min-w-[2ch] text-center text-sm font-semibold">
							{item.qty}
						</span>
						<button
							onClick={() => updateQuantity(item.id, item.qty + 1)}
							className="rounded border p-1"
						>
							<Plus size={14} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

/* ─── Cart Page ─── */
const CartPage = () => {
	const items = useCartStore((s) => s.items);
	const totalPrice = useCartStore((s) => s.totalPrice());
	const clearCart = useCartStore((s) => s.clearCart);
	const [showSuccess, setShowSuccess] = useState(false);

	const { mutate: createOrder, isPending } = useCreateOrder({
		onSuccess: () => {
			clearCart();
			setShowSuccess(true);
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

	if (showSuccess) {
		return (
			<div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
				<div className="rounded-xl bg-white p-8 text-center shadow-lg">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
						<CheckCircle size={32} className="text-green-600" />
					</div>
					<h2 className="mb-2 text-xl font-bold">Mua hàng thành công</h2>
					<p className="mb-6 text-sm text-gray-500">
						Cảm ơn bạn đã đặt hàng tại Nhà Sách Kiên Giang!
					</p>
					<Link
						to="/"
						className="inline-block rounded-md bg-[var(--color-brand-green)] px-6 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-brand-green)]/90"
					>
						Về trang chủ
					</Link>
				</div>
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
				<p className="mb-4 text-gray-500">Giỏ hàng trống</p>
				<Link
					to="/"
					className="rounded-md bg-[var(--color-brand-green)] px-6 py-2.5 text-sm font-medium text-white"
				>
					Tiếp tục mua sắm
				</Link>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-7xl px-4 py-8">
			<h1 className="mb-6 text-2xl font-bold">Giỏ hàng</h1>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
				{/* Cart items */}
				<div className="space-y-4 lg:col-span-8">
					{items.map((item) => (
						<CartItemCard key={item.id} item={item} />
					))}
				</div>

				{/* Checkout form */}
				<div className="lg:col-span-4">
					<div className="rounded-lg border bg-white p-6 shadow-sm">
						{/* Total */}
						<div className="mb-4 flex items-center justify-between">
							<span className="text-gray-600">Tổng cộng:</span>
							<span className="text-lg font-bold">
								{formatCurrency(totalPrice)}
							</span>
						</div>

						<hr className="mb-4" />

						{/* Form */}
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
							<div className="grid grid-cols-2 gap-3">
								<div>
									<input
										{...register("last_name")}
										placeholder="Họ"
										className="w-full rounded border px-3 py-2.5 text-sm outline-none focus:border-[var(--color-brand-green)]"
									/>
									{errors.last_name && (
										<p className="mt-1 text-xs text-red-500">
											{errors.last_name.message}
										</p>
									)}
								</div>
								<div>
									<input
										{...register("first_name")}
										placeholder="Tên"
										className="w-full rounded border px-3 py-2.5 text-sm outline-none focus:border-[var(--color-brand-green)]"
									/>
									{errors.first_name && (
										<p className="mt-1 text-xs text-red-500">
											{errors.first_name.message}
										</p>
									)}
								</div>
							</div>

							<div>
								<input
									{...register("phone_number")}
									placeholder="Số điện thoại"
									className="w-full rounded border px-3 py-2.5 text-sm outline-none focus:border-[var(--color-brand-green)]"
								/>
								{errors.phone_number && (
									<p className="mt-1 text-xs text-red-500">
										{errors.phone_number.message}
									</p>
								)}
							</div>

							<div>
								<input
									{...register("address")}
									placeholder="Địa chỉ"
									className="w-full rounded border px-3 py-2.5 text-sm outline-none focus:border-[var(--color-brand-green)]"
								/>
								{errors.address && (
									<p className="mt-1 text-xs text-red-500">
										{errors.address.message}
									</p>
								)}
							</div>

							<hr />

							<button
								type="submit"
								disabled={isPending}
								className="flex w-full items-center justify-center gap-2 rounded-md bg-[var(--color-brand-green)] py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-brand-green)]/90 disabled:opacity-50"
							>
								{isPending && <Loader2 size={16} className="animate-spin" />}
								Mua hàng
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartPage;
