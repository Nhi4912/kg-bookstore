import type { CollectionResponse } from "@kgbookstore/api-contract";
import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCollections } from "@/hooks/use-collections";
import { useDebounce } from "@/hooks/use-debounce";

interface CollectionSelectionDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSelect: (collection: CollectionResponse) => void;
	excludeIds?: string[];
}

const CollectionSelectionDialog = ({
	open,
	onOpenChange,
	onSelect,
	excludeIds = [],
}: CollectionSelectionDialogProps) => {
	const [search, setSearch] = useState("");
	const debouncedSearch = useDebounce(search);

	const { data, isLoading } = useCollections({
		limit: 50,
		name: debouncedSearch || undefined,
	});

	const collections = (data?.items ?? []).filter(
		(c) => !excludeIds.includes(c.id),
	);

	const handleSelect = (collection: CollectionResponse) => {
		onSelect(collection);
		onOpenChange(false);
		setSearch("");
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Chọn nhóm sản phẩm</DialogTitle>
				</DialogHeader>

				<div className="relative">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Tìm kiếm nhóm sản phẩm..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-9"
					/>
				</div>

				<div className="max-h-64 overflow-y-auto space-y-1">
					{isLoading && (
						<p className="text-sm text-muted-foreground py-4 text-center">
							Đang tải...
						</p>
					)}
					{!isLoading && collections.length === 0 && (
						<p className="text-sm text-muted-foreground py-4 text-center">
							Không tìm thấy nhóm sản phẩm
						</p>
					)}
					{collections.map((collection) => (
						<Button
							key={collection.id}
							variant="ghost"
							className="w-full justify-start text-left"
							onClick={() => handleSelect(collection)}
						>
							{collection.title}
						</Button>
					))}
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default CollectionSelectionDialog;
