import { Outlet } from "react-router-dom";
import Footer from "./footer";
import Header from "./header";
import Navbar from "./navbar";

const RootLayout = () => (
	<div className="flex min-h-screen flex-col">
		<a
			href="#main-content"
			className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[var(--color-brand-navy)] focus:shadow-lg focus:ring-2 focus:ring-[var(--color-brand-green)] focus:outline-none"
		>
			Chuyển đến nội dung chính
		</a>
		<Header />
		<Navbar />
		<main id="main-content" className="flex-1">
			<Outlet />
		</main>
		<Footer />
	</div>
);

export default RootLayout;
