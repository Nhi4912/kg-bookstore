import type { OrderStatus } from "@kgbookstore/api-contract";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import ErrorState from "@/components/shared/error-state";
import LoadingState from "@/components/shared/loading-state";
import NotFoundState from "@/components/shared/not-found-state";
import PageWrapper from "@/components/shared/page-wrapper";
import PaperSection from "@/components/shared/paper-section";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import { useOrderDetail, useUpdateOrder } from "@/hooks/use-orders";
import {
	calculateBillTotal,
	formatAddress,
	formatCurrency,
	formatCustomerName,
	formatDate,
} from "@/lib/format";
import OrderItemRow from "./order-item-row";
import OrderStatusPanel from "./order-status-panel";

const OrderDetailPage = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { data: order, isLoading, isError, refetch } = useOrderDetail(id ?? "");
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
				<LoadingState />
			</PageWrapper>
		);
	}

	if (isError) {
		return (
			<PageWrapper title="Chi tiết đơn hàng">
				<ErrorState onRetry={() => refetch()} />
			</PageWrapper>
		);
	}

	if (!order) {
		return (
			<PageWrapper title="Chi tiết đơn hàng">
				<NotFoundState message="Không tìm thấy đơn hàng" />
			</PageWrapper>
		);
	}

	const customerName = formatCustomerName(order.customer);
	const totalAmount = calculateBillTotal(order.bill_items);

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
					<PaperSection title="Sản phẩm">
						<div className="space-y-3">
							{order.order_items.map((item) => (
								<OrderItemRow key={item.id} item={item} />
							))}
						</div>
					</PaperSection>

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
					<OrderStatusPanel order={order} onStatusChange={handleStatusChange} />

					<PaperSection title="Khách hàng">
						<div className="space-y-2 text-sm">
							<p>
								<span className="text-muted-foreground">Tên: </span>
								{customerName}
							</p>
							{order.customer?.phone_number ? (
								<p>
									<span className="text-muted-foreground">SĐT: </span>
									{order.customer.phone_number}
								</p>
							) : null}
							{order.customer?.address ? (
								<p>
									<span className="text-muted-foreground">Địa chỉ: </span>
									{order.customer.address}
								</p>
							) : null}
						</div>
					</PaperSection>

					{order.shipment ? (
						<PaperSection title="Giao hàng">
							<div className="space-y-2 text-sm">
								<p>
									<span className="text-muted-foreground">Địa chỉ: </span>
									{formatAddress(order.shipment)}
								</p>
								{order.shipment.phone_number ? (
									<p>
										<span className="text-muted-foreground">SĐT: </span>
										{order.shipment.phone_number}
									</p>
								) : null}
							</div>
						</PaperSection>
					) : null}

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
							{order.note ? (
								<p>
									<span className="text-muted-foreground">Ghi chú: </span>
									{order.note}
								</p>
							) : null}
						</div>
					</PaperSection>
				</div>
			</div>
		</PageWrapper>
	);
};

export default OrderDetailPage;
