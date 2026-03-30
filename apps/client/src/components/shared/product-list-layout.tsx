import { ArrowDownUp, FilterIcon, Loader2, X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import type { SortOption, useProductQuery } from "@/hooks/use-product-query";
import ProductFilter from "./product-filter";

type ProductQueryReturn = ReturnType<typeof useProductQuery>;

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
	{ value: "newest", label: "Mới nhất" },
	{ value: "oldest", label: "Cũ nhất" },
	{ value: "price_asc", label: "Giá tăng dần" },
	{ value: "price_desc", label: "Giá giảm dần" },
	{ value: "name_asc", label: "Tên A-Z" },
	{ value: "name_desc", label: "Tên Z-A" },
];

interface ProductListLayoutProps {
	title: string;
	subtitle?: string;
	headerSlot?: ReactNode;
	children: ReactNode;
	productQuery: ProductQueryReturn;
}

const ProductListLayout = ({
	title,
	subtitle,
	headerSlot,
	children,
	productQuery,
}: ProductListLayoutProps) => {
	const {
		canLoadMore,
		isLoadingMore,
		isShowClearFilter,
		filterQuery,
		loadMore,
		handleChangePrice,
		handleChangeVendors,
		handleChangeSort,
		clearFilter,
	} = productQuery;

	const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
	const mobileFilterRef = useFocusTrap(mobileFilterOpen);

	// Close mobile filter on Escape
	useEffect(() => {
		if (!mobileFilterOpen) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") setMobileFilterOpen(false);
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [mobileFilterOpen]);

	const filterSidebar = (
		<>
			<ProductFilter
				selectedVendors={filterQuery.vendor_ids}
				selectedPrice={{
					from: filterQuery.from_price,
					to: filterQuery.to_price,
				}}
				onChangeVendors={handleChangeVendors}
				onChangePrice={handleChangePrice}
			/>
			{isShowClearFilter ? (
				<button
					onClick={clearFilter}
					className="mt-3 w-full rounded border border-[var(--color-brand-green)] py-2 text-sm text-[var(--color-brand-green-text)] transition-colors hover:bg-[var(--color-brand-green)] hover:text-white"
				>
					Xoá bộ lọc
				</button>
			) : null}
		</>
	);

	return (
		<div className="mx-auto max-w-7xl px-4 py-8">
			{headerSlot}

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
				{/* Desktop filter sidebar */}
				<aside className="hidden lg:col-span-3 lg:block">{filterSidebar}</aside>

				{/* Content */}
				<div className="lg:col-span-9">
					{/* Header */}
					<div className="mb-4 flex flex-wrap items-center justify-between gap-3">
						<div>
							{title ? <h1 className="text-xl font-bold">{title}</h1> : null}
							{subtitle ? (
								<p className="text-sm text-gray-500">{subtitle}</p>
							) : null}
						</div>

						<div className="flex items-center gap-2">
							{/* Sort dropdown */}
							<div className="flex items-center gap-1.5">
								<ArrowDownUp size={14} className="text-gray-500" />
								<select
									value={filterQuery.sort}
									onChange={(e) =>
										handleChangeSort(e.target.value as SortOption)
									}
									className="rounded border bg-white px-2 py-1.5 text-sm text-gray-700 focus:border-[var(--color-brand-green)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-green)]"
									aria-label="Sắp xếp"
								>
									{SORT_OPTIONS.map((opt) => (
										<option key={opt.value} value={opt.value}>
											{opt.label}
										</option>
									))}
								</select>
							</div>

							{/* Mobile filter toggle */}
							<button
								className="flex items-center gap-1.5 rounded border px-3 py-1.5 text-sm lg:hidden"
								onClick={() => setMobileFilterOpen(true)}
							>
								<FilterIcon size={16} />
								Bộ lọc
							</button>
						</div>
					</div>

					{/* Product grid slot */}
					{children}

					{/* Load more */}
					{canLoadMore ? (
						<div className="mt-6 text-center">
							<button
								onClick={loadMore}
								disabled={isLoadingMore}
								className="inline-flex items-center gap-2 rounded border border-[var(--color-brand-green)] px-6 py-2.5 text-sm text-[var(--color-brand-green-text)] transition-colors hover:bg-[var(--color-brand-green)] hover:text-white disabled:opacity-50"
							>
								{isLoadingMore ? (
									<Loader2 size={16} className="animate-spin" />
								) : null}
								Xem thêm sản phẩm
							</button>
						</div>
					) : null}
				</div>
			</div>

			{/* Mobile filter drawer */}
			{mobileFilterOpen ? (
				<>
					<div
						className="fixed inset-0 z-50 bg-black/40"
						onClick={() => setMobileFilterOpen(false)}
					/>
					<div
						ref={mobileFilterRef}
						role="dialog"
						aria-modal="true"
						aria-label="Bộ lọc"
						className="fixed inset-y-0 left-0 z-50 w-[min(280px,85vw)] overflow-y-auto bg-white p-5 shadow-xl"
					>
						<div className="mb-4 flex items-center justify-between">
							<h3 className="text-lg font-semibold">Bộ lọc</h3>
							<button
								onClick={() => setMobileFilterOpen(false)}
								aria-label="Đóng bộ lọc"
							>
								<X size={20} />
							</button>
						</div>
						{filterSidebar}
					</div>
				</>
			) : null}
		</div>
	);
};

export default ProductListLayout;
