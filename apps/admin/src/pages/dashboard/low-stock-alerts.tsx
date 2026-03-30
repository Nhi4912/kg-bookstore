import type { ProductResponse } from "@kgbookstore/api-contract";
import { AlertTriangle } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import PaperSection from "@/components/shared/paper-section";
import { ROUTES } from "@/constants";
import { LOW_STOCK_THRESHOLD } from "./stat-cards";

interface LowStockAlertsProps {
	products: ProductResponse[];
}

interface LowStockItem {
	productId: string;
	productName: string;
	variantSku: string;
	stock: number;
	imageUrl?: string;
}

const MAX_ITEMS = 8;

const LowStockAlerts = ({ products }: LowStockAlertsProps) => {
	const lowStockItems = useMemo(() => {
		const items: LowStockItem[] = [];
		for (const product of products) {
			for (const variant of product.variants ?? []) {
				if (variant.stock_quantity <= LOW_STOCK_THRESHOLD) {
					items.push({
						productId: product.id,
						productName: product.name,
						variantSku: variant.sku || "—",
						stock: variant.stock_quantity,
						imageUrl: product.images?.[0]?.url,
					});
				}
			}
		}
		return items.sort((a, b) => a.stock - b.stock).slice(0, MAX_ITEMS);
	}, [products]);

	if (lowStockItems.length === 0) {
		return (
			<PaperSection title="Cảnh báo tồn kho">
				<div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
					<AlertTriangle className="size-6 opacity-40" />
					<p className="text-sm">Tất cả sản phẩm đều đủ hàng</p>
				</div>
			</PaperSection>
		);
	}

	return (
		<PaperSection title="Cảnh báo tồn kho">
			<div className="space-y-2">
				{lowStockItems.map((item) => (
					<Link
						key={`${item.productId}-${item.variantSku}`}
						to={ROUTES.PRODUCT_EDIT(item.productId)}
						className="flex items-center gap-3 rounded-lg border p-2.5 transition-colors hover:bg-muted/50"
					>
						{item.imageUrl ? (
							<img
								src={item.imageUrl}
								alt={item.productName}
								className="size-10 rounded-md object-cover"
							/>
						) : (
							<div className="flex size-10 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
								N/A
							</div>
						)}
						<div className="min-w-0 flex-1">
							<p className="truncate text-sm font-medium">{item.productName}</p>
							<p className="text-xs text-muted-foreground">
								SKU: {item.variantSku}
							</p>
						</div>
						<span
							className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
								item.stock === 0
									? "bg-red-100 text-red-700"
									: "bg-amber-100 text-amber-700"
							}`}
						>
							{item.stock === 0 ? "Hết hàng" : `Còn ${item.stock}`}
						</span>
					</Link>
				))}
			</div>
		</PaperSection>
	);
};

export default LowStockAlerts;
