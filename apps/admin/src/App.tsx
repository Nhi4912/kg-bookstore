import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { GuestOnly, RequireAuth } from "@/components/auth/auth-guard";
import { RootLayout } from "@/components/layout";
import { queryClient } from "@/lib/query-client";
import CollectionListPage from "@/pages/collections/collection-list";
import CreateCollectionPage from "@/pages/collections/create-collection";
import EditCollectionPage from "@/pages/collections/edit-collection";
import LoginPage from "@/pages/login";
import MenuPage from "@/pages/menus/menu-page";
import CreateOrderPage from "@/pages/orders/create-order";
import OrderDetailPage from "@/pages/orders/order-detail";
import OrderListPage from "@/pages/orders/order-list";
import CreateProductPage from "@/pages/products/create-product";
import CreateVariantPage from "@/pages/products/create-variant";
import EditProductPage from "@/pages/products/edit-product";
import EditVariantPage from "@/pages/products/edit-variant";
import ProductListPage from "@/pages/products/product-list";
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
							{/* Orders */}
							<Route path="orders" element={<OrderListPage />} />
							<Route path="orders/create" element={<CreateOrderPage />} />
							<Route path="orders/:id" element={<OrderDetailPage />} />

							{/* Products */}
							<Route path="products" element={<ProductListPage />} />
							<Route path="products/create" element={<CreateProductPage />} />
							<Route path="products/:id/edit" element={<EditProductPage />} />
							<Route
								path="products/:id/variants/create"
								element={<CreateVariantPage />}
							/>
							<Route
								path="products/:id/variants/:variantId/edit"
								element={<EditVariantPage />}
							/>

							{/* Collections */}
							<Route path="collections" element={<CollectionListPage />} />
							<Route
								path="collections/create"
								element={<CreateCollectionPage />}
							/>
							<Route
								path="collections/:id/edit"
								element={<EditCollectionPage />}
							/>
							{/* Menu */}
							<Route path="menus/edit" element={<MenuPage />} />
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
