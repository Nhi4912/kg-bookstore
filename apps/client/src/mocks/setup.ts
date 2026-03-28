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

const filterProducts = (config: InternalAxiosRequestConfig) => {
	let items = [...MOCK_PRODUCTS];

	// collection_ids filter (JSON stringified array)
	const rawCollectionIds = param(config, "collection_ids");
	if (rawCollectionIds) {
		try {
			const ids = JSON.parse(rawCollectionIds) as string[];
			if (ids.length > 0) {
				items = items.filter((p) =>
					p.collection_ids.some((cid) => ids.includes(cid)),
				);
			}
		} catch {
			/* ignore parse errors */
		}
	}

	// product_ids filter (JSON stringified array)
	const rawProductIds = param(config, "product_ids");
	if (rawProductIds) {
		try {
			const ids = JSON.parse(rawProductIds) as string[];
			if (ids.length > 0) {
				items = items.filter((p) => ids.includes(p.id));
			}
		} catch {
			/* ignore */
		}
	}

	// vendor_ids filter (JSON stringified array)
	const rawVendorIds = param(config, "vendor_ids");
	if (rawVendorIds) {
		try {
			const ids = JSON.parse(rawVendorIds) as string[];
			if (ids.length > 0) {
				items = items.filter((p) => ids.includes(p.vendor_id));
			}
		} catch {
			/* ignore */
		}
	}

	// name search
	const name = param(config, "name");
	if (name) {
		const lower = name.toLowerCase();
		items = items.filter((p) => p.name.toLowerCase().includes(lower));
	}

	// price range
	const fromPrice = numParam(config, "from_price");
	const toPrice = numParam(config, "to_price");
	if (fromPrice !== undefined) {
		items = items.filter(
			(p) => (p.variants[0]?.retail_price ?? 0) >= fromPrice,
		);
	}
	if (toPrice !== undefined) {
		items = items.filter((p) => (p.variants[0]?.retail_price ?? 0) <= toPrice);
	}

	// is_visible
	const isVisible = numParam(config, "is_visible");
	if (isVisible === 1) {
		items = items.filter((p) => p.is_visible);
	}

	const total = items.length;

	// pagination
	const limit = numParam(config, "limit") ?? 21;
	const offset = numParam(config, "offset") ?? 0;
	items = items.slice(offset, offset + limit);

	return { items, paging: { total, limit, offset } };
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
