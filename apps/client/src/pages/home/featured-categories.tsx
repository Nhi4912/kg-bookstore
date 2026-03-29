import { Link } from "react-router-dom";
import { useSpecialTag } from "@/hooks/use-special-tag";

const CATEGORY_COLORS = [
	"#faf1ff",
	"#faf4eb",
	"#f4e6e5",
	"#e6f2f4",
	"#fff6f6",
] as const;

const CategorySkeleton = () => (
	<div className="flex flex-col items-start justify-between rounded-lg bg-gray-100 p-4 sm:p-6">
		<div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
		<div className="mt-3 h-3 w-1/2 animate-pulse rounded bg-gray-200" />
	</div>
);

const FeaturedCategories = () => {
	const { data: specialTag, isLoading } = useSpecialTag();

	if (isLoading) {
		return (
			<section className="mx-auto mb-10 max-w-7xl px-4">
				<div className="mb-4 h-6 w-40 animate-pulse rounded bg-gray-200" />
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
					{Array.from({ length: 5 }).map((_, i) => (
						<CategorySkeleton key={i} />
					))}
				</div>
			</section>
		);
	}

	if (!specialTag) return null;

	return (
		<section className="mx-auto mb-10 max-w-7xl px-4">
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-xl font-bold">{specialTag.tag_name}</h2>
			</div>

			<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
				{specialTag.collections.map((col, idx) => (
					<Link
						key={col.collection_id}
						to={`/collection/${col.collection_id}`}
						className="flex flex-col items-start justify-between rounded-lg p-4 transition-shadow hover:shadow-md sm:p-6"
						style={{
							backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
						}}
					>
						<h3 className="text-sm font-bold sm:text-base">
							{col.collection_name}
						</h3>
						<span className="mt-3 text-xs text-gray-600 sm:text-sm">
							Xem ngay &rarr;
						</span>
					</Link>
				))}
			</div>
		</section>
	);
};

export default FeaturedCategories;
