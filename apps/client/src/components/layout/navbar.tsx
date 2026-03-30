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
	const triggerRef = useRef<HTMLAnchorElement | null>(null);
	const childRefs = useRef<Array<HTMLAnchorElement | null>>([]);
	const menuId = `nav-menu-${item.id}`;

	const openMenu = useCallback(() => {
		clearTimeout(closeTimeoutRef.current);
		setIsOpen(true);
	}, []);

	const closeMenu = useCallback(() => {
		closeTimeoutRef.current = setTimeout(() => setIsOpen(false), 150);
	}, []);

	const closeMenuImmediate = useCallback(() => {
		clearTimeout(closeTimeoutRef.current);
		setIsOpen(false);
	}, []);

	const focusChildAt = useCallback((index: number) => {
		const target = childRefs.current[index];
		target?.focus();
	}, []);

	const handleTriggerKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (!hasChildren) return;
			if (e.key === "ArrowDown") {
				e.preventDefault();
				openMenu();
				requestAnimationFrame(() => focusChildAt(0));
			} else if (e.key === "Escape") {
				e.preventDefault();
				closeMenuImmediate();
				triggerRef.current?.focus();
			}
		},
		[closeMenuImmediate, focusChildAt, hasChildren, openMenu],
	);

	const handleMenuKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (!hasChildren) return;
			const total = childRefs.current.length;
			if (total === 0) return;
			const activeIndex = childRefs.current.findIndex(
				(el) => el === document.activeElement,
			);

			switch (e.key) {
				case "ArrowDown": {
					e.preventDefault();
					const nextIndex = activeIndex === -1 ? 0 : (activeIndex + 1) % total;
					focusChildAt(nextIndex);
					break;
				}
				case "ArrowUp": {
					e.preventDefault();
					const prevIndex =
						activeIndex === -1 ? total - 1 : (activeIndex - 1 + total) % total;
					focusChildAt(prevIndex);
					break;
				}
				case "Home": {
					e.preventDefault();
					focusChildAt(0);
					break;
				}
				case "End": {
					e.preventDefault();
					focusChildAt(total - 1);
					break;
				}
				case "Escape": {
					e.preventDefault();
					closeMenuImmediate();
					triggerRef.current?.focus();
					break;
				}
				case "Tab": {
					closeMenuImmediate();
					break;
				}
				default:
					break;
			}
		},
		[closeMenuImmediate, focusChildAt, hasChildren],
	);

	return (
		<li
			className="relative"
			onMouseEnter={hasChildren ? openMenu : undefined}
			onMouseLeave={hasChildren ? closeMenu : undefined}
		>
			<Link
				to={`/collection/${item.collection_id}`}
				className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-[var(--color-brand-green-text)] focus-visible:outline-2 focus-visible:outline-[var(--color-brand-green)]"
				onKeyDown={handleTriggerKeyDown}
				ref={triggerRef}
				{...(hasChildren
					? {
							"aria-haspopup": "true" as const,
							"aria-expanded": isOpen,
							"aria-controls": menuId,
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
					id={menuId}
					role="menu"
					className={`absolute left-0 top-full z-50 min-w-48 rounded-md border bg-white py-1 shadow-lg transition-all dark:border-gray-700 dark:bg-gray-800 ${
						isOpen
							? "visible opacity-100"
							: "invisible opacity-0 pointer-events-none"
					}`}
					onKeyDown={handleMenuKeyDown}
				>
					{item.sub_menus?.map((child, index) => (
						<li key={child.id} role="presentation">
							<Link
								to={`/collection/${child.collection_id}`}
								className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[var(--color-brand-green-text)] focus-visible:outline-2 focus-visible:outline-[var(--color-brand-green)]"
								onClick={() => setIsOpen(false)}
								ref={(el) => {
									childRefs.current[index] = el;
								}}
								role="menuitem"
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
		<nav
			className="hidden border-b bg-white md:block dark:bg-gray-900 dark:border-gray-700"
			aria-label="Danh mục"
		>
			<div className="mx-auto max-w-7xl px-4">
				<ul className="flex items-center gap-1">
					<li>
						<Link
							to="/collection/all"
							className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-[var(--color-brand-green-text)] focus-visible:outline-2 focus-visible:outline-[var(--color-brand-green)]"
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
