import type { OrderResponse } from "@kgbookstore/api-contract";
import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import PaperSection from "@/components/shared/paper-section";

interface OrderStatusChartProps {
	orders: OrderResponse[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
	PENDING: { label: "Chờ xử lý", color: "#f59e0b" },
	SUBMITTED: { label: "Đã xác nhận", color: "#3b82f6" },
	INVOICED: { label: "Hoàn thành", color: "#22c55e" },
	CANCELLED: { label: "Đã hủy", color: "#ef4444" },
};

const OrderStatusChart = ({ orders }: OrderStatusChartProps) => {
	const chartData = useMemo(() => {
		const counts: Record<string, number> = {};
		for (const order of orders) {
			counts[order.status] = (counts[order.status] ?? 0) + 1;
		}
		return Object.entries(counts).map(([status, count]) => ({
			name: STATUS_CONFIG[status]?.label ?? status,
			value: count,
			color: STATUS_CONFIG[status]?.color ?? "#94a3b8",
		}));
	}, [orders]);

	const hasData = chartData.length > 0;

	return (
		<PaperSection title="Trạng thái đơn hàng">
			{hasData ? (
				<div className="flex flex-col items-center">
					<ResponsiveContainer width="100%" height={220}>
						<PieChart>
							<Pie
								data={chartData}
								cx="50%"
								cy="50%"
								innerRadius={50}
								outerRadius={80}
								paddingAngle={3}
								dataKey="value"
								label={({ name, percent }) =>
									`${name} ${((percent ?? 0) * 100).toFixed(0)}%`
								}
								labelLine={false}
							>
								{chartData.map((entry) => (
									<Cell key={entry.name} fill={entry.color} />
								))}
							</Pie>
							<Tooltip formatter={(value) => [Number(value), "Đơn hàng"]} />
						</PieChart>
					</ResponsiveContainer>
					<div className="mt-2 flex flex-wrap justify-center gap-4">
						{chartData.map((entry) => (
							<div key={entry.name} className="flex items-center gap-1.5">
								<span
									className="inline-block size-3 rounded-full"
									style={{ backgroundColor: entry.color }}
								/>
								<span className="text-xs text-muted-foreground">
									{entry.name} ({entry.value})
								</span>
							</div>
						))}
					</div>
				</div>
			) : (
				<div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
					Chưa có dữ liệu đơn hàng
				</div>
			)}
		</PaperSection>
	);
};

export default OrderStatusChart;
