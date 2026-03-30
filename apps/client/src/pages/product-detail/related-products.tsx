import { Link } from "react-router-dom";
import ProductCard from "@/components/shared/product-card";
import { useProducts } from "@/hooks/use-products";

const RelatedProductsSkeleton = () => (
	<section className="mt-12">
		<div className="mb-4 h-6 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
		<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
			{Array.from({ length: 4 }).map((_, i) => (
				<div
					key={i}
					className="overflow-hidden rounded-lg border bg-white dark:border-gray-700 dark:bg-gray-800"
				>
					<div className="aspect-square animate-pulse bg-gray-200 dark:bg-gray-700" />
					<div className="space-y-2 p-3">
						<div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
						<div className="h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
					</div>
				</div>
			))}
		</div>
	</section>
);

const RelatedProducts = ({ collectionId }: { collectionId: string }) => {
	const { data, isLoading } = useProducts({
		collectionIds: [collectionId],
		limit: 8,
	});
	const products = data?.items ?? [];

	if (isLoading) return <RelatedProductsSkeleton />;
	if (products.length === 0) return null;

	return (
		<section className="mt-12">
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-xl font-bold">Các sản phẩm liên quan</h2>
				<Link
					to={`/collection/${collectionId}`}
					className="text-sm text-gray-500 hover:text-[var(--color-brand-green-text)] dark:text-gray-400"
				>
					Xem thêm &rarr;
				</Link>
			</div>
			<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
				{products.map((p) => (
					<ProductCard key={p.id} product={p} />
				))}
			</div>
		</section>
	);
};

export default RelatedProducts;
