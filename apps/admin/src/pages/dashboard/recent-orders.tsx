import type { OrderResponse } from "@kgbookstore/api-contract";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import PaperSection from "@/components/shared/paper-section";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants";
import {
	calculateBillTotal,
	formatCurrency,
	formatCustomerName,
	formatRelativeDate,
} from "@/lib/format";

interface RecentOrdersProps {
	orders: OrderResponse[];
}

const STATUS_BADGE: Record<
	string,
	{
		label: string;
		variant: "default" | "secondary" | "destructive" | "outline";
	}
> = {
	PENDING: { label: "Chờ xử lý", variant: "outline" },
	SUBMITTED: { label: "Đã xác nhận", variant: "default" },
	INVOICED: { label: "Hoàn thành", variant: "secondary" },
	CANCELLED: { label: "Đã hủy", variant: "destructive" },
};

const MAX_ORDERS = 5;

const RecentOrders = ({ orders }: RecentOrdersProps) => {
	const recentOrders = useMemo(
		() =>
			[...orders]
				.sort(
					(a, b) =>
						new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
				)
				.slice(0, MAX_ORDERS),
		[orders],
	);

	if (recentOrders.length === 0) {
		return (
			<PaperSection title="Đơn hàng gần đây">
				<p className="py-6 text-center text-sm text-muted-foreground">
					Chưa có đơn hàng nào
				</p>
			</PaperSection>
		);
	}

	return (
		<PaperSection title="Đơn hàng gần đây">
			<div className="space-y-3">
				{recentOrders.map((order) => {
					const badge = STATUS_BADGE[order.status] ?? {
						label: order.status,
						variant: "outline" as const,
					};
					const total = calculateBillTotal(order.bill_items);

					return (
						<Link
							key={order.order_id}
							to={`${ROUTES.ORDERS}/${order.order_id}`}
							className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
						>
							<div className="min-w-0 flex-1">
								<div className="flex items-center gap-2">
									<span className="text-sm font-medium">
										#{order.sequence_number ?? "—"}
									</span>
									<Badge variant={badge.variant}>{badge.label}</Badge>
								</div>
								<p className="mt-0.5 truncate text-xs text-muted-foreground">
									{formatCustomerName(order.customer)} &middot;{" "}
									{formatRelativeDate(order.created_at)}
								</p>
							</div>
							<span className="ml-4 shrink-0 text-sm font-semibold">
								{formatCurrency(total)}
							</span>
						</Link>
					);
				})}
			</div>
			{orders.length > MAX_ORDERS ? (
				<Link
					to={ROUTES.ORDERS}
					className="mt-3 block text-center text-sm text-primary hover:underline"
				>
					Xem tất cả đơn hàng
				</Link>
			) : null}
		</PaperSection>
	);
};

export default RecentOrders;
