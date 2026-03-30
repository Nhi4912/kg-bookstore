import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Breadcrumb from "@/components/shared/breadcrumb";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { formatCurrency } from "@/lib/format";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";

const WishlistPage = () => {
	useDocumentTitle("Danh sách yêu thích");
	const items = useWishlistStore((s) => s.items);
	const removeItem = useWishlistStore((s) => s.removeItem);
	const clearWishlist = useWishlistStore((s) => s.clearWishlist);
	const addCartItem = useCartStore((s) => s.addItem);

	const handleMoveToCart = (item: (typeof items)[0]) => {
		addCartItem({
			id: item.productId,
			name: item.name,
			productName: item.name,
			productId: item.productId,
			qty: 1,
			price: item.price,
			imgUrl: item.imgUrl,
		});
		removeItem(item.productId);
		toast.success(`Đã chuyển "${item.name}" vào giỏ hàng`);
	};

	return (
		<div className="mx-auto max-w-7xl px-4 py-8">
			<Breadcrumb items={[{ label: "Danh sách yêu thích" }]} />

			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold tracking-tight">
					Danh sách yêu thích
				</h1>
				{items.length > 0 ? (
					<button
						onClick={() => {
							clearWishlist();
							toast.success("Đã xóa tất cả khỏi danh sách yêu thích");
						}}
						className="text-sm text-gray-500 hover:text-red-500"
					>
						Xóa tất cả
					</button>
				) : null}
			</div>

			{items.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
					<Heart size={48} className="mb-4 text-gray-300 dark:text-gray-600" />
					<p className="mb-2 text-lg font-medium">Chưa có sản phẩm yêu thích</p>
					<p className="mb-6 text-sm">
						Hãy thêm sản phẩm vào danh sách yêu thích để xem lại sau.
					</p>
					<Link
						to="/"
						className="rounded-md bg-[var(--color-brand-green)] px-6 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-brand-green)]/90"
					>
						Tiếp tục mua sắm
					</Link>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{items.map((item) => (
						<div
							key={item.productId}
							className="group overflow-hidden rounded-lg border bg-white transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
						>
							<Link
								to={`/product/${item.productId}`}
								className="block aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700"
							>
								{item.imgUrl ? (
									<img
										src={item.imgUrl}
										alt={item.name}
										loading="lazy"
										className="h-full w-full object-cover transition-transform group-hover:scale-105"
									/>
								) : (
									<div className="flex h-full items-center justify-center text-gray-300 dark:text-gray-500">
										Không có ảnh
									</div>
								)}
							</Link>
							<div className="p-3">
								<Link
									to={`/product/${item.productId}`}
									className="line-clamp-2 text-sm font-medium text-gray-800 hover:text-[var(--color-brand-green-text)] dark:text-gray-200"
								>
									{item.name}
								</Link>
								<p className="mt-1 text-lg font-bold text-[var(--color-brand-green-text)]">
									{formatCurrency(item.price)}
								</p>
								<div className="mt-2 flex gap-2">
									<button
										onClick={() => handleMoveToCart(item)}
										className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-[var(--color-brand-green)] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-brand-green)]/90"
									>
										<ShoppingCart size={14} />
										Thêm vào giỏ
									</button>
									<button
										onClick={() => {
											removeItem(item.productId);
											toast.success(`Đã xóa "${item.name}" khỏi yêu thích`);
										}}
										aria-label={`Xóa ${item.name} khỏi yêu thích`}
										className="rounded-md border px-2.5 py-2 text-gray-400 transition-colors hover:border-red-200 hover:text-red-500 dark:border-gray-600 dark:text-gray-500"
									>
										<Trash2 size={14} />
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default WishlistPage;
