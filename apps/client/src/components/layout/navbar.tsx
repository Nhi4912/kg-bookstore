import type { MenuItemResponse } from "@kgbookstore/api-contract";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useMenus } from "@/hooks/use-menus";

const NavItem = ({ item }: { item: MenuItemResponse }) => {
	const hasChildren = item.sub_menus && item.sub_menus.length > 0;

	return (
		<li className="group relative">
			<Link
				to={`/collection/${item.collection_id}`}
				className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-[var(--color-brand-green)] transition-colors"
				{...(hasChildren
					? { "aria-haspopup": "true", "aria-expanded": "false" }
					: {})}
			>
				{item.name}
				{hasChildren && <ChevronDown size={14} />}
			</Link>
			{hasChildren && (
				<ul className="invisible absolute left-0 top-full z-50 min-w-48 rounded-md border bg-white py-1 shadow-lg opacity-0 transition-all group-hover:visible group-hover:opacity-100">
					{item.sub_menus?.map((child) => (
						<li key={child.id}>
							<Link
								to={`/collection/${child.collection_id}`}
								className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[var(--color-brand-green)]"
							>
								{child.name}
							</Link>
						</li>
					))}
				</ul>
			)}
		</li>
	);
};

const Navbar = () => {
	const { data: menu } = useMenus();
	const items = menu?.menu_items ?? [];

	if (items.length === 0) return null;

	return (
		<nav className="hidden border-b bg-white md:block">
			<div className="mx-auto max-w-7xl px-4">
				<ul className="flex items-center gap-1">
					<li>
						<Link
							to="/collection/all"
							className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[var(--color-brand-green)] transition-colors"
						>
							Tất cả
						</Link>
					</li>
					{items.map((item) => (
						<NavItem key={item.id} item={item} />
					))}
				</ul>
			</div>
		</nav>
	);
};

export default Navbar;
