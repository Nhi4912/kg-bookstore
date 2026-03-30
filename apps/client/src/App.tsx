import { QueryClientProvider } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import RootLayout from "@/components/layout/root-layout";
import ScrollToTop from "@/components/shared/scroll-to-top";
import { ROUTES } from "@/constants";
import { queryClient } from "@/lib/query-client";

/* ─── Lazy-loaded page chunks ─── */
const HomePage = lazy(() => import("@/pages/home/home-page"));
const ProductDetailPage = lazy(
	() => import("@/pages/product-detail/product-detail-page"),
);
const ProductSearchPage = lazy(
	() => import("@/pages/product-search/product-search-page"),
);
const CollectionPage = lazy(() => import("@/pages/collection/collection-page"));
const ProductsByTagPage = lazy(
	() => import("@/pages/products-by-tag/products-by-tag-page"),
);
const CartPage = lazy(() => import("@/pages/cart/cart-page"));
const WishlistPage = lazy(() => import("@/pages/wishlist/wishlist-page"));
const NotFoundPage = lazy(() => import("@/pages/not-found/not-found-page"));

/* Static pages */
const TermsOfService = lazy(() => import("@/pages/static/terms-of-service"));
const PrivacyPolicy = lazy(() => import("@/pages/static/privacy-policy"));
const ReturnPolicy = lazy(() => import("@/pages/static/return-policy"));
const DeliveryPolicy = lazy(() => import("@/pages/static/delivery-policy"));
const PaymentGuide = lazy(() => import("@/pages/static/payment-guide"));
const Contact = lazy(() => import("@/pages/static/contact"));

const PageLoader = () => (
	<div className="flex min-h-[50vh] items-center justify-center">
		<Loader2 className="h-8 w-8 animate-spin text-gray-400" />
	</div>
);

const App = () => (
	<QueryClientProvider client={queryClient}>
		<BrowserRouter>
			<ScrollToTop />
			<Toaster position="bottom-right" richColors closeButton />
			<Routes>
				<Route element={<RootLayout />}>
					<Route
						path={ROUTES.HOME}
						element={
							<Suspense fallback={<PageLoader />}>
								<HomePage />
							</Suspense>
						}
					/>
					<Route
						path={ROUTES.PRODUCT_DETAIL}
						element={
							<Suspense fallback={<PageLoader />}>
								<ProductDetailPage />
							</Suspense>
						}
					/>
					<Route
						path={ROUTES.PRODUCT_SEARCH}
						element={
							<Suspense fallback={<PageLoader />}>
								<ProductSearchPage />
							</Suspense>
						}
					/>
					<Route
						path={ROUTES.COLLECTION}
						element={
							<Suspense fallback={<PageLoader />}>
								<CollectionPage />
							</Suspense>
						}
					/>
					<Route
						path={ROUTES.PRODUCTS_BY_TAG}
						element={
							<Suspense fallback={<PageLoader />}>
								<ProductsByTagPage />
							</Suspense>
						}
					/>
					<Route
						path={ROUTES.CART}
						element={
							<Suspense fallback={<PageLoader />}>
								<CartPage />
							</Suspense>
						}
					/>
					<Route
						path={ROUTES.WISHLIST}
						element={
							<Suspense fallback={<PageLoader />}>
								<WishlistPage />
							</Suspense>
						}
					/>

					{/* Static pages */}
					<Route
						path={ROUTES.TERMS}
						element={
							<Suspense fallback={<PageLoader />}>
								<TermsOfService />
							</Suspense>
						}
					/>
					<Route
						path={ROUTES.PRIVACY}
						element={
							<Suspense fallback={<PageLoader />}>
								<PrivacyPolicy />
							</Suspense>
						}
					/>
					<Route
						path={ROUTES.RETURN_POLICY}
						element={
							<Suspense fallback={<PageLoader />}>
								<ReturnPolicy />
							</Suspense>
						}
					/>
					<Route
						path={ROUTES.DELIVERY}
						element={
							<Suspense fallback={<PageLoader />}>
								<DeliveryPolicy />
							</Suspense>
						}
					/>
					<Route
						path={ROUTES.PAYMENT_GUIDE}
						element={
							<Suspense fallback={<PageLoader />}>
								<PaymentGuide />
							</Suspense>
						}
					/>
					<Route
						path={ROUTES.CONTACT}
						element={
							<Suspense fallback={<PageLoader />}>
								<Contact />
							</Suspense>
						}
					/>

					{/* 404 */}
					<Route
						path="*"
						element={
							<Suspense fallback={<PageLoader />}>
								<NotFoundPage />
							</Suspense>
						}
					/>
				</Route>
			</Routes>
		</BrowserRouter>
	</QueryClientProvider>
);

export default App;
