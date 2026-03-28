import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import SidebarNav from "./sidebar-nav";

export const DesktopSidebar = () => {
	return (
		<aside className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:w-60 md:flex-col bg-sidebar">
			<div className="flex h-14 items-center px-4">
				<span className="text-lg font-bold text-white">KG Bookstore</span>
			</div>
			<div className="flex-1 overflow-y-auto px-2 py-4">
				<SidebarNav />
			</div>
		</aside>
	);
};

type MobileSidebarProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export const MobileSidebar = ({ open, onOpenChange }: MobileSidebarProps) => {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="left"
				className="w-60 bg-sidebar p-0 border-none [&>button]:text-white"
			>
				<SheetHeader className="px-4 py-3">
					<SheetTitle className="text-white">KG Bookstore</SheetTitle>
				</SheetHeader>
				<div className="px-2 pb-4">
					<SidebarNav onNavigate={() => onOpenChange(false)} />
				</div>
			</SheetContent>
		</Sheet>
	);
};
