import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { GuestOnly, RequireAuth } from "@/components/auth/auth-guard";
import { RootLayout } from "@/components/layout";
import { queryClient } from "@/lib/query-client";
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Routes>
					{/* Public routes — redirect to dashboard if already logged in */}
					<Route element={<GuestOnly />}>
						<Route path="/login" element={<LoginPage />} />
						<Route path="/signup" element={<SignupPage />} />
					</Route>

					{/* Protected routes — redirect to login if not authenticated */}
					<Route element={<RequireAuth />}>
						<Route element={<RootLayout />}>
							<Route index element={<div>Tổng Quan (Coming soon)</div>} />
							<Route
								path="orders/*"
								element={<div>Đơn Hàng (Coming soon)</div>}
							/>
							<Route
								path="products/*"
								element={<div>Sản Phẩm (Coming soon)</div>}
							/>
							<Route
								path="collections/*"
								element={<div>Nhóm sản phẩm (Coming soon)</div>}
							/>
							<Route
								path="menus/edit"
								element={<div>Danh Mục (Coming soon)</div>}
							/>
							<Route
								path="promotions"
								element={<div>Khuyến mãi (Coming soon)</div>}
							/>
							<Route
								path="reports"
								element={<div>Báo Cáo (Coming soon)</div>}
							/>
						</Route>
					</Route>

					{/* Catch-all */}
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</BrowserRouter>
			<Toaster position="top-right" richColors closeButton />
		</QueryClientProvider>
	);
};

export default App;
