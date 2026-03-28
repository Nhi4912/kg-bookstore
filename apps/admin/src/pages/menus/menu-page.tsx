import type { CollectionResponse } from "@kgbookstore/api-contract";
import { Tree } from "antd";
import { Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CollectionSelectionDialog from "@/components/shared/collection-selection-dialog";
import PageWrapper from "@/components/shared/page-wrapper";
import PaperSection from "@/components/shared/paper-section";
import { Button } from "@/components/ui/button";
import { useMenu, useUpsertMenu } from "@/hooks/use-menu";
import {
	addNodeToTree,
	type DropInfo,
	handleTreeDrop,
	type MenuTreeNode,
	menuResponseToTree,
	removeNodeFromTree,
	treeToMenuRequest,
} from "@/utils/menu-tree";

// ─── Helpers ───

const getCollectionIds = (nodes: MenuTreeNode[]): string[] =>
	nodes.flatMap((n) => [n.collectionId, ...getCollectionIds(n.children ?? [])]);

// ─── Component ───

const MenuPage = () => {
	const { data: menuData, isLoading } = useMenu();
	const upsertMenu = useUpsertMenu();

	const [treeData, setTreeData] = useState<MenuTreeNode[]>([]);
	const [selectedKey, setSelectedKey] = useState<string | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [isDirty, setIsDirty] = useState(false);

	// Sync API data → local tree state
	useEffect(() => {
		if (menuData?.menu_items) {
			setTreeData(menuResponseToTree(menuData.menu_items));
			setIsDirty(false);
		}
	}, [menuData]);

	const handleAddCollection = (collection: CollectionResponse) => {
		setTreeData((prev) => addNodeToTree(prev, collection.id, collection.title));
		setIsDirty(true);
	};

	const handleRemoveSelected = () => {
		if (!selectedKey) return;
		setTreeData((prev) => removeNodeFromTree(prev, selectedKey));
		setSelectedKey(null);
		setIsDirty(true);
	};

	const handleDrop = (info: DropInfo) => {
		setTreeData((prev) => handleTreeDrop(prev, info));
		setIsDirty(true);
	};

	const handleSave = () => {
		const menuItems = treeToMenuRequest(treeData);
		upsertMenu.mutate(
			{ menu_items: menuItems },
			{
				onSuccess: () => {
					toast.success("Lưu danh mục thành công");
					setIsDirty(false);
				},
				onError: () => {
					toast.error("Lưu danh mục thất bại");
				},
			},
		);
	};

	return (
		<PageWrapper
			title="Danh Mục"
			action={
				<div className="flex gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => setDialogOpen(true)}
					>
						<Plus className="mr-1 h-4 w-4" />
						Thêm nhóm sản phẩm
					</Button>
					<Button
						variant="destructive"
						size="sm"
						disabled={!selectedKey}
						onClick={handleRemoveSelected}
					>
						<Trash2 className="mr-1 h-4 w-4" />
						Xoá
					</Button>
					<Button
						size="sm"
						disabled={!isDirty || upsertMenu.isPending}
						onClick={handleSave}
					>
						<Save className="mr-1 h-4 w-4" />
						{upsertMenu.isPending ? "Đang lưu..." : "Lưu thay đổi"}
					</Button>
				</div>
			}
		>
			<PaperSection>
				{isLoading ? (
					<p className="text-sm text-muted-foreground py-8 text-center">
						Đang tải danh mục...
					</p>
				) : treeData.length === 0 ? (
					<p className="text-sm text-muted-foreground py-8 text-center">
						Chưa có danh mục nào. Bấm &ldquo;Thêm nhóm sản phẩm&rdquo; để bắt
						đầu.
					</p>
				) : (
					<Tree
						treeData={treeData}
						draggable
						blockNode
						defaultExpandAll
						selectedKeys={selectedKey ? [selectedKey] : []}
						onSelect={(keys) =>
							setSelectedKey(keys.length > 0 ? (keys[0] as string) : null)
						}
						onDrop={(info) => handleDrop(info as unknown as DropInfo)}
						className="bg-transparent"
					/>
				)}
			</PaperSection>

			<CollectionSelectionDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				onSelect={handleAddCollection}
				excludeIds={getCollectionIds(treeData)}
			/>
		</PageWrapper>
	);
};

export default MenuPage;
