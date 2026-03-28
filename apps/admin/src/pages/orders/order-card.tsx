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
import { formatCurrency, formatDate } from "@/lib/format";

interface OrderCardProps {
	order: OrderResponse;
}

const OrderCard = ({ order }: OrderCardProps) => {
	const customerName = order.customer
		? `${order.customer.last_name} ${order.customer.first_name}`
		: "—";

	const totalAmount = order.bill_items.reduce(
		(sum, item) => sum + item.final_price,
		0,
	);

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
						{order.shipment && (
							<Badge
								variant={
									SHIPMENT_STATUS_VARIANT[order.shipment.status] ?? "outline"
								}
							>
								{SHIPMENT_STATUS_LABELS[order.shipment.status] ??
									order.shipment.status}
							</Badge>
						)}
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
						{order.shipment?.address && (
							<p>
								<span className="text-muted-foreground">Địa chỉ: </span>
								{[
									order.shipment.address,
									order.shipment.ward_name,
									order.shipment.district_name,
									order.shipment.province_name,
								]
									.filter(Boolean)
									.join(", ")}
							</p>
						)}
						{order.customer?.phone_number && (
							<p>
								<span className="text-muted-foreground">SĐT: </span>
								{order.customer.phone_number}
							</p>
						)}
						{order.note && (
							<p>
								<span className="text-muted-foreground">Ghi chú: </span>
								{order.note}
							</p>
						)}
					</div>

					{/* Right: order items */}
					<div className="md:col-span-2">
						<div className="space-y-2">
							{order.order_items.map((item) => (
								<div key={item.id} className="flex items-center gap-3 text-sm">
									{item.image?.url && (
										<img
											src={item.image.url}
											alt={item.product_name}
											className="h-10 w-10 rounded border object-cover"
										/>
									)}
									<div className="flex-1">
										<p className="font-medium">{item.product_name}</p>
										{item.attribute_values &&
											item.attribute_values.length > 0 && (
												<p className="text-xs text-muted-foreground">
													{item.attribute_values
														.map(
															(av) =>
																`${av.attribute_name}: ${av.attribute_value}`,
														)
														.join(", ")}
												</p>
											)}
									</div>
									<span className="text-muted-foreground">
										x{item.quantity}
									</span>
									<span className="w-24 text-right">
										{formatCurrency(item.product_price)}
									</span>
								</div>
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
								{shippingBill && (
									<span className="text-muted-foreground">
										Phí giao hàng: {formatCurrency(shippingBill.final_price)}
									</span>
								)}
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
