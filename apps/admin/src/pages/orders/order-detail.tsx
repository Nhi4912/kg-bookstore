import type { OrderStatus } from "@kgbookstore/api-contract";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import PageWrapper from "@/components/shared/page-wrapper";
import PaperSection from "@/components/shared/paper-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ROUTES } from "@/constants";
import {
	ORDER_STATUS_LABELS,
	ORDER_STATUS_VARIANT,
	PAYMENT_METHOD_LABELS,
	SHIPMENT_STATUS_LABELS,
	SHIPMENT_STATUS_VARIANT,
} from "@/constants/order";
import { useOrderDetail, useUpdateOrder } from "@/hooks/use-orders";
import { formatCurrency, formatDate } from "@/lib/format";

const ORDER_STATUS_VALUES: OrderStatus[] = [
	"PENDING",
	"SUBMITTED",
	"CANCELLED",
	"INVOICED",
];

const OrderDetailPage = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { data: order, isLoading } = useOrderDetail(id ?? "");
	const updateOrder = useUpdateOrder();

	const handleStatusChange = async (newStatus: string | null) => {
		if (!id || !newStatus) return;
		try {
			await updateOrder.mutateAsync({
				order_id: id,
				order_status: newStatus as OrderStatus,
			});
			toast.success("Cập nhật trạng thái thành công");
		} catch {
			toast.error("Cập nhật trạng thái thất bại");
		}
	};

	if (isLoading) {
		return (
			<PageWrapper title="Chi tiết đơn hàng">
				<div className="py-8 text-center text-muted-foreground">
					Đang tải...
				</div>
			</PageWrapper>
		);
	}

	if (!order) {
		return (
			<PageWrapper title="Chi tiết đơn hàng">
				<div className="py-8 text-center text-muted-foreground">
					Không tìm thấy đơn hàng
				</div>
			</PageWrapper>
		);
	}

	const customerName = order.customer
		? `${order.customer.last_name} ${order.customer.first_name}`
		: "—";

	const totalAmount = order.bill_items.reduce(
		(sum, item) => sum + item.final_price,
		0,
	);

	return (
		<PageWrapper
			title={`Đơn hàng #${order.sequence_number ?? id}`}
			action={
				<Button variant="outline" onClick={() => navigate(ROUTES.ORDERS)}>
					Quay lại
				</Button>
			}
		>
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Left: Order info */}
				<div className="space-y-6 lg:col-span-2">
					{/* Order items */}
					<PaperSection title="Sản phẩm">
						<div className="space-y-3">
							{order.order_items.map((item) => (
								<div
									key={item.id}
									className="flex items-center gap-3 rounded-lg border p-3"
								>
									{item.image?.url ? (
										<img
											src={item.image.url}
											alt={item.product_name}
											className="h-12 w-12 rounded border object-cover"
										/>
									) : (
										<div className="h-12 w-12 rounded bg-muted" />
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
									<span className="text-sm text-muted-foreground">
										x{item.quantity}
									</span>
									<span className="w-28 text-right text-sm font-medium">
										{formatCurrency(item.product_price * item.quantity)}
									</span>
								</div>
							))}
						</div>
					</PaperSection>

					{/* Bill items summary */}
					<PaperSection title="Thanh toán">
						<div className="space-y-2 text-sm">
							{order.bill_items.map((bill) => (
								<div key={bill.id} className="flex justify-between">
									<span className="text-muted-foreground">{bill.type}</span>
									<span>{formatCurrency(bill.final_price)}</span>
								</div>
							))}
							<div className="flex justify-between border-t pt-2 font-semibold">
								<span>Tổng</span>
								<span>{formatCurrency(totalAmount)}</span>
							</div>
						</div>
					</PaperSection>
				</div>

				{/* Right: Status + Customer + Shipping */}
				<div className="space-y-6">
					{/* Status */}
					<PaperSection title="Trạng thái">
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">Đơn hàng</span>
								<Badge
									variant={ORDER_STATUS_VARIANT[order.status] ?? "secondary"}
								>
									{ORDER_STATUS_LABELS[order.status] ?? order.status}
								</Badge>
							</div>

							{order.shipment && (
								<div className="flex items-center justify-between">
									<span className="text-sm text-muted-foreground">
										Giao hàng
									</span>
									<Badge
										variant={
											SHIPMENT_STATUS_VARIANT[order.shipment.status] ??
											"outline"
										}
									>
										{SHIPMENT_STATUS_LABELS[order.shipment.status] ??
											order.shipment.status}
									</Badge>
								</div>
							)}

							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">
									Thanh toán
								</span>
								<span className="text-sm">
									{order.bill_items[0]?.payment_method
										? (PAYMENT_METHOD_LABELS[
												order.bill_items[0].payment_method
											] ?? order.bill_items[0].payment_method)
										: "—"}
								</span>
							</div>

							<div className="border-t pt-3">
								<label className="mb-1 block text-sm font-medium">
									Cập nhật trạng thái
								</label>
								<Select value={order.status} onValueChange={handleStatusChange}>
									<SelectTrigger>
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

					{/* Customer */}
					<PaperSection title="Khách hàng">
						<div className="space-y-2 text-sm">
							<p>
								<span className="text-muted-foreground">Tên: </span>
								{customerName}
							</p>
							{order.customer?.phone_number && (
								<p>
									<span className="text-muted-foreground">SĐT: </span>
									{order.customer.phone_number}
								</p>
							)}
							{order.customer?.address && (
								<p>
									<span className="text-muted-foreground">Địa chỉ: </span>
									{order.customer.address}
								</p>
							)}
						</div>
					</PaperSection>

					{/* Shipping */}
					{order.shipment && (
						<PaperSection title="Giao hàng">
							<div className="space-y-2 text-sm">
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
								{order.shipment.phone_number && (
									<p>
										<span className="text-muted-foreground">SĐT: </span>
										{order.shipment.phone_number}
									</p>
								)}
							</div>
						</PaperSection>
					)}

					{/* Meta */}
					<PaperSection title="Thông tin">
						<div className="space-y-2 text-sm">
							<p>
								<span className="text-muted-foreground">Ngày tạo: </span>
								{formatDate(order.created_at)}
							</p>
							<p>
								<span className="text-muted-foreground">Cập nhật: </span>
								{formatDate(order.updated_at)}
							</p>
							{order.note && (
								<p>
									<span className="text-muted-foreground">Ghi chú: </span>
									{order.note}
								</p>
							)}
						</div>
					</PaperSection>
				</div>
			</div>
		</PageWrapper>
	);
};

export default OrderDetailPage;
