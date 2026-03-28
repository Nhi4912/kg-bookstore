import type { CollectionQueryParams } from "@kgbookstore/api-contract";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	COLLECTION_SORT_OPTIONS,
	COLLECTION_TAG_OPTIONS,
	COLLECTION_VISIBILITY_OPTIONS,
} from "@/constants/collection";

interface CollectionFilterProps {
	filters: Partial<CollectionQueryParams> & { sort_key?: string };
	onFilterChange: (
		filters: Partial<CollectionQueryParams> & { sort_key?: string },
	) => void;
}

const CollectionFilter = ({
	filters,
	onFilterChange,
}: CollectionFilterProps) => {
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onFilterChange({ ...filters, name: e.target.value || undefined });
	};

	const handleSortChange = (value: string | null) => {
		const val = value ?? "";
		if (!val) {
			onFilterChange({
				...filters,
				sort_key: undefined,
				sort_by: "created_at",
				sort_dir: "desc",
			});
			return;
		}
		const [sort_by, sort_dir] = val.split("-") as [string, "asc" | "desc"];
		onFilterChange({ ...filters, sort_key: val, sort_by, sort_dir });
	};

	const handleVisibilityChange = (value: string | null) => {
		const val = value ?? "";
		onFilterChange({
			...filters,
			is_visible: val === "" ? undefined : val === "true",
		});
	};

	const handleTagChange = (value: string | null) => {
		const val = value ?? "";
		onFilterChange({
			...filters,
			tag: (val || undefined) as CollectionQueryParams["tag"],
		});
	};

	return (
		<div className="flex flex-wrap items-center gap-3">
			<div className="relative flex-1 min-w-[200px]">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
				<Input
					placeholder="Tìm kiếm nhóm sản phẩm..."
					value={filters.name ?? ""}
					onChange={handleSearchChange}
					className="pl-9"
				/>
			</div>
			<Select
				value={filters.sort_key ?? "created_at-desc"}
				onValueChange={handleSortChange}
			>
				<SelectTrigger className="w-[160px]">
					<SelectValue placeholder="Sắp xếp" />
				</SelectTrigger>
				<SelectContent>
					{COLLECTION_SORT_OPTIONS.map((opt) => (
						<SelectItem key={opt.value} value={opt.value}>
							{opt.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Select
				value={
					filters.is_visible === undefined ? "" : String(filters.is_visible)
				}
				onValueChange={handleVisibilityChange}
			>
				<SelectTrigger className="w-[140px]">
					<SelectValue placeholder="Trạng thái" />
				</SelectTrigger>
				<SelectContent>
					{COLLECTION_VISIBILITY_OPTIONS.map((opt) => (
						<SelectItem key={opt.value} value={opt.value}>
							{opt.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Select
				value={(filters.tag as string) ?? ""}
				onValueChange={handleTagChange}
			>
				<SelectTrigger className="w-[140px]">
					<SelectValue placeholder="Tag" />
				</SelectTrigger>
				<SelectContent>
					{COLLECTION_TAG_OPTIONS.map((opt) => (
						<SelectItem key={opt.value} value={opt.value}>
							{opt.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};

export default CollectionFilter;
