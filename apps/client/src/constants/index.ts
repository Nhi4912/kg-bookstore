export const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/vac_shop";

export const CART_STORAGE_KEY = "kgbookstore_cart";
export const WISHLIST_STORAGE_KEY = "kgbookstore_wishlist";
export const RECENT_PRODUCTS_KEY = "kgbookstore_recent_products";
export const MAX_RECENT_PRODUCTS = 9;
export const DEFAULT_PAGE_SIZE = 21;

export const ROUTES = {
	HOME: "/",
	PRODUCT_DETAIL: "/product/:id",
	PRODUCT_SEARCH: "/product/search/:name",
	COLLECTION: "/collection/:id",
	PRODUCTS_BY_TAG: "/products/tag/:id",
	CART: "/cart",
	WISHLIST: "/wishlist",
	TERMS: "/pages/dieu-khoan-dich-vu",
	PRIVACY: "/pages/chinh-sach-bao-mat",
	RETURN_POLICY: "/pages/chinh-sach-doi-tra",
	DELIVERY: "/pages/phuong-thuc-van-chuyen",
	PAYMENT_GUIDE: "/pages/thong-tin-huong-dan-thanh-toan",
	CONTACT: "/pages/lien-he",
} as const;

export const PRICE_RANGES = [
	{ label: "Dưới 50.000đ", from: 0, to: 50000 },
	{ label: "50.000đ - 100.000đ", from: 50000, to: 100000 },
	{ label: "100.000đ - 200.000đ", from: 100000, to: 200000 },
	{ label: "200.000đ - 500.000đ", from: 200000, to: 500000 },
	{ label: "Trên 500.000đ", from: 500000, to: 99999999 },
] as const;
