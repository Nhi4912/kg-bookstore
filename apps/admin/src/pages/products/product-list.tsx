import type { ProductQueryParams } from "@kgbookstore/api-contract";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "@/components/shared/data-table";
import PageWrapper from "@/components/shared/page-wrapper";
import PaperSection from "@/components/shared/paper-section";
import TablePagination from "@/components/shared/table-pagination";
import { Button } from "@/components/ui/button";
import { DEFAULT_PAGE_SIZE, ROUTES } from "@/constants";
import { useDebounce } from "@/hooks/use-debounce";
import { useProducts } from "@/hooks/use-products";
import { productColumns } from "./product-columns";
import ProductFilter from "./product-filter";

const ProductListPage = () => {
	const [search, setSearch] = useState("");
	const [stockStatus, setStockStatus] = useState("");
	const [visibility, setVisibility] = useState("");
	const [priceSort, setPriceSort] = useState("");
	const [offset, setOffset] = useState(0);
	const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);

	const debouncedSearch = useDebounce(search);

	const params: Partial<ProductQueryParams> = {
		limit,
		offset,
		...(debouncedSearch ? { name: debouncedSearch } : {}),
		...(stockStatus
			? { stock_status: stockStatus as "IN_STOCK" | "OUT_OF_STOCK" }
			: {}),
		...(visibility ? { is_visible: visibility === "true" } : {}),
		...(priceSort ? { price_sort_dir: priceSort as "asc" | "desc" } : {}),
	};

	const { data, isLoading } = useProducts(params);

	const handleLimitChange = (newLimit: number) => {
		setLimit(newLimit);
		setOffset(0);
	};

	return (
		<PageWrapper
			title="Sản Phẩm"
			action={
				<div className="flex items-center gap-2">
					<Button variant="outline" render={<Link to={ROUTES.COLLECTIONS} />}>
						Tạo nhóm sản phẩm
					</Button>
					<Button render={<Link to={ROUTES.PRODUCT_CREATE} />}>
						<Plus className="mr-1 size-4" />
						Tạo sản phẩm
					</Button>
				</div>
			}
		>
			<PaperSection>
				<div className="space-y-4">
					<ProductFilter
						search={search}
						onSearchChange={setSearch}
						stockStatus={stockStatus}
						onStockStatusChange={setStockStatus}
						visibility={visibility}
						onVisibilityChange={setVisibility}
						priceSort={priceSort}
						onPriceSortChange={setPriceSort}
					/>
					<DataTable
						columns={productColumns}
						data={data?.items ?? []}
						isLoading={isLoading}
						emptyMessage="Không có sản phẩm nào"
					/>
					{data?.paging && (
						<TablePagination
							total={data.paging.total}
							limit={limit}
							offset={offset}
							onPageChange={setOffset}
							onLimitChange={handleLimitChange}
						/>
					)}
				</div>
			</PaperSection>
		</PageWrapper>
	);
};

export default ProductListPage;
