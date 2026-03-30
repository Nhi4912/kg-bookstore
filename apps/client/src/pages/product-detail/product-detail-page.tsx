import type { VariantResponse } from "@kgbookstore/api-contract";
import { Loader2, Minus, Plus, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { BreadcrumbJsonLd, ProductJsonLd } from "@/components/seo/json-ld";
import Breadcrumb from "@/components/shared/breadcrumb";
import { useCanonicalUrl, useDocumentTitle } from "@/hooks/use-document-title";
import { useProductDetail } from "@/hooks/use-products";
import { formatCurrency } from "@/lib/format";
import { useCartStore } from "@/stores/cart-store";
import { useRecentStore } from "@/stores/recent-store";
import ProductImageGallery from "./product-image-gallery";
import RecentlyViewed from "./recently-viewed";
import RelatedProducts from "./related-products";
import VariantButton from "./variant-button";

const ProductDetailPage = () => {
	const { id = "" } = useParams<{ id: string }>();
	const { data: product, isLoading } = useProductDetail(id);
	const addItem = useCartStore((s) => s.addItem);
	const setCartOpen = useCartStore((s) => s.setCartOpen);
	const addProductId = useRecentStore((s) => s.addProductId);
	const getFilteredIds = useRecentStore((s) => s.getFilteredIds);

	useDocumentTitle(product?.name ?? "Sản phẩm");
	useCanonicalUrl(id ? `/product/${id}` : undefined);

	const [selectedVariant, setSelectedVariant] = useState<
		VariantResponse | undefined
	>(undefined);
	const [qty, setQty] = useState(1);

	// Set initial variant & track recently viewed
	/* eslint-disable react-hooks/set-state-in-effect -- sync API data to local editable variant selection */
	useEffect(() => {
		if (product) {
			setSelectedVariant(product.variants?.[0]);
			setQty(1);
			addProductId(product.id);
		}
	}, [product, addProductId]);
	/* eslint-enable react-hooks/set-state-in-effect */

	const recentIds = id ? getFilteredIds(id) : [];

	if (isLoading) {
		return (
			<div className="flex min-h-[50vh] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-gray-400" />
			</div>
		);
	}

	if (!product) {
		return (
			<div className="py-20 text-center text-gray-500">
				Không tìm thấy sản phẩm
			</div>
		);
	}

	const imageUrl = product.images?.[0]?.url;
	const allImages = product.images ?? [];
	const price = selectedVariant?.retail_price ?? 0;
	const variants = product.variants ?? [];

	const handleAddToCart = () => {
		if (!selectedVariant) return;

		const variantLabel =
			selectedVariant.attributes
				?.map((attr) => attr.value ?? attr.name)
				.join(" / ") ??
			selectedVariant.sku ??
			product.name;

		addItem({
			id: selectedVariant.id,
			name: variantLabel ?? product.name,
			productName: product.name,
			productId: product.id,
			qty,
			price,
			imgUrl: imageUrl ?? undefined,
		});

		toast.success("Thêm vào giỏ hàng thành công");
		setCartOpen(true);
		setQty(1);
	};

	return (
		<div className="mx-auto max-w-7xl px-4 py-8">
			<Breadcrumb items={[{ label: product.name }]} />
			<ProductJsonLd
				name={product.name}
				description={product.description ?? product.name}
				image={imageUrl ?? ""}
				price={price}
				url={window.location.href}
			/>
			<BreadcrumbJsonLd
				items={[
					{ name: "Trang chủ", url: "https://nhasachkiengiang.com" },
					{ name: product.name, url: window.location.href },
				]}
			/>
			{/* Product Intro */}
			<div className="grid gap-8 md:grid-cols-12">
				{/* Image Gallery */}
				<div className="md:col-span-4">
					<ProductImageGallery images={allImages} productName={product.name} />
				</div>

				{/* Info */}
				<div className="md:col-span-5">
					<h1 className="mb-3 text-2xl font-bold">{product.name}</h1>

					{product.vendor ? (
						<div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
							<span>Nhà cung cấp: </span>
							<span className="font-medium">{product.vendor.name}</span>
						</div>
					) : null}

					<p className="mb-1 text-3xl font-bold text-[var(--color-brand-green-text)]">
						{formatCurrency(price)}
					</p>
					{selectedVariant ? (
						<p
							className={`mb-4 text-sm font-medium ${
								selectedVariant.stock_quantity > 0
									? "text-[var(--color-brand-green-text)]"
									: "text-[var(--color-danger)]"
							}`}
						>
							{selectedVariant.stock_quantity > 0
								? selectedVariant.stock_quantity <= 5
									? `Chỉ còn ${selectedVariant.stock_quantity} sản phẩm`
									: "Còn hàng"
								: "Hết hàng"}
						</p>
					) : null}

					{/* Quantity */}
					<div className="mb-4 flex items-center gap-3">
						<button
							onClick={() => setQty((q) => Math.max(1, q - 1))}
							disabled={qty <= 1}
							className="rounded border p-2.5 disabled:opacity-40 dark:border-gray-600 dark:text-gray-300"
							aria-label="Giảm số lượng"
						>
							<Minus size={16} />
						</button>
						<span className="min-w-[2ch] text-center font-semibold">
							{String(qty).padStart(2, "0")}
						</span>
						<button
							onClick={() => setQty((q) => q + 1)}
							className="rounded border p-2.5 dark:border-gray-600 dark:text-gray-300"
							aria-label="Tăng số lượng"
						>
							<Plus size={16} />
						</button>
					</div>

					{/* Variants */}
					{variants.length > 1 ? (
						<div className="mb-4 flex flex-wrap gap-2">
							{variants.map((v) => (
								<VariantButton
									key={v.id}
									variant={v}
									isSelected={selectedVariant?.id === v.id}
									onClick={() => setSelectedVariant(v)}
								/>
							))}
						</div>
					) : null}

					{/* Add to Cart */}
					<button
						onClick={handleAddToCart}
						disabled={!selectedVariant || selectedVariant.stock_quantity <= 0}
						aria-label={`Thêm ${product.name} vào giỏ hàng`}
						className="flex items-center gap-2 rounded-md bg-[var(--color-brand-green)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-brand-green)]/90 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<ShoppingCart size={18} />
						Thêm vào giỏ hàng
					</button>
				</div>

				{/* Discount Panel Placeholder */}
				<div className="hidden md:col-span-3 md:block">
					<div className="rounded-lg border bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
						<h3 className="mb-2 text-sm font-semibold">Khuyến mãi</h3>
						<p className="text-xs text-gray-500 dark:text-gray-400">
							Chưa có khuyến mãi nào
						</p>
					</div>
				</div>
			</div>

			{/* Description */}
			{product.description ? (
				<div className="mt-12">
					<div className="border-b dark:border-gray-700">
						<span className="inline-block border-b-2 border-[var(--color-brand-green)] pb-3 text-sm font-semibold">
							Mô tả sản phẩm
						</span>
					</div>
					<div
						className="prose prose-sm mx-auto mt-6 max-w-[600px]"
						dangerouslySetInnerHTML={{ __html: product.description }}
					/>
				</div>
			) : null}

			{/* Related Products */}
			{product.collection_ids?.[0] ? (
				<RelatedProducts collectionId={product.collection_ids[0]} />
			) : null}

			{/* Recently Viewed */}
			{recentIds.length > 0 ? <RecentlyViewed productIds={recentIds} /> : null}
		</div>
	);
};

export default ProductDetailPage;
