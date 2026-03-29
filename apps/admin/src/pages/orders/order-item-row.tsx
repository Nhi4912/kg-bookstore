import type { OrderItemResponse } from "@kgbookstore/api-contract";
import { formatCurrency } from "@/lib/format";

interface OrderItemRowProps {
	item: OrderItemResponse;
	compact?: boolean;
}

const OrderItemRow = ({ item, compact = false }: OrderItemRowProps) => {
	const imgSize = compact ? 40 : 48;
	const imgClass = compact ? "h-10 w-10" : "h-12 w-12";
	const priceText = compact
		? formatCurrency(item.product_price)
		: formatCurrency(item.product_price * item.quantity);

	return (
		<div
			className={
				compact
					? "flex items-center gap-3 text-sm"
					: "flex items-center gap-3 rounded-lg border p-3"
			}
		>
			{item.image?.url ? (
				<img
					src={item.image.url}
					alt={item.product_name}
					className={`${imgClass} rounded border object-cover`}
					width={imgSize}
					height={imgSize}
				/>
			) : (
				<div className={`${imgClass} rounded bg-muted`} />
			)}
			<div className="flex-1">
				<p className="font-medium">{item.product_name}</p>
				{item.attribute_values && item.attribute_values.length > 0 ? (
					<p className="text-xs text-muted-foreground">
						{item.attribute_values
							.map((av) => `${av.attribute_name}: ${av.attribute_value}`)
							.join(", ")}
					</p>
				) : null}
			</div>
			<span
				className={
					compact ? "text-muted-foreground" : "text-sm text-muted-foreground"
				}
			>
				x{item.quantity}
			</span>
			<span
				className={
					compact ? "w-24 text-right" : "w-28 text-right text-sm font-medium"
				}
			>
				{priceText}
			</span>
		</div>
	);
};

export default OrderItemRow;
