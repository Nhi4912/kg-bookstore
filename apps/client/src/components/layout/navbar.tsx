import type { MenuItemResponse } from "@kgbookstore/api-contract";
import { ChevronDown } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useMenus } from "@/hooks/use-menus";

const NavItem = ({ item }: { item: MenuItemResponse }) => {
	const hasChildren = item.sub_menus && item.sub_menus.length > 0;
	const [isOpen, setIsOpen] = useState(false);
	const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
		undefined,
	);

	const openMenu = useCallback(() => {
		clearTimeout(closeTimeoutRef.current);
		setIsOpen(true);
	}, []);

	const closeMenu = useCallback(() => {
		closeTimeoutRef.current = setTimeout(() => setIsOpen(false), 150);
	}, []);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (!hasChildren) return;
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				setIsOpen((prev) => !prev);
			} else if (e.key === "Escape") {
				setIsOpen(false);
			}
		},
		[hasChildren],
	);

	return (
		<li
			className="relative"
			onMouseEnter={hasChildren ? openMenu : undefined}
			onMouseLeave={hasChildren ? closeMenu : undefined}
		>
			<Link
				to={`/collection/${item.collection_id}`}
				className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-[var(--color-brand-green)] focus-visible:outline-2 focus-visible:outline-[var(--color-brand-green)]"
				onKeyDown={handleKeyDown}
				{...(hasChildren
					? {
							"aria-haspopup": "true" as const,
							"aria-expanded": isOpen,
						}
					: {})}
			>
				{item.name}
				{hasChildren ? (
					<ChevronDown
						size={14}
						className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
					/>
				) : null}
			</Link>
			{hasChildren ? (
				<ul
					className={`absolute left-0 top-full z-50 min-w-48 rounded-md border bg-white py-1 shadow-lg transition-all ${
						isOpen
							? "visible opacity-100"
							: "invisible opacity-0 pointer-events-none"
					}`}
				>
					{item.sub_menus?.map((child) => (
						<li key={child.id}>
							<Link
								to={`/collection/${child.collection_id}`}
								className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[var(--color-brand-green)] focus-visible:outline-2 focus-visible:outline-[var(--color-brand-green)]"
								onClick={() => setIsOpen(false)}
							>
								{child.name}
							</Link>
						</li>
					))}
				</ul>
			) : null}
		</li>
	);
};

const Navbar = () => {
	const { data: menu } = useMenus();
	const items = menu?.menu_items ?? [];

	if (items.length === 0) return null;

	return (
		<nav className="hidden border-b bg-white md:block" aria-label="Danh mục">
			<div className="mx-auto max-w-7xl px-4">
				<ul className="flex items-center gap-1">
					<li>
						<Link
							to="/collection/all"
							className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-[var(--color-brand-green)] focus-visible:outline-2 focus-visible:outline-[var(--color-brand-green)]"
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
