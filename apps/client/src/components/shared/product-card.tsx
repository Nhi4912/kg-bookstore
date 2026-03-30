import type { ProductResponse } from "@kgbookstore/api-contract";
import { Heart, ShoppingCart } from "lucide-react";
import { memo, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";

const ProductCard = memo(({ product }: { product: ProductResponse }) => {
	const addItem = useCartStore((s) => s.addItem);
	const toggleWishlist = useWishlistStore((s) => s.toggleItem);
	const isWishlisted = useWishlistStore((s) =>
		s.items.some((i) => i.productId === product.id),
	);
	const firstVariant = product.variants?.[0];
	const imageUrl = product.images?.[0]?.url;
	const price = firstVariant?.retail_price ?? 0;

	const handleAddToCart = () => {
		if (!firstVariant) return;
		addItem({
			id: firstVariant.id,
			name: firstVariant.sku || product.name,
			productName: product.name,
			productId: product.id,
			qty: 1,
			price,
			imgUrl: imageUrl ?? undefined,
		});
		toast.success(`Đã thêm "${product.name}" vào giỏ hàng`);
	};

	const handleToggleWishlist = useCallback(() => {
		toggleWishlist({
			productId: product.id,
			name: product.name,
			imgUrl: imageUrl ?? undefined,
			price,
			addedAt: Date.now(),
		});
		toast.success(
			isWishlisted
				? `Đã xóa "${product.name}" khỏi yêu thích`
				: `Đã thêm "${product.name}" vào yêu thích`,
		);
	}, [toggleWishlist, product.id, product.name, imageUrl, price, isWishlisted]);

	return (
		<div className="group relative overflow-hidden rounded-lg border bg-white transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
			{/* Wishlist heart button */}
			<button
				onClick={handleToggleWishlist}
				aria-label={
					isWishlisted
						? `Xóa ${product.name} khỏi yêu thích`
						: `Thêm ${product.name} vào yêu thích`
				}
				aria-pressed={isWishlisted}
				className="absolute right-2 top-2 z-10 rounded-full bg-white/80 p-2 shadow-sm backdrop-blur-sm transition-colors hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
			>
				<Heart
					size={16}
					className={
						isWishlisted
							? "fill-red-500 text-red-500"
							: "text-gray-400 hover:text-red-400"
					}
				/>
			</button>

			<Link
				to={`/product/${product.id}`}
				className="block aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700"
			>
				{imageUrl ? (
					<img
						src={imageUrl}
						alt={product.name}
						loading="lazy"
						className="h-full w-full object-cover transition-transform group-hover:scale-105"
					/>
				) : (
					<div className="flex h-full items-center justify-center text-gray-300 dark:text-gray-500">
						Không có ảnh
					</div>
				)}
			</Link>
			<div className="p-3 dark:text-gray-200">
				<Link
					to={`/product/${product.id}`}
					className="line-clamp-2 text-sm font-medium text-gray-800 hover:text-[var(--color-brand-green-text)] dark:text-gray-200"
				>
					{product.name}
				</Link>
				<p className="mt-1 text-lg font-bold text-[var(--color-brand-green-text)]">
					{formatCurrency(price)}
				</p>
				<button
					onClick={handleAddToCart}
					disabled={!firstVariant}
					aria-label={`Thêm ${product.name} vào giỏ hàng`}
					className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md bg-[var(--color-brand-green)] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-brand-green)]/90 disabled:opacity-50"
				>
					<ShoppingCart size={14} />
					Thêm vào giỏ
				</button>
			</div>
		</div>
	);
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
