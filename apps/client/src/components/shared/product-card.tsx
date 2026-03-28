import type { ProductResponse } from "@kgbookstore/api-contract";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/format";
import { useCartStore } from "@/stores/cart-store";

const ProductCard = ({ product }: { product: ProductResponse }) => {
	const addItem = useCartStore((s) => s.addItem);
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
	};

	return (
		<div className="group overflow-hidden rounded-lg border bg-white transition-shadow hover:shadow-md">
			<Link
				to={`/product/${product.id}`}
				className="block aspect-square overflow-hidden bg-gray-100"
			>
				{imageUrl ? (
					<img
						src={imageUrl}
						alt={product.name}
						className="h-full w-full object-cover transition-transform group-hover:scale-105"
					/>
				) : (
					<div className="flex h-full items-center justify-center text-gray-300">
						Không có ảnh
					</div>
				)}
			</Link>
			<div className="p-3">
				<Link
					to={`/product/${product.id}`}
					className="line-clamp-2 text-sm font-medium text-gray-800 hover:text-[var(--color-brand-green)]"
				>
					{product.name}
				</Link>
				<p className="mt-1 text-base font-bold text-[var(--color-brand-green)]">
					{formatCurrency(price)}
				</p>
				<button
					onClick={handleAddToCart}
					disabled={!firstVariant}
					className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md bg-[var(--color-brand-green)] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[var(--color-brand-green)]/90 disabled:opacity-50"
				>
					<ShoppingCart size={14} />
					Thêm vào giỏ
				</button>
			</div>
		</div>
	);
};

export default ProductCard;
