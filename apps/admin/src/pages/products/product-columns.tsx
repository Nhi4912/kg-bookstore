import type { ProductResponse } from "@kgbookstore/api-contract";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants";

const productColumns: ColumnDef<ProductResponse>[] = [
	{
		accessorKey: "name",
		header: "Sản phẩm",
		cell: ({ row }) => {
			const product = row.original;
			const thumbnail = product.images?.[0]?.url;

			return (
				<div className="flex items-center gap-3">
					{thumbnail ? (
						<img
							src={thumbnail}
							alt={product.name}
							className="size-10 rounded-md object-cover"
						/>
					) : (
						<div className="flex size-10 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
							N/A
						</div>
					)}
					<Link
						to={ROUTES.PRODUCT_EDIT(product.id)}
						className="font-medium text-primary hover:underline"
					>
						{product.name}
					</Link>
				</div>
			);
		},
	},
	{
		id: "variants",
		header: "Biến thể",
		cell: ({ row }) => {
			const count = row.original.variants?.length ?? 0;
			return <span className="text-muted-foreground">{count}</span>;
		},
	},
	{
		accessorKey: "description",
		header: "Mô tả",
		cell: ({ row }) => {
			const desc = row.original.description;
			if (!desc) return <span className="text-muted-foreground">—</span>;

			const text = desc.replace(/<[^>]*>/g, "");
			const truncated = text.length > 80 ? `${text.slice(0, 80)}...` : text;
			return <span className="text-sm text-muted-foreground">{truncated}</span>;
		},
	},
	{
		accessorKey: "is_visible",
		header: "Trạng thái",
		cell: ({ row }) => {
			const isVisible = row.original.is_visible;
			return isVisible ? (
				<Badge variant="default">Hiển thị</Badge>
			) : (
				<Badge variant="secondary">Ẩn</Badge>
			);
		},
	},
];

export { productColumns };
