// ─── API ───
export const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

// ─── Auth Storage Keys ───
export const ADMIN_TOKEN_KEY = "admin_access_token";
export const ADMIN_REFRESH_TOKEN_KEY = "admin_refresh_token";
export const ADMIN_PROFILE_KEY = "admin_profile";

// ─── Token Expiry (days) ───
export const ACCESS_TOKEN_DAYS = 3;
export const REFRESH_TOKEN_DAYS = 180;

// ─── Routes ───
export const ROUTES = {
	LOGIN: "/login",
	SIGNUP: "/signup",
	PRODUCTS: "/products",
	PRODUCT_CREATE: "/products/create",
	PRODUCT_EDIT: (id: string) => `/products/${id}/edit`,
	PRODUCT_VARIANTS: (id: string) => `/products/${id}/variants`,
	VARIANT_CREATE: (id: string) => `/products/${id}/variants/create`,
	VARIANT_EDIT: (productId: string, variantId: string) =>
		`/products/${productId}/variants/${variantId}/edit`,
	COLLECTIONS: "/collections",
	COLLECTION_CREATE: "/collections/create",
	COLLECTION_EDIT: (id: string) => `/collections/${id}/edit`,
	ORDERS: "/orders",
	ORDER_CREATE: "/orders/create",
	ORDER_EDIT: (id: string) => `/orders/${id}/edit`,
	MENUS: "/menus/edit",
} as const;

// ─── Pagination ───
export const DEFAULT_PAGE_SIZE = 20;
