import { FilterIcon, Loader2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ProductFilter from "@/components/shared/product-filter";
import ProductGrid from "@/components/shared/product-grid";
import { useCollectionDetail } from "@/hooks/use-collections";
import { useProductQuery } from "@/hooks/use-product-query";

const CollectionPage = () => {
	const { id = "" } = useParams<{ id: string }>();
	const isAll = id === "all";
	const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

	const defaultQuery = useMemo(
		() => (isAll ? {} : { collection_ids: JSON.stringify([id]) }),
		[id, isAll],
	);

	const {
		listProducts,
		total,
		isLoading,
		canLoadMore,
		isLoadingMore,
		isShowClearFilter,
		filterQuery,
		loadMore,
		handleChangePrice,
		handleChangeVendors,
		clearFilter,
	} = useProductQuery(defaultQuery);

	const { data: collection } = useCollectionDetail(isAll ? "" : id);
	const title = isAll ? "Tất cả sản phẩm" : (collection?.title ?? "");

	return (
		<div className="mx-auto max-w-7xl px-4 py-8">
			{/* Collection banner */}
			<div className="mb-8 h-[140px] overflow-hidden rounded-lg bg-[url('https://theme.hstatic.net/200000427867/1000902683/14/collection_banner.jpg?v=6')] bg-cover bg-center sm:h-[200px]" />

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
				{/* Desktop filter sidebar */}
				<aside className="hidden lg:col-span-3 lg:block">
					<ProductFilter
						selectedVendors={filterQuery.vendor_ids}
						selectedPrice={{
							from: filterQuery.from_price,
							to: filterQuery.to_price,
						}}
						onChangeVendors={handleChangeVendors}
						onChangePrice={handleChangePrice}
					/>
					{isShowClearFilter && (
						<button
							onClick={clearFilter}
							className="mt-3 w-full rounded border border-[var(--color-brand-green)] py-2 text-sm text-[var(--color-brand-green)] transition-colors hover:bg-[var(--color-brand-green)] hover:text-white"
						>
							Xoá bộ lọc
						</button>
					)}
				</aside>

				{/* Content */}
				<div className="lg:col-span-9">
					{/* Header */}
					<div className="mb-4 flex items-center justify-between">
						<div>
							<h1 className="text-xl font-bold">{title}</h1>
							<p className="text-sm text-gray-500">
								<strong>{total}</strong> sản phẩm
							</p>
						</div>

						{/* Mobile filter toggle */}
						<button
							className="flex items-center gap-1.5 rounded border px-3 py-2 text-sm lg:hidden"
							onClick={() => setMobileFilterOpen(true)}
						>
							<FilterIcon size={16} />
							Bộ lọc
						</button>
					</div>

					{/* Product grid */}
					<ProductGrid products={listProducts} isLoading={isLoading} />

					{/* Load more */}
					{canLoadMore && (
						<div className="mt-6 text-center">
							<button
								onClick={loadMore}
								disabled={isLoadingMore}
								className="inline-flex items-center gap-2 rounded border border-[var(--color-brand-green)] px-6 py-2.5 text-sm text-[var(--color-brand-green)] transition-colors hover:bg-[var(--color-brand-green)] hover:text-white disabled:opacity-50"
							>
								{isLoadingMore && (
									<Loader2 size={16} className="animate-spin" />
								)}
								Xem thêm sản phẩm
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Mobile filter drawer */}
			{mobileFilterOpen && (
				<>
					<div
						className="fixed inset-0 z-50 bg-black/40"
						onClick={() => setMobileFilterOpen(false)}
					/>
					<div className="fixed inset-y-0 left-0 z-50 w-[280px] overflow-y-auto bg-white p-5 shadow-xl">
						<div className="mb-4 flex items-center justify-between">
							<h3 className="text-lg font-semibold">Bộ lọc</h3>
							<button onClick={() => setMobileFilterOpen(false)}>
								<X size={20} />
							</button>
						</div>
						<ProductFilter
							selectedVendors={filterQuery.vendor_ids}
							selectedPrice={{
								from: filterQuery.from_price,
								to: filterQuery.to_price,
							}}
							onChangeVendors={handleChangeVendors}
							onChangePrice={handleChangePrice}
						/>
						{isShowClearFilter && (
							<button
								onClick={clearFilter}
								className="mt-3 w-full rounded border border-[var(--color-brand-green)] py-2 text-sm text-[var(--color-brand-green)]"
							>
								Xoá bộ lọc
							</button>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default CollectionPage;
