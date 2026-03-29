import type { ProductResponse } from "@kgbookstore/api-contract";
import { AlertTriangle } from "lucide-react";
import ProductCard from "./product-card";

const ProductSkeleton = () => (
	<div className="overflow-hidden rounded-lg border bg-white">
		<div className="aspect-square animate-pulse bg-gray-200" />
		<div className="space-y-2 p-3">
			<div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
			<div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
			<div className="h-8 animate-pulse rounded bg-gray-200" />
		</div>
	</div>
);

const ProductGrid = ({
	products,
	isLoading,
	isError = false,
	onRetry,
}: {
	products: ProductResponse[];
	isLoading: boolean;
	isError?: boolean;
	onRetry?: () => void;
}) => {
	if (isLoading) {
		return (
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 12 }).map((_, i) => (
					<ProductSkeleton key={i} />
				))}
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-gray-500">
				<AlertTriangle size={32} className="mb-3 text-amber-500" />
				<p className="mb-1 font-medium">Không thể tải sản phẩm</p>
				<p className="mb-4 text-sm">Vui lòng thử lại sau.</p>
				{onRetry ? (
					<button
						type="button"
						onClick={onRetry}
						className="rounded-md bg-[var(--color-brand-green)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-brand-green)]/90"
					>
						Thử lại
					</button>
				) : null}
			</div>
		);
	}

	if (products.length === 0) {
		return (
			<p className="py-12 text-center text-gray-500">Hiện chưa có sản phẩm</p>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{products.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	);
};

export default ProductGrid;
