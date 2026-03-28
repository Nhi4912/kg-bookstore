import type {
	MenuItemInput,
	MenuItemResponse,
} from "@kgbookstore/api-contract";
import type { TreeDataNode } from "antd";

// ─── Types ───

export interface MenuTreeNode extends TreeDataNode {
	key: string;
	title: string;
	collectionId: string;
	path: string[];
	children?: MenuTreeNode[];
}

// ─── API → Ant Design Tree ───

const menuItemToTreeNode = (item: MenuItemResponse): MenuTreeNode => ({
	key: `${item.id}__${item.collection_id}`,
	title: item.name,
	collectionId: item.collection_id,
	path: item.path,
	children: (item.sub_menus ?? [])
		.sort((a, b) => a.order_number - b.order_number)
		.map(menuItemToTreeNode),
});

export const menuResponseToTree = (items: MenuItemResponse[]): MenuTreeNode[] =>
	items.sort((a, b) => a.order_number - b.order_number).map(menuItemToTreeNode);

// ─── Ant Design Tree → API Request ───

const treeNodeToMenuItem = (
	node: MenuTreeNode,
	parentPath: string[],
	orderNumber: number,
): MenuItemInput => {
	const id = node.key.toString().split("__")[0];
	const currentPath = [...parentPath, id];

	return {
		id: id.includes("new-") ? undefined : id,
		collection_id: node.collectionId,
		order_number: orderNumber,
		name: node.title as string,
		path: parentPath,
		sub_menus: (node.children ?? []).map((child, idx) =>
			treeNodeToMenuItem(child as MenuTreeNode, currentPath, idx),
		),
	};
};

export const treeToMenuRequest = (nodes: MenuTreeNode[]): MenuItemInput[] =>
	nodes.map((node, idx) => treeNodeToMenuItem(node, [], idx));

// ─── Tree Manipulation ───

export const addNodeToTree = (
	tree: MenuTreeNode[],
	collectionId: string,
	collectionName: string,
): MenuTreeNode[] => {
	const newNode: MenuTreeNode = {
		key: `new-${Date.now()}__${collectionId}`,
		title: collectionName,
		collectionId,
		path: [],
		children: [],
	};
	return [...tree, newNode];
};

const removeNodeRecursive = (
	nodes: MenuTreeNode[],
	keyToRemove: string,
): MenuTreeNode[] =>
	nodes
		.filter((node) => node.key !== keyToRemove)
		.map((node) => ({
			...node,
			children: node.children
				? removeNodeRecursive(node.children, keyToRemove)
				: [],
		}));

export const removeNodeFromTree = (
	tree: MenuTreeNode[],
	key: string,
): MenuTreeNode[] => removeNodeRecursive(tree, key);

// ─── Drag-Drop Handler ───

export interface DropInfo {
	node: MenuTreeNode & { pos?: string };
	dragNode: MenuTreeNode;
	dropPosition: number;
	dropToGap: boolean;
}

export const handleTreeDrop = (
	tree: MenuTreeNode[],
	info: DropInfo,
): MenuTreeNode[] => {
	const dropKey = info.node.key as string;
	const dragKey = info.dragNode.key as string;
	const dropPos = info.node.pos?.split("-").map(Number) ?? [];
	const dropPosition = info.dropPosition - (dropPos[dropPos.length - 1] ?? 0);

	// Clone tree
	const data = structuredClone(tree);

	// Find and remove drag node
	const dragObj = findAndRemove(data, dragKey);
	if (!dragObj) return tree;

	if (!info.dropToGap) {
		// Drop onto a node (make it a child)
		const targetNode = findNode(data, dropKey);
		if (targetNode) {
			targetNode.children = targetNode.children ?? [];
			targetNode.children.push(dragObj);
		}
	} else {
		// Drop between nodes
		const result = findParentAndIndex(data, dropKey);
		if (result) {
			const { siblings, index } = result;
			const insertIndex = dropPosition === -1 ? index : index + 1;
			siblings.splice(insertIndex, 0, dragObj);
		}
	}

	return data;
};

// ─── Internal Helpers ───

const findNode = (nodes: MenuTreeNode[], key: string): MenuTreeNode | null => {
	for (const node of nodes) {
		if (node.key === key) return node;
		if (node.children) {
			const found = findNode(node.children, key);
			if (found) return found;
		}
	}
	return null;
};

const findAndRemove = (
	nodes: MenuTreeNode[],
	key: string,
): MenuTreeNode | null => {
	for (const [i, node] of nodes.entries()) {
		if (node.key === key) {
			return nodes.splice(i, 1)[0];
		}
		if (node.children) {
			const found = findAndRemove(node.children, key);
			if (found) return found;
		}
	}
	return null;
};

const findParentAndIndex = (
	nodes: MenuTreeNode[],
	key: string,
): { siblings: MenuTreeNode[]; index: number } | null => {
	for (const [i, node] of nodes.entries()) {
		if (node.key === key) {
			return { siblings: nodes, index: i };
		}
		if (node.children) {
			const found = findParentAndIndex(node.children, key);
			if (found) return found;
		}
	}
	return null;
};
