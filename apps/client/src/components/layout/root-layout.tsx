import { Outlet } from "react-router-dom";
import Footer from "./footer";
import Header from "./header";
import Navbar from "./navbar";

const RootLayout = () => (
	<div className="flex min-h-screen flex-col">
		<Header />
		<Navbar />
		<main className="flex-1">
			<Outlet />
		</main>
		<Footer />
	</div>
);

export default RootLayout;
