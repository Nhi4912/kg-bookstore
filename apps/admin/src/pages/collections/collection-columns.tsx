import type { CollectionResponse } from "@kgbookstore/api-contract";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const collectionColumns: ColumnDef<CollectionResponse>[] = [
	{
		accessorKey: "title",
		header: "Nhóm sản phẩm",
		cell: ({ row }) => {
			const collection = row.original;
			return (
				<div className="flex items-center gap-3">
					{collection.image ? (
						<img
							src={collection.image.url}
							alt={collection.title}
							className="size-10 rounded object-cover"
						/>
					) : (
						<div className="size-10 rounded bg-muted" />
					)}
					<Link
						to={`/collections/${collection.id}/edit`}
						className="font-medium text-primary hover:underline"
					>
						{collection.title}
					</Link>
				</div>
			);
		},
	},
	{
		accessorKey: "tag",
		header: "Tag",
		cell: ({ getValue }) => {
			const tag = getValue<string>();
			return (
				<Badge variant={tag === "SIGNATURE" ? "default" : "secondary"}>
					{tag}
				</Badge>
			);
		},
	},
	{
		accessorKey: "description",
		header: "Mô tả",
		cell: ({ getValue }) => {
			const html = getValue<string>();
			const text = html.replace(/<[^>]*>/g, "");
			return (
				<span className="line-clamp-1 max-w-[300px] text-muted-foreground">
					{text || "—"}
				</span>
			);
		},
	},
	{
		accessorKey: "is_visible",
		header: "Trạng thái",
		cell: ({ getValue }) => {
			const visible = getValue<boolean>();
			return (
				<Badge variant={visible ? "default" : "outline"}>
					{visible ? "Hiển thị" : "Ẩn"}
				</Badge>
			);
		},
	},
];

export { collectionColumns };
