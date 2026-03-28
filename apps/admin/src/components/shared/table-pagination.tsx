import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface TablePaginationProps {
	total: number;
	limit: number;
	offset: number;
	onPageChange: (offset: number) => void;
	onLimitChange?: (limit: number) => void;
	pageSizeOptions?: number[];
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

const TablePagination = ({
	total,
	limit,
	offset,
	onPageChange,
	onLimitChange,
	pageSizeOptions = [...PAGE_SIZE_OPTIONS],
}: TablePaginationProps) => {
	const currentPage = Math.floor(offset / limit) + 1;
	const totalPages = Math.max(1, Math.ceil(total / limit));

	const handleFirst = () => {
		onPageChange(0);
	};

	const handlePrevious = () => {
		onPageChange(Math.max(0, offset - limit));
	};

	const handleNext = () => {
		const nextOffset = offset + limit;
		if (nextOffset < total) {
			onPageChange(nextOffset);
		}
	};

	const handleLast = () => {
		onPageChange((totalPages - 1) * limit);
	};

	return (
		<div className="flex items-center justify-between px-2 py-4">
			<div className="flex items-center gap-2 text-sm text-muted-foreground">
				<span>Hiển thị</span>
				{onLimitChange ? (
					<Select
						value={String(limit)}
						onValueChange={(val) => onLimitChange(Number(val))}
					>
						<SelectTrigger className="h-8 w-[70px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{pageSizeOptions.map((size) => (
								<SelectItem key={size} value={String(size)}>
									{size}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				) : (
					<span className="font-medium">{limit}</span>
				)}
				<span>/ {total} kết quả</span>
			</div>

			<div className="flex items-center gap-2">
				<span className="text-sm text-muted-foreground">
					Trang {currentPage} / {totalPages}
				</span>
				<div className="flex items-center gap-1">
					<Button
						variant="outline"
						size="icon-xs"
						onClick={handleFirst}
						disabled={currentPage <= 1}
					>
						<ChevronsLeft className="size-4" />
					</Button>
					<Button
						variant="outline"
						size="icon-xs"
						onClick={handlePrevious}
						disabled={currentPage <= 1}
					>
						<ChevronLeft className="size-4" />
					</Button>
					<Button
						variant="outline"
						size="icon-xs"
						onClick={handleNext}
						disabled={currentPage >= totalPages}
					>
						<ChevronRight className="size-4" />
					</Button>
					<Button
						variant="outline"
						size="icon-xs"
						onClick={handleLast}
						disabled={currentPage >= totalPages}
					>
						<ChevronsRight className="size-4" />
					</Button>
				</div>
			</div>
		</div>
	);
};

export default TablePagination;
