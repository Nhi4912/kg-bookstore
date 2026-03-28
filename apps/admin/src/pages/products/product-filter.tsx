import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	PRICE_SORT_OPTIONS,
	STOCK_STATUS_OPTIONS,
	VISIBILITY_OPTIONS,
} from "@/constants/product";

interface ProductFilterProps {
	search: string;
	onSearchChange: (value: string) => void;
	stockStatus: string;
	onStockStatusChange: (value: string) => void;
	visibility: string;
	onVisibilityChange: (value: string) => void;
	priceSort: string;
	onPriceSortChange: (value: string) => void;
}

const ProductFilter = ({
	search,
	onSearchChange,
	stockStatus,
	onStockStatusChange,
	visibility,
	onVisibilityChange,
	priceSort,
	onPriceSortChange,
}: ProductFilterProps) => {
	return (
		<div className="flex flex-wrap items-center gap-3">
			<Input
				placeholder="Tìm kiếm sản phẩm..."
				value={search}
				onChange={(e) => onSearchChange(e.target.value)}
				className="max-w-xs"
			/>
			<Select
				value={stockStatus}
				onValueChange={(val) => onStockStatusChange(val ?? "")}
			>
				<SelectTrigger className="w-[140px]">
					<SelectValue placeholder="Tồn kho" />
				</SelectTrigger>
				<SelectContent>
					{STOCK_STATUS_OPTIONS.map((opt) => (
						<SelectItem key={opt.value} value={opt.value}>
							{opt.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Select
				value={visibility}
				onValueChange={(val) => onVisibilityChange(val ?? "")}
			>
				<SelectTrigger className="w-[130px]">
					<SelectValue placeholder="Trạng thái" />
				</SelectTrigger>
				<SelectContent>
					{VISIBILITY_OPTIONS.map((opt) => (
						<SelectItem key={opt.value} value={opt.value}>
							{opt.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Select
				value={priceSort}
				onValueChange={(val) => onPriceSortChange(val ?? "")}
			>
				<SelectTrigger className="w-[150px]">
					<SelectValue placeholder="Sắp xếp giá" />
				</SelectTrigger>
				<SelectContent>
					{PRICE_SORT_OPTIONS.map((opt) => (
						<SelectItem key={opt.value} value={opt.value}>
							{opt.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};

export default ProductFilter;
