import type { ProductResponse } from "@kgbookstore/api-contract";
import { useMemo } from "react";
import ProductCard from "@/components/shared/product-card";
import { useProducts } from "@/hooks/use-products";

const RecentlyViewed = ({ productIds }: { productIds: string[] }) => {
	const { data } = useProducts({ limit: 8 });
	const products = useMemo(
		() =>
			(data?.items ?? []).filter((p: ProductResponse) =>
				productIds.includes(p.id),
			),
		[data, productIds],
	);

	if (products.length === 0) return null;

	return (
		<section className="mt-12">
			<h2 className="mb-4 text-xl font-bold">Các sản phẩm đã xem</h2>
			<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
				{products.map((p: ProductResponse) => (
					<ProductCard key={p.id} product={p} />
				))}
			</div>
		</section>
	);
};

export default RecentlyViewed;
