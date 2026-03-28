import type { ProductResponse } from "@kgbookstore/api-contract";
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
}: {
	products: ProductResponse[];
	isLoading: boolean;
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
