import { Menu, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import MiniCart from "@/components/shared/mini-cart";
import SearchBox from "@/components/shared/search-box";
import { useCartStore } from "@/stores/cart-store";

const Header = () => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const totalItems = useCartStore((s) => s.totalItems());
	const isCartOpen = useCartStore((s) => s.isOpen);
	const setCartOpen = useCartStore((s) => s.setCartOpen);

	return (
		<header className="sticky top-0 z-50 bg-white shadow-sm">
			<div className="mx-auto max-w-7xl px-4">
				<div className="flex h-16 items-center justify-between">
					{/* Mobile hamburger */}
					<button
						className="md:hidden p-2"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						aria-label="Menu"
					>
						{mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
					</button>

					{/* Logo */}
					<Link to="/" className="flex items-center gap-2">
						<span className="text-lg font-bold text-[var(--color-brand-green)] md:text-xl">
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

			{/* Mini cart drawer */}
			<MiniCart open={isCartOpen} onClose={() => setCartOpen(false)} />
		</header>
	);
};

export default Header;
