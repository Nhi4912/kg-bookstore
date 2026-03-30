import ErrorState from "@/components/shared/error-state";
import LoadingState from "@/components/shared/loading-state";
import PageWrapper from "@/components/shared/page-wrapper";
import { useOrders } from "@/hooks/use-orders";
import { useProducts } from "@/hooks/use-products";
import LowStockAlerts from "./low-stock-alerts";
import OrderStatusChart from "./order-status-chart";
import RecentOrders from "./recent-orders";
import RevenueChart from "./revenue-chart";
import StatCards from "./stat-cards";

const DashboardPage = () => {
	const {
		data: orderData,
		isLoading: ordersLoading,
		isError: ordersError,
		refetch: refetchOrders,
	} = useOrders({ limit: 100, sort_by: "created_at", sort_dir: "desc" });

	const {
		data: productData,
		isLoading: productsLoading,
		isError: productsError,
		refetch: refetchProducts,
	} = useProducts({ limit: 200 });

	const isLoading = ordersLoading || productsLoading;
	const isError = ordersError || productsError;
	const orders = orderData?.items ?? [];
	const products = productData?.items ?? [];

	if (isLoading) {
		return (
			<PageWrapper title="Tổng Quan">
				<LoadingState message="Đang tải dữ liệu..." />
			</PageWrapper>
		);
	}

	if (isError) {
		return (
			<PageWrapper title="Tổng Quan">
				<ErrorState
					onRetry={() => {
						refetchOrders();
						refetchProducts();
					}}
				/>
			</PageWrapper>
		);
	}

	return (
		<PageWrapper title="Tổng Quan">
			<div className="space-y-6">
				{/* Stats cards */}
				<StatCards orders={orders} products={products} />

				{/* Charts row */}
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
					<div className="lg:col-span-3">
						<RevenueChart orders={orders} />
					</div>
					<div className="lg:col-span-2">
						<OrderStatusChart orders={orders} />
					</div>
				</div>

				{/* Lists row */}
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<RecentOrders orders={orders} />
					<LowStockAlerts products={products} />
				</div>
			</div>
		</PageWrapper>
	);
};

export default DashboardPage;
