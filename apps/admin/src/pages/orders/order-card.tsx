import type { OrderResponse } from "@kgbookstore/api-contract";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/constants";
import {
	ORDER_STATUS_LABELS,
	ORDER_STATUS_VARIANT,
	PAYMENT_METHOD_LABELS,
	SHIPMENT_STATUS_LABELS,
	SHIPMENT_STATUS_VARIANT,
} from "@/constants/order";
import {
	calculateBillTotal,
	formatAddress,
	formatCurrency,
	formatCustomerName,
	formatDate,
} from "@/lib/format";
import OrderItemRow from "./order-item-row";

interface OrderCardProps {
	order: OrderResponse;
}

const OrderCard = ({ order }: OrderCardProps) => {
	const customerName = formatCustomerName(order.customer);
	const totalAmount = calculateBillTotal(order.bill_items);

	const shippingBill = order.bill_items.find(
		(item) => item.type === "SHIPPING_BILL",
	);

	return (
		<Card>
			<CardContent className="p-4">
				{/* Header row */}
				<div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b pb-3">
					<div className="flex items-center gap-3">
						<Link
							to={`${ROUTES.ORDERS}/${order.order_id}`}
							className="font-medium text-primary hover:underline"
						>
							#{order.sequence_number ?? "—"}
						</Link>
						<span className="text-sm text-muted-foreground">
							{formatDate(order.created_at)}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<Badge variant={ORDER_STATUS_VARIANT[order.status] ?? "secondary"}>
							{ORDER_STATUS_LABELS[order.status] ?? order.status}
						</Badge>
						{order.shipment ? (
							<Badge
								variant={
									SHIPMENT_STATUS_VARIANT[order.shipment.status] ?? "outline"
								}
							>
								{SHIPMENT_STATUS_LABELS[order.shipment.status] ??
									order.shipment.status}
							</Badge>
						) : null}
					</div>
				</div>

				{/* Body: 2-col layout */}
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{/* Left: shipping info */}
					<div className="space-y-1 text-sm">
						<p className="font-medium">Thông tin giao hàng</p>
						<p>
							<span className="text-muted-foreground">Tên: </span>
							{customerName}
						</p>
						{order.shipment?.address ? (
							<p>
								<span className="text-muted-foreground">Địa chỉ: </span>
								{formatAddress(order.shipment)}
							</p>
						) : null}
						{order.customer?.phone_number ? (
							<p>
								<span className="text-muted-foreground">SĐT: </span>
								{order.customer.phone_number}
							</p>
						) : null}
						{order.note ? (
							<p>
								<span className="text-muted-foreground">Ghi chú: </span>
								{order.note}
							</p>
						) : null}
					</div>

					{/* Right: order items */}
					<div className="md:col-span-2">
						<div className="space-y-2">
							{order.order_items.map((item) => (
								<OrderItemRow key={item.id} item={item} compact />
							))}
						</div>

						{/* Totals */}
						<div className="mt-3 flex items-center justify-between border-t pt-2 text-sm">
							<div className="flex items-center gap-4">
								<span className="text-muted-foreground">
									Thanh toán:{" "}
									{order.bill_items[0]?.payment_method
										? (PAYMENT_METHOD_LABELS[
												order.bill_items[0].payment_method
											] ?? order.bill_items[0].payment_method)
										: "—"}
								</span>
								{shippingBill ? (
									<span className="text-muted-foreground">
										Phí giao hàng: {formatCurrency(shippingBill.final_price)}
									</span>
								) : null}
							</div>
							<span className="font-semibold">
								Tổng: {formatCurrency(totalAmount)}
							</span>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default OrderCard;
