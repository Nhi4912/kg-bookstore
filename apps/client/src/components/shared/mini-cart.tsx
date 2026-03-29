import { Minus, Plus, Trash2, X } from "lucide-react";
import { useEffect } from "react";
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

	// Close on Escape key
	useEffect(() => {
		if (!open) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [open, onClose]);

	return (
		<>
			{/* Overlay */}
			{open && (
				<div className="fixed inset-0 z-50 bg-black/40" onClick={onClose} />
			)}

			{/* Drawer */}
			<div
				role="dialog"
				aria-modal="true"
				aria-label="Giỏ hàng"
				className={`fixed right-0 top-0 z-50 flex h-full w-80 flex-col bg-white shadow-xl transition-transform duration-300 ${
					open ? "translate-x-0" : "translate-x-full"
				}`}
			>
				<div className="flex items-center justify-between border-b p-4">
					<h3 className="text-lg font-semibold">Giỏ hàng</h3>
					<button onClick={onClose} className="p-1" aria-label="Đóng giỏ hàng">
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
												className="rounded border p-1.5"
												aria-label="Giảm số lượng"
											>
												<Minus size={14} />
											</button>
											<span className="text-sm">{item.qty}</span>
											<button
												onClick={() => updateQuantity(item.id, item.qty + 1)}
												className="rounded border p-1.5"
												aria-label="Tăng số lượng"
											>
												<Plus size={14} />
											</button>
										</div>
									</div>
									<div className="flex flex-col items-end justify-between">
										<button
											onClick={() => removeItem(item.id)}
											className="text-gray-400 hover:text-red-500"
											aria-label="Xoá khỏi giỏ hàng"
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
