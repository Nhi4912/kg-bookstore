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
	ORDER_STATUS_OPTIONS,
	SHIPMENT_STATUS_OPTIONS,
} from "@/constants/order";

interface OrderFilterProps {
	keyword: string;
	onKeywordChange: (value: string) => void;
	orderStatus: string;
	onOrderStatusChange: (value: string) => void;
	shipmentStatus: string;
	onShipmentStatusChange: (value: string) => void;
}

const OrderFilter = ({
	keyword,
	onKeywordChange,
	orderStatus,
	onOrderStatusChange,
	shipmentStatus,
	onShipmentStatusChange,
}: OrderFilterProps) => {
	return (
		<div className="flex flex-wrap items-center gap-3">
			<div className="relative w-64">
				<Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					placeholder="Tìm kiếm khách hàng..."
					value={keyword}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						onKeywordChange(e.target.value)
					}
					className="pl-9"
				/>
			</div>

			<Select
				value={orderStatus}
				onValueChange={(v: string | null) => onOrderStatusChange(v ?? "")}
			>
				<SelectTrigger className="w-44">
					<SelectValue placeholder="Trạng thái đơn hàng" />
				</SelectTrigger>
				<SelectContent>
					{ORDER_STATUS_OPTIONS.map((opt) => (
						<SelectItem key={opt.value} value={opt.value}>
							{opt.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select
				value={shipmentStatus}
				onValueChange={(v: string | null) => onShipmentStatusChange(v ?? "")}
			>
				<SelectTrigger className="w-44">
					<SelectValue placeholder="Trạng thái giao hàng" />
				</SelectTrigger>
				<SelectContent>
					{SHIPMENT_STATUS_OPTIONS.map((opt) => (
						<SelectItem key={opt.value} value={opt.value}>
							{opt.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};

export default OrderFilter;
