import type { CollectionQueryParams } from "@kgbookstore/api-contract";
import { useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "@/components/shared/data-table";
import PageWrapper from "@/components/shared/page-wrapper";
import PaperSection from "@/components/shared/paper-section";
import TablePagination from "@/components/shared/table-pagination";
import { Button } from "@/components/ui/button";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import { useCollections } from "@/hooks/use-collections";
import { useDebounce } from "@/hooks/use-debounce";
import { collectionColumns } from "./collection-columns";
import CollectionFilter from "./collection-filter";

const CollectionListPage = () => {
	const [filters, setFilters] = useState<
		Partial<CollectionQueryParams> & { sort_key?: string }
	>({
		sort_by: "created_at",
		sort_dir: "desc",
	});
	const [offset, setOffset] = useState(0);
	const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);

	const debouncedName = useDebounce(filters.name ?? "", 300);

	const queryParams: Partial<CollectionQueryParams> = {
		limit,
		offset,
		sort_by: filters.sort_by,
		sort_dir: filters.sort_dir,
		name: debouncedName || undefined,
		is_visible: filters.is_visible,
		tag: filters.tag,
	};

	const { data, isLoading } = useCollections(queryParams);

	const handleFilterChange = (
		newFilters: Partial<CollectionQueryParams> & { sort_key?: string },
	) => {
		setFilters(newFilters);
		setOffset(0);
	};

	return (
		<PageWrapper
			title="Nhóm sản phẩm"
			action={
				<Button render={<Link to="/collections/create" />}>
					Tạo nhóm sản phẩm
				</Button>
			}
		>
			<PaperSection>
				<div className="space-y-4">
					<CollectionFilter
						filters={filters}
						onFilterChange={handleFilterChange}
					/>
					<DataTable
						columns={collectionColumns}
						data={data?.items ?? []}
						isLoading={isLoading}
					/>
					<TablePagination
						total={data?.paging.total ?? 0}
						limit={limit}
						offset={offset}
						onPageChange={setOffset}
						onLimitChange={(newLimit: number) => {
							setLimit(newLimit);
							setOffset(0);
						}}
					/>
				</div>
			</PaperSection>
		</PageWrapper>
	);
};

export default CollectionListPage;
