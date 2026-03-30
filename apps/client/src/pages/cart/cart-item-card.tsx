import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/format";
import type { CartItem } from "@/stores/cart-store";
import { useCartStore } from "@/stores/cart-store";

const CartItemCard = ({ item }: { item: CartItem }) => {
	const updateQuantity = useCartStore((s) => s.updateQuantity);
	const removeItem = useCartStore((s) => s.removeItem);

	return (
		<div className="flex gap-4 rounded-lg border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
			{item.imgUrl ? (
				<Link to={`/product/${item.productId}`}>
					<img
						src={item.imgUrl}
						alt={item.productName}
						width={140}
						height={140}
						className="h-[100px] w-[100px] shrink-0 rounded object-cover sm:h-[140px] sm:w-[140px]"
					/>
				</Link>
			) : (
				<div className="flex h-[100px] w-[100px] shrink-0 items-center justify-center rounded bg-gray-100 text-xs text-gray-400 dark:bg-gray-700 dark:text-gray-500 sm:h-[140px] sm:w-[140px]">
					Ảnh
				</div>
			)}

			<div className="flex flex-1 flex-col justify-between">
				<div className="flex items-start justify-between">
					<div>
						<Link
							to={`/product/${item.productId}`}
							className="line-clamp-1 font-semibold hover:text-[var(--color-brand-green-text)] dark:text-gray-200"
						>
							{item.productName}
						</Link>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							{item.name}
						</p>
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
					<div className="text-sm text-gray-600 dark:text-gray-400">
						{formatCurrency(item.price)} x {item.qty} ={" "}
						<span className="font-semibold text-[var(--color-brand-green-text)]">
							{formatCurrency(item.price * item.qty)}
						</span>
					</div>

					<div className="flex items-center gap-2">
						<button
							onClick={() => updateQuantity(item.id, item.qty - 1)}
							disabled={item.qty <= 1}
							className="flex h-10 w-10 items-center justify-center rounded border disabled:opacity-40 dark:border-gray-600 dark:text-gray-300"
							aria-label="Giảm số lượng"
						>
							<Minus size={14} />
						</button>
						<input
							type="number"
							min={1}
							value={item.qty}
							onChange={(e) => {
								const val = Number.parseInt(e.target.value, 10);
								if (!Number.isNaN(val) && val >= 1) {
									updateQuantity(item.id, val);
								}
							}}
							className="h-10 w-12 rounded border text-center text-sm font-semibold [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
							aria-label={`Số lượng ${item.productName}`}
						/>
						<button
							onClick={() => updateQuantity(item.id, item.qty + 1)}
							className="flex h-10 w-10 items-center justify-center rounded border dark:border-gray-600 dark:text-gray-300"
							aria-label="Tăng số lượng"
						>
							<Plus size={14} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartItemCard;
