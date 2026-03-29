import type { OrderResponse, OrderStatus } from "@kgbookstore/api-contract";
import PaperSection from "@/components/shared/paper-section";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	ORDER_STATUS_LABELS,
	ORDER_STATUS_VARIANT,
	PAYMENT_METHOD_LABELS,
	SHIPMENT_STATUS_LABELS,
	SHIPMENT_STATUS_VARIANT,
} from "@/constants/order";

const ORDER_STATUS_VALUES: OrderStatus[] = [
	"PENDING",
	"SUBMITTED",
	"CANCELLED",
	"INVOICED",
];

interface OrderStatusPanelProps {
	order: OrderResponse;
	onStatusChange: (newStatus: string | null) => void;
}

const OrderStatusPanel = ({ order, onStatusChange }: OrderStatusPanelProps) => (
	<PaperSection title="Trạng thái">
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<span className="text-sm text-muted-foreground">Đơn hàng</span>
				<Badge variant={ORDER_STATUS_VARIANT[order.status] ?? "secondary"}>
					{ORDER_STATUS_LABELS[order.status] ?? order.status}
				</Badge>
			</div>

			{order.shipment ? (
				<div className="flex items-center justify-between">
					<span className="text-sm text-muted-foreground">Giao hàng</span>
					<Badge
						variant={
							SHIPMENT_STATUS_VARIANT[order.shipment.status] ?? "outline"
						}
					>
						{SHIPMENT_STATUS_LABELS[order.shipment.status] ??
							order.shipment.status}
					</Badge>
				</div>
			) : null}

			<div className="flex items-center justify-between">
				<span className="text-sm text-muted-foreground">Thanh toán</span>
				<span className="text-sm">
					{order.bill_items[0]?.payment_method
						? (PAYMENT_METHOD_LABELS[order.bill_items[0].payment_method] ??
							order.bill_items[0].payment_method)
						: "—"}
				</span>
			</div>

			<div className="border-t pt-3">
				<label
					htmlFor="order-status-select"
					className="mb-1 block text-sm font-medium"
				>
					Cập nhật trạng thái
				</label>
				<Select value={order.status} onValueChange={onStatusChange}>
					<SelectTrigger id="order-status-select">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{ORDER_STATUS_VALUES.map((status) => (
							<SelectItem key={status} value={status}>
								{ORDER_STATUS_LABELS[status]}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	</PaperSection>
);

export default OrderStatusPanel;
