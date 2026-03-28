import { Minus, Plus, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/format";
import { useCartStore } from "@/stores/cart-store";

const MiniCart = ({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) => {
	const items = useCartStore((s) => s.items);
	const updateQuantity = useCartStore((s) => s.updateQuantity);
	const removeItem = useCartStore((s) => s.removeItem);
	const totalPrice = useCartStore((s) => s.totalPrice());

	return (
		<>
			{/* Overlay */}
			{open && (
				<div className="fixed inset-0 z-50 bg-black/40" onClick={onClose} />
			)}

			{/* Drawer */}
			<div
				className={`fixed right-0 top-0 z-50 flex h-full w-80 flex-col bg-white shadow-xl transition-transform duration-300 ${
					open ? "translate-x-0" : "translate-x-full"
				}`}
			>
				<div className="flex items-center justify-between border-b p-4">
					<h3 className="text-lg font-semibold">Giỏ hàng</h3>
					<button onClick={onClose} className="p-1">
						<X size={20} />
					</button>
				</div>

				<div className="flex-1 overflow-y-auto p-4">
					{items.length === 0 ? (
						<p className="py-8 text-center text-gray-400">Giỏ hàng trống</p>
					) : (
						<div className="space-y-4">
							{items.map((item) => (
								<div key={item.id} className="flex gap-3">
									{item.imgUrl ? (
										<img
											src={item.imgUrl}
											alt={item.productName}
											className="h-16 w-16 rounded object-cover"
										/>
									) : (
										<div className="flex h-16 w-16 items-center justify-center rounded bg-gray-100 text-xs text-gray-400">
											Ảnh
										</div>
									)}
									<div className="flex-1">
										<p className="line-clamp-1 text-sm font-medium">
											{item.productName}
										</p>
										<p className="text-xs text-gray-500">{item.name}</p>
										<div className="mt-1 flex items-center gap-2">
											<button
												onClick={() => updateQuantity(item.id, item.qty - 1)}
												className="rounded border p-0.5"
											>
												<Minus size={14} />
											</button>
											<span className="text-sm">{item.qty}</span>
											<button
												onClick={() => updateQuantity(item.id, item.qty + 1)}
												className="rounded border p-0.5"
											>
												<Plus size={14} />
											</button>
										</div>
									</div>
									<div className="flex flex-col items-end justify-between">
										<button
											onClick={() => removeItem(item.id)}
											className="text-gray-400 hover:text-red-500"
										>
											<Trash2 size={14} />
										</button>
										<span className="text-sm font-semibold">
											{formatCurrency(item.price * item.qty)}
										</span>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{items.length > 0 && (
					<div className="border-t p-4">
						<div className="mb-3 flex items-center justify-between">
							<span className="text-gray-600">Tổng cộng:</span>
							<span className="text-lg font-bold">
								{formatCurrency(totalPrice)}
							</span>
						</div>
						<Link
							to="/cart"
							onClick={onClose}
							className="block w-full rounded-md bg-[var(--color-brand-green)] py-2.5 text-center text-sm font-medium text-white hover:bg-[var(--color-brand-green)]/90"
						>
							Xem giỏ hàng
						</Link>
					</div>
				)}
			</div>
		</>
	);
};

export default MiniCart;
