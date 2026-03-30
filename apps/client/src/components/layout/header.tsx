import { ChevronDown, Menu, ShoppingCart, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MiniCart from "@/components/shared/mini-cart";
import SearchBox from "@/components/shared/search-box";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { useMenus } from "@/hooks/use-menus";
import { useCartStore } from "@/stores/cart-store";

const Header = () => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
	const { data: menu } = useMenus();
	const mobileMenuRef = useFocusTrap(mobileMenuOpen);
	const totalItems = useCartStore((s) =>
		s.items.reduce((sum, item) => sum + item.qty, 0),
	);
	const isCartOpen = useCartStore((s) => s.isOpen);
	const setCartOpen = useCartStore((s) => s.setCartOpen);

	const menuItems = useMemo(() => menu?.menu_items ?? [], [menu?.menu_items]);

	useEffect(() => {
		if (!mobileMenuOpen) return;
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setMobileMenuOpen(false);
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [mobileMenuOpen]);

	useEffect(() => {
		document.body.classList.toggle("overflow-hidden", mobileMenuOpen);
		return () => document.body.classList.remove("overflow-hidden");
	}, [mobileMenuOpen]);

	const toggleSection = (id: string) => {
		setOpenSections((prev) => ({
			...prev,
			[id]: !prev[id],
		}));
	};

	const closeMobileMenu = () => setMobileMenuOpen(false);

	return (
		<header className="sticky top-0 z-50 bg-white shadow-sm">
			<div className="mx-auto max-w-7xl px-4">
				<div className="flex h-16 items-center justify-between">
					{/* Mobile hamburger */}
					<button
						className="md:hidden p-2"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						aria-label="Menu"
						aria-expanded={mobileMenuOpen}
						aria-controls="mobile-nav"
					>
						{mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
					</button>

					{/* Logo */}
					<Link to="/" className="flex items-center gap-2">
						<span className="text-xl font-bold tracking-tight text-[var(--color-brand-green-text)] md:text-2xl">
							Nhà Sách Kiên Giang
						</span>
					</Link>

					{/* Desktop search */}
					<div className="hidden flex-1 px-8 md:block">
						<SearchBox />
					</div>

					{/* Cart */}
					<button
						className="relative rounded-full bg-gray-100 p-2.5"
						onClick={() => setCartOpen(true)}
						aria-label="Giỏ hàng"
					>
						<ShoppingCart size={20} />
						{totalItems > 0 && (
							<span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-brand-green)] text-[10px] font-bold text-white">
								{totalItems}
							</span>
						)}
					</button>
				</div>

				{/* Mobile search */}
				<div className="pb-3 md:hidden">
					<SearchBox />
				</div>
			</div>

			{/* Mobile nav overlay */}
			{mobileMenuOpen ? (
				<div
					className="fixed inset-0 z-40 bg-black/40 md:hidden"
					onClick={closeMobileMenu}
				/>
			) : null}

			{/* Mobile nav drawer */}
			<div
				ref={mobileMenuRef}
				id="mobile-nav"
				role="dialog"
				aria-modal="true"
				aria-label="Menu điều hướng"
				className={`fixed left-0 top-0 z-50 h-full w-80 max-w-[85vw] transform bg-white shadow-xl transition-transform duration-300 md:hidden ${
					mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="flex items-center justify-between border-b px-4 py-4">
					<span className="text-base font-semibold text-gray-900">
						Danh mục
					</span>
					<button
						className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
						onClick={closeMobileMenu}
						aria-label="Đóng menu"
					>
						<X size={18} />
					</button>
				</div>

				<nav className="flex h-full flex-col gap-2 overflow-y-auto px-4 py-4">
					<Link
						to="/collection/all"
						onClick={closeMobileMenu}
						className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-brand-green-text)] hover:bg-[var(--color-brand-green)]/10"
					>
						Tất cả
					</Link>

					{menuItems.map((item) => {
						const itemId = String(item.id);
						const hasChildren = (item.sub_menus?.length ?? 0) > 0;
						const isOpen = openSections[itemId] ?? false;
						return (
							<div key={itemId} className="rounded-lg border border-gray-100">
								<div className="flex items-center justify-between">
									<Link
										to={`/collection/${item.collection_id}`}
										onClick={closeMobileMenu}
										className="flex-1 px-3 py-2 text-sm font-medium text-gray-900 hover:text-[var(--color-brand-green-text)]"
									>
										{item.name}
									</Link>
									{hasChildren && (
										<button
											onClick={() => toggleSection(itemId)}
											className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
											aria-label={`Mở ${item.name}`}
											aria-expanded={isOpen}
										>
											<ChevronDown
												className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
											/>
										</button>
									)}
								</div>
								{hasChildren && (
									<div
										className={`grid gap-1 overflow-hidden px-3 pb-2 text-sm text-gray-700 transition-all ${
											isOpen ? "max-h-96" : "max-h-0"
										}`}
									>
										{item.sub_menus?.map((sub) => (
											<Link
												key={sub.id}
												to={`/collection/${sub.collection_id}`}
												onClick={closeMobileMenu}
												className="rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-[var(--color-brand-green)]/10 hover:text-[var(--color-brand-green-text)]"
											>
												{sub.name}
											</Link>
										))}
									</div>
								)}
							</div>
						);
					})}
				</nav>
			</div>

			{/* Mini cart drawer */}
			<MiniCart open={isCartOpen} onClose={() => setCartOpen(false)} />
		</header>
	);
};

export default Header;
