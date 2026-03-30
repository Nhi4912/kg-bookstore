import type { ProductResponse } from "@kgbookstore/api-contract";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "@/components/shared/product-card";
import { useProducts } from "@/hooks/use-products";
import { useTags } from "@/hooks/use-tags";

/* ─── Single tag section (grid layout) ─── */
const TagSectionGrid = ({
	tagId,
	title,
	collectionIds,
}: {
	tagId: string;
	title: string;
	collectionIds: string[];
}) => {
	const { data } = useProducts({ collectionIds, limit: 8 });
	const products = data?.items ?? [];

	if (products.length === 0) return null;

	return (
		<section className="mx-auto mb-12 max-w-7xl px-4">
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-xl font-bold">{title}</h2>
				<Link
					to={`/products/tag/${tagId}`}
					className="flex items-center gap-1 text-sm text-gray-600 hover:text-[var(--color-brand-green-text)]"
				>
					Xem tất cả
					<ArrowRight size={16} />
				</Link>
			</div>
			<div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{products.map((product: ProductResponse) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</section>
	);
};

/* ─── Single tag section (carousel-like with pink bg) ─── */
const TagSectionHighlight = ({
	tagId,
	title,
	collectionIds,
}: {
	tagId: string;
	title: string;
	collectionIds: string[];
}) => {
	const { data } = useProducts({ collectionIds, limit: 8 });
	const products = data?.items ?? [];

	if (products.length === 0) return null;

	return (
		<section className="mb-12 bg-[#fff6f6] py-10">
			<div className="mx-auto max-w-7xl px-4">
				<div className="mb-4 flex items-center justify-between">
					<h2 className="text-xl font-bold">{title}</h2>
					<Link
						to={`/products/tag/${tagId}`}
						className="flex items-center gap-1 text-sm text-gray-600 hover:text-[var(--color-brand-green-text)]"
					>
						Xem tất cả
						<ArrowRight size={16} />
					</Link>
				</div>
				<div className="flex gap-4 overflow-x-auto pb-2">
					{products.map((product: ProductResponse) => (
						<div
							key={product.id}
							className="w-[180px] shrink-0 sm:w-[220px] lg:w-[260px]"
						>
							<ProductCard product={product} />
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

/* ─── Products by tag (alternating layouts) ─── */
const ProductsByTag = () => {
	const { tagList } = useTags();

	return (
		<>
			{tagList.map((tag, idx) =>
				idx % 2 === 0 ? (
					<TagSectionGrid
						key={tag.tag_id}
						tagId={tag.tag_id}
						title={tag.tag_name}
						collectionIds={tag.collection_ids}
					/>
				) : (
					<TagSectionHighlight
						key={tag.tag_id}
						tagId={tag.tag_id}
						title={tag.tag_name}
						collectionIds={tag.collection_ids}
					/>
				),
			)}
		</>
	);
};

export default ProductsByTag;
