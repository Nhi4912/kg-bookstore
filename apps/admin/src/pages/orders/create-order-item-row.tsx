import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";

export interface OrderItemData {
	variant_id: string;
	product_name: string;
	variant_label: string;
	quantity: number;
	price: number;
}

interface CreateOrderItemRowProps {
	item: OrderItemData;
	onQuantityChange: (variantId: string, quantity: number) => void;
	onRemove: (variantId: string) => void;
}

const CreateOrderItemRow = ({
	item,
	onQuantityChange,
	onRemove,
}: CreateOrderItemRowProps) => (
	<div className="flex items-center gap-3 rounded-lg border p-3">
		<div className="h-12 w-12 rounded bg-muted" />
		<div className="flex-1">
			<p className="font-medium">{item.product_name}</p>
			<p className="text-xs text-muted-foreground">{item.variant_label}</p>
		</div>
		<div className="flex items-center gap-2">
			<Button
				type="button"
				variant="outline"
				size="icon-xs"
				onClick={() => onQuantityChange(item.variant_id, item.quantity - 1)}
			>
				-
			</Button>
			<span className="w-8 text-center">{item.quantity}</span>
			<Button
				type="button"
				variant="outline"
				size="icon-xs"
				onClick={() => onQuantityChange(item.variant_id, item.quantity + 1)}
			>
				+
			</Button>
		</div>
		<span className="w-24 text-right text-sm">
			{formatCurrency(item.price * item.quantity)}
		</span>
		<Button
			type="button"
			variant="ghost"
			size="icon-xs"
			onClick={() => onRemove(item.variant_id)}
		>
			×
		</Button>
	</div>
);

export default CreateOrderItemRow;
