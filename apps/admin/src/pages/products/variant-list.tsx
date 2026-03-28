import type { VariantResponse } from "@kgbookstore/api-contract";
import { Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ROUTES } from "@/constants";
import { useDeleteProductVariant } from "@/hooks/use-variants";
import { formatCurrency } from "@/lib/format";

interface VariantListProps {
	productId: string;
	variants: VariantResponse[];
}

const VariantList = ({ productId, variants }: VariantListProps) => {
	const deleteMutation = useDeleteProductVariant(productId);

	const handleDelete = async (variantId: string) => {
		if (!confirm("Bạn có chắc chắn muốn xóa biến thể này?")) return;
		try {
			await deleteMutation.mutateAsync(variantId);
			toast.success("Đã xóa biến thể");
		} catch {
			toast.error("Không thể xóa biến thể");
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<span className="text-sm text-muted-foreground">
					{variants.length} biến thể
				</span>
				<Button
					size="sm"
					render={<Link to={ROUTES.VARIANT_CREATE(productId)} />}
				>
					<Plus className="mr-1 size-3.5" />
					Thêm biến thể
				</Button>
			</div>

			{variants.length > 0 ? (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Thuộc tính</TableHead>
							<TableHead>SKU</TableHead>
							<TableHead>Barcode</TableHead>
							<TableHead>Giá bán</TableHead>
							<TableHead>Giá vốn</TableHead>
							<TableHead>Tồn kho</TableHead>
							<TableHead className="w-[80px]" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{variants.map((variant) => (
							<TableRow key={variant.id}>
								<TableCell>
									<div className="flex flex-wrap gap-1">
										{variant.attributes.length > 0 ? (
											variant.attributes.map((attr) => (
												<Badge key={attr.id} variant="outline">
													{attr.name}: {attr.value}
												</Badge>
											))
										) : (
											<span className="text-muted-foreground">Mặc định</span>
										)}
									</div>
								</TableCell>
								<TableCell>{variant.sku || "—"}</TableCell>
								<TableCell>{variant.barcode || "—"}</TableCell>
								<TableCell>{formatCurrency(variant.retail_price)}</TableCell>
								<TableCell>{formatCurrency(variant.cost_price)}</TableCell>
								<TableCell>{variant.stock_quantity}</TableCell>
								<TableCell>
									<div className="flex items-center gap-1">
										<Button
											size="icon-xs"
											variant="ghost"
											render={
												<Link to={ROUTES.VARIANT_EDIT(productId, variant.id)} />
											}
										>
											<span className="sr-only">Sửa</span>
											✏️
										</Button>
										<Button
											size="icon-xs"
											variant="ghost"
											onClick={() => handleDelete(variant.id)}
										>
											<Trash2 className="size-3.5 text-destructive" />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			) : (
				<p className="py-6 text-center text-sm text-muted-foreground">
					Chưa có biến thể nào
				</p>
			)}
		</div>
	);
};

export default VariantList;
