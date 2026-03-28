import { LogOut, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";

type HeaderProps = {
	onMenuClick: () => void;
};

const Header = ({ onMenuClick }: HeaderProps) => {
	const auth = useAuth();
	const profile = auth?.profile;
	const fallbackLetter = profile?.name?.trim()?.[0] ?? "U";

	return (
		<header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-white px-4 md:pl-64">
			<Button
				type="button"
				variant="ghost"
				size="icon"
				className="md:hidden"
				onClick={onMenuClick}
			>
				<Menu className="h-5 w-5" />
				<span className="sr-only">Mở menu</span>
			</Button>
			<div className="ml-auto">
				<DropdownMenu>
					<DropdownMenuTrigger className="h-9 w-9 rounded-full p-0">
						<Avatar className="h-9 w-9">
							<AvatarImage
								src={profile?.avatar_url ?? ""}
								alt={profile?.name ?? "Người dùng"}
							/>
							<AvatarFallback>{fallbackLetter}</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => auth.logout()}>
							<LogOut className="mr-2 h-4 w-4" />
							Đăng xuất
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
};

export default Header;
