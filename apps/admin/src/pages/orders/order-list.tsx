import { Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import PageWrapper from "@/components/shared/page-wrapper";
import PaperSection from "@/components/shared/paper-section";
import TablePagination from "@/components/shared/table-pagination";
import { Button } from "@/components/ui/button";
import { DEFAULT_PAGE_SIZE, ROUTES } from "@/constants";
import { useDebounce } from "@/hooks/use-debounce";
import { useOrders } from "@/hooks/use-orders";
import OrderCard from "./order-card";
import OrderFilter from "./order-filter";

const OrderListPage = () => {
	const [keyword, setKeyword] = useState("");
	const [orderStatus, setOrderStatus] = useState("");
	const [shipmentStatus, setShipmentStatus] = useState("");
	const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
	const [offset, setOffset] = useState(0);

	const debouncedKeyword = useDebounce(keyword);

	const { data, isLoading } = useOrders({
		limit,
		offset,
		keyword: debouncedKeyword || undefined,
		order_statuses: orderStatus
			? [orderStatus as "PENDING" | "SUBMITTED" | "CANCELLED" | "INVOICED"]
			: undefined,
		shipment_statuses: shipmentStatus ? [shipmentStatus] : undefined,
	});

	const orders = data?.items ?? [];
	const total = data?.paging?.total ?? 0;

	return (
		<PageWrapper
			title="Đơn Hàng"
			action={
				<Button render={<Link to={`${ROUTES.ORDERS}/create`} />}>
					<Plus className="mr-2 h-4 w-4" />
					Tạo đơn hàng
				</Button>
			}
		>
			<PaperSection>
				<div className="space-y-4">
					<OrderFilter
						keyword={keyword}
						onKeywordChange={setKeyword}
						orderStatus={orderStatus}
						onOrderStatusChange={setOrderStatus}
						shipmentStatus={shipmentStatus}
						onShipmentStatusChange={setShipmentStatus}
					/>

					{isLoading ? (
						<div className="py-8 text-center text-muted-foreground">
							Đang tải...
						</div>
					) : orders.length === 0 ? (
						<div className="py-8 text-center text-muted-foreground">
							Không có đơn hàng nào
						</div>
					) : (
						<div className="space-y-3">
							{orders.map((order) => (
								<OrderCard key={order.order_id} order={order} />
							))}
						</div>
					)}

					{total > 0 && (
						<TablePagination
							total={total}
							limit={limit}
							offset={offset}
							onLimitChange={(newLimit) => {
								setLimit(newLimit);
								setOffset(0);
							}}
							onPageChange={setOffset}
						/>
					)}
				</div>
			</PaperSection>
		</PageWrapper>
	);
};

export default OrderListPage;
