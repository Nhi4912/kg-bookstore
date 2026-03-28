import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import RootLayout from "@/components/layout/root-layout";
import ScrollToTop from "@/components/shared/scroll-to-top";
import { ROUTES } from "@/constants";
import { queryClient } from "@/lib/query-client";
import CartPage from "@/pages/cart/cart-page";
import CollectionPage from "@/pages/collection/collection-page";
import HomePage from "@/pages/home/home-page";
import NotFoundPage from "@/pages/not-found/not-found-page";
import ProductDetailPage from "@/pages/product-detail/product-detail-page";
import ProductSearchPage from "@/pages/product-search/product-search-page";
import ProductsByTagPage from "@/pages/products-by-tag/products-by-tag-page";
import Contact from "@/pages/static/contact";
import DeliveryPolicy from "@/pages/static/delivery-policy";
import PaymentGuide from "@/pages/static/payment-guide";
import PrivacyPolicy from "@/pages/static/privacy-policy";
import ReturnPolicy from "@/pages/static/return-policy";
import TermsOfService from "@/pages/static/terms-of-service";

const App = () => (
	<QueryClientProvider client={queryClient}>
		<BrowserRouter>
			<ScrollToTop />
			<Toaster position="bottom-right" richColors closeButton />
			<Routes>
				<Route element={<RootLayout />}>
					<Route path={ROUTES.HOME} element={<HomePage />} />
					<Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetailPage />} />
					<Route path={ROUTES.PRODUCT_SEARCH} element={<ProductSearchPage />} />
					<Route path={ROUTES.COLLECTION} element={<CollectionPage />} />
					<Route
						path={ROUTES.PRODUCTS_BY_TAG}
						element={<ProductsByTagPage />}
					/>
					<Route path={ROUTES.CART} element={<CartPage />} />

					{/* Static pages */}
					<Route path={ROUTES.TERMS} element={<TermsOfService />} />
					<Route path={ROUTES.PRIVACY} element={<PrivacyPolicy />} />
					<Route path={ROUTES.RETURN_POLICY} element={<ReturnPolicy />} />
					<Route path={ROUTES.DELIVERY} element={<DeliveryPolicy />} />
					<Route path={ROUTES.PAYMENT_GUIDE} element={<PaymentGuide />} />
					<Route path={ROUTES.CONTACT} element={<Contact />} />

					{/* 404 */}
					<Route path="*" element={<NotFoundPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	</QueryClientProvider>
);

export default App;
