import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { MOCK_COLLECTIONS } from "./data/collections";
import { MOCK_MENU } from "./data/menus";
import { MOCK_PRODUCTS } from "./data/products";
import { MOCK_SPECIAL_TAG, MOCK_TAGS } from "./data/tags";
import { MOCK_VENDORS } from "./data/vendors";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const ok = <T>(data: T): AxiosResponse<T> =>
	({
		data,
		status: 200,
		statusText: "OK",
		headers: {},
		config: {} as InternalAxiosRequestConfig,
	}) as AxiosResponse<T>;

const param = (config: InternalAxiosRequestConfig, key: string) => {
	const p = config.params?.[key];
	return p === undefined ? undefined : String(p);
};

const numParam = (config: InternalAxiosRequestConfig, key: string) => {
	const v = param(config, key);
	return v === undefined ? undefined : Number(v);
};

/* ------------------------------------------------------------------ */
/*  Product filtering (mirrors use-product-query params)               */
/* ------------------------------------------------------------------ */

const parseJsonParam = (raw: string | undefined): string[] => {
	if (!raw) return [];
	try {
		const parsed = JSON.parse(raw) as string[];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
};

const filterProducts = (config: InternalAxiosRequestConfig) => {
	const collectionIds = parseJsonParam(param(config, "collection_ids"));
	const productIds = parseJsonParam(param(config, "product_ids"));
	const vendorIds = parseJsonParam(param(config, "vendor_ids"));
	const name = param(config, "name")?.toLowerCase();
	const fromPrice = numParam(config, "from_price");
	const toPrice = numParam(config, "to_price");
	const isVisible = numParam(config, "is_visible");

	const items = MOCK_PRODUCTS.filter((p) => {
		if (
			collectionIds.length > 0 &&
			!p.collection_ids.some((cid) => collectionIds.includes(cid))
		)
			return false;
		if (productIds.length > 0 && !productIds.includes(p.id)) return false;
		if (vendorIds.length > 0 && !vendorIds.includes(p.vendor_id)) return false;
		if (name && !p.name.toLowerCase().includes(name)) return false;
		const price = p.variants[0]?.retail_price ?? 0;
		if (fromPrice !== undefined && price < fromPrice) return false;
		if (toPrice !== undefined && price > toPrice) return false;
		if (isVisible === 1 && !p.is_visible) return false;
		return true;
	});

	const total = items.length;
	const limit = numParam(config, "limit") ?? 21;
	const offset = numParam(config, "offset") ?? 0;

	return {
		items: items.slice(offset, offset + limit),
		paging: { total, limit, offset },
	};
};

/* ------------------------------------------------------------------ */
/*  Route matcher                                                      */
/* ------------------------------------------------------------------ */

type Handler = (
	config: InternalAxiosRequestConfig,
) => Promise<AxiosResponse> | AxiosResponse;

interface MockRoute {
	method: string;
	pattern: RegExp;
	handler: Handler;
}

const routes: MockRoute[] = [
	// GET /menus
	{
		method: "get",
		pattern: /\/menus$/,
		handler: () => ok(MOCK_MENU),
	},

	// GET /tags/special (must be before /tags)
	{
		method: "get",
		pattern: /\/tags\/special$/,
		handler: () => ok(MOCK_SPECIAL_TAG),
	},

	// GET /tags
	{
		method: "get",
		pattern: /\/tags$/,
		handler: () => ok({ items: MOCK_TAGS }),
	},

	// GET /vendors
	{
		method: "get",
		pattern: /\/vendors$/,
		handler: () => ok({ items: MOCK_VENDORS }),
	},

	// GET /products/:id
	{
		method: "get",
		pattern: /\/products\/([^/]+)$/,
		handler: (config) => {
			const url = config.url ?? "";
			const match = url.match(/\/products\/([^/]+)$/);
			const id = match?.[1];
			const found = MOCK_PRODUCTS.find((p) => p.id === id);
			if (found) return ok(found);
			return ok(null);
		},
	},

	// GET /products (with query params)
	{
		method: "get",
		pattern: /\/products$/,
		handler: (config) => ok(filterProducts(config)),
	},

	// GET /collections/:id
	{
		method: "get",
		pattern: /\/collections\/([^/]+)$/,
		handler: (config) => {
			const url = config.url ?? "";
			const match = url.match(/\/collections\/([^/]+)$/);
			const id = match?.[1];
			const found = MOCK_COLLECTIONS.find((c) => c.id === id);
			if (found) return ok(found);
			return ok({
				id,
				title: id,
				description: "",
				image_id: null,
				image: null,
				is_visible: true,
				tag: "",
				created_at: "",
				updated_at: "",
			});
		},
	},

	// POST /orders
	{
		method: "post",
		pattern: /\/orders$/,
		handler: async () => {
			await delay(500);
			return ok({ id: `order-${Date.now()}`, status: "pending" });
		},
	},
];

/* ------------------------------------------------------------------ */
/*  Setup — replaces axios adapter with mock handler                   */
/* ------------------------------------------------------------------ */

export const setupMocks = async () => {
	const { apiClient } = await import("@/lib/axios");

	apiClient.interceptors.request.use(async (config) => {
		const method = (config.method ?? "get").toLowerCase();
		const url = config.url ?? "";

		const route = routes.find(
			(r) => r.method === method && r.pattern.test(url),
		);

		if (route) {
			// Simulate network latency
			await delay(150 + Math.random() * 200);

			const response = await route.handler(config);

			// Throw with adapter bypass — interceptor.response picks it up
			const error = new Error("mock");
			Object.assign(error, { __MOCK_RESPONSE__: response });
			throw error;
		}

		return config;
	});

	apiClient.interceptors.response.use(
		(response) => response,
		(error: Error & { __MOCK_RESPONSE__?: AxiosResponse }) => {
			if (error.__MOCK_RESPONSE__) {
				return Promise.resolve(error.__MOCK_RESPONSE__);
			}
			return Promise.reject(error);
		},
	);

	console.log(
		"%c[Mock] API mocks enabled — 36 products, 8 collections, 4 tags, 8 vendors",
		"color: #80c040; font-weight: bold",
	);
};
