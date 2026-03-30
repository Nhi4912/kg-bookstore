import type { OrderResponse, ProductResponse } from "@kgbookstore/api-contract";
import { AlertTriangle, DollarSign, Package, ShoppingCart } from "lucide-react";
import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";

interface StatCardsProps {
	orders: OrderResponse[];
	products: ProductResponse[];
}

const LOW_STOCK_THRESHOLD = 10;

const StatCards = ({ orders, products }: StatCardsProps) => {
	const stats = useMemo(() => {
		const totalOrders = orders.length;
		const totalRevenue = orders.reduce((sum, order) => {
			const orderTotal = order.bill_items.reduce(
				(s, item) => s + item.final_price,
				0,
			);
			return sum + orderTotal;
		}, 0);
		const totalProducts = products.length;
		const lowStockCount = products.reduce((count, product) => {
			const hasLowStock = product.variants?.some(
				(v) => v.stock_quantity <= LOW_STOCK_THRESHOLD,
			);
			return hasLowStock ? count + 1 : count;
		}, 0);

		return { totalOrders, totalRevenue, totalProducts, lowStockCount };
	}, [orders, products]);

	const cards = [
		{
			label: "Đơn hàng",
			value: stats.totalOrders.toLocaleString("vi-VN"),
			icon: ShoppingCart,
			color: "text-blue-600",
			bg: "bg-blue-50",
		},
		{
			label: "Doanh thu",
			value: formatCurrency(stats.totalRevenue),
			icon: DollarSign,
			color: "text-emerald-600",
			bg: "bg-emerald-50",
		},
		{
			label: "Sản phẩm",
			value: stats.totalProducts.toLocaleString("vi-VN"),
			icon: Package,
			color: "text-violet-600",
			bg: "bg-violet-50",
		},
		{
			label: "Sắp hết hàng",
			value: stats.lowStockCount.toLocaleString("vi-VN"),
			icon: AlertTriangle,
			color: stats.lowStockCount > 0 ? "text-amber-600" : "text-gray-400",
			bg: stats.lowStockCount > 0 ? "bg-amber-50" : "bg-gray-50",
		},
	];

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{cards.map((card) => (
				<Card key={card.label}>
					<CardContent className="pt-6">
						<div className="flex items-center gap-4">
							<div className={`rounded-lg p-3 ${card.bg}`}>
								<card.icon className={`size-5 ${card.color}`} />
							</div>
							<div className="min-w-0">
								<p className="text-sm text-muted-foreground">{card.label}</p>
								<p className="truncate text-lg font-semibold">{card.value}</p>
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
};

export default StatCards;
export { LOW_STOCK_THRESHOLD };
