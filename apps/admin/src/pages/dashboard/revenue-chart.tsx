import type { OrderResponse } from "@kgbookstore/api-contract";
import { useMemo } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import PaperSection from "@/components/shared/paper-section";
import { formatCurrency } from "@/lib/format";

interface RevenueChartProps {
	orders: OrderResponse[];
}

const DAYS = 7;

const RevenueChart = ({ orders }: RevenueChartProps) => {
	const chartData = useMemo(() => {
		const now = new Date();
		const days: { date: string; label: string; revenue: number }[] = [];

		for (let i = DAYS - 1; i >= 0; i--) {
			const d = new Date(now);
			d.setDate(d.getDate() - i);
			const dateStr = d.toISOString().slice(0, 10);
			const label = `${d.getDate()}/${d.getMonth() + 1}`;
			days.push({ date: dateStr, label, revenue: 0 });
		}

		for (const order of orders) {
			if (order.status === "CANCELLED") continue;
			const orderDate = order.created_at.slice(0, 10);
			const day = days.find((d) => d.date === orderDate);
			if (day) {
				day.revenue += order.bill_items.reduce(
					(sum, item) => sum + item.final_price,
					0,
				);
			}
		}

		return days;
	}, [orders]);

	const hasData = chartData.some((d) => d.revenue > 0);

	return (
		<PaperSection title="Doanh thu 7 ngày gần nhất">
			{hasData ? (
				<ResponsiveContainer width="100%" height={280}>
					<BarChart data={chartData}>
						<CartesianGrid strokeDasharray="3 3" vertical={false} />
						<XAxis dataKey="label" tick={{ fontSize: 12 }} />
						<YAxis
							tick={{ fontSize: 12 }}
							tickFormatter={(v: number) =>
								v >= 1_000_000
									? `${(v / 1_000_000).toFixed(1)}tr`
									: v >= 1_000
										? `${(v / 1_000).toFixed(0)}k`
										: String(v)
							}
							width={60}
						/>
						<Tooltip
							formatter={(value) => [
								formatCurrency(Number(value)),
								"Doanh thu",
							]}
							labelFormatter={(label) => `Ngày ${String(label)}`}
						/>
						<Bar
							dataKey="revenue"
							fill="var(--chart-1, oklch(0.646 0.222 41.116))"
							radius={[4, 4, 0, 0]}
						/>
					</BarChart>
				</ResponsiveContainer>
			) : (
				<div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
					Chưa có dữ liệu doanh thu
				</div>
			)}
		</PaperSection>
	);
};

export default RevenueChart;
