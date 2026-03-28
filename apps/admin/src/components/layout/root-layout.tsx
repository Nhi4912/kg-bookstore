import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./header";
import { DesktopSidebar, MobileSidebar } from "./sidebar";

const RootLayout = () => {
	const [mobileOpen, setMobileOpen] = useState(false);

	return (
		<>
			<DesktopSidebar />
			<MobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />
			<div className="md:pl-60 min-h-screen bg-body-bg">
				<Header onMenuClick={() => setMobileOpen(true)} />
				<main className="p-4 md:p-6">
					<Outlet />
				</main>
			</div>
		</>
	);
};

export default RootLayout;
