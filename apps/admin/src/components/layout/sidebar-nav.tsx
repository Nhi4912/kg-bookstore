import {
	BarChart3,
	Gift,
	Layers,
	LayoutDashboard,
	LayoutGrid,
	ShoppingCart,
	Tag,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
	{ label: "Tổng Quan", icon: LayoutDashboard, path: "/" },
	{ label: "Đơn Hàng", icon: ShoppingCart, path: "/orders" },
	{ label: "Sản Phẩm", icon: Tag, path: "/products" },
	{ label: "Nhóm sản phẩm", icon: Layers, path: "/collections" },
	{ label: "Danh Mục", icon: LayoutGrid, path: "/menus/edit" },
	{ label: "Khuyến mãi", icon: Gift, path: "/promotions" },
	{ label: "Báo Cáo", icon: BarChart3, path: "/reports" },
];

type SidebarNavProps = {
	onNavigate?: () => void;
};

const SidebarNav = ({ onNavigate }: SidebarNavProps) => {
	return (
		<nav className="flex flex-col gap-1">
			{NAV_ITEMS.map(({ label, icon: Icon, path }) => (
				<NavLink
					key={path}
					to={path}
					onClick={onNavigate}
					className={({ isActive }) =>
						cn(
							"flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground transition-all hover:scale-105 origin-left",
							isActive && "text-white bg-sidebar-accent scale-105",
						)
					}
				>
					<Icon className="h-5 w-5 shrink-0" />
					<span>{label}</span>
				</NavLink>
			))}
		</nav>
	);
};

export default SidebarNav;
