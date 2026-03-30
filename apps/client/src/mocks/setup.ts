import { MOCK_COLLECTIONS } from "./data/collections";
import { MOCK_MENU } from "./data/menus";
import { MOCK_PRODUCTS } from "./data/products";
import { MOCK_SPECIAL_TAG, MOCK_TAGS } from "./data/tags";
import { MOCK_VENDORS } from "./data/vendors";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const param = (url: URL, key: string): string | undefined =>
	url.searchParams.get(key) ?? undefined;

const numParam = (url: URL, key: string): number | undefined => {
	const v = param(url, key);
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

const filterProducts = (url: URL) => {
	const collectionIds = parseJsonParam(param(url, "collection_ids"));
	const productIds = parseJsonParam(param(url, "product_ids"));
	const vendorIds = parseJsonParam(param(url, "vendor_ids"));
	const name = param(url, "name")?.toLowerCase();
	const fromPrice = numParam(url, "from_price");
	const toPrice = numParam(url, "to_price");
	const isVisible = numParam(url, "is_visible");

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
	const limit = numParam(url, "limit") ?? 21;
	const offset = numParam(url, "offset") ?? 0;

	return {
		items: items.slice(offset, offset + limit),
		paging: { total, limit, offset },
	};
};

/* ------------------------------------------------------------------ */
/*  Route matcher                                                      */
/* ------------------------------------------------------------------ */

type Handler = (url: URL) => Promise<unknown> | unknown;

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
		handler: () => MOCK_MENU,
	},

	// GET /tags/special (must be before /tags)
	{
		method: "get",
		pattern: /\/tags\/special$/,
		handler: () => MOCK_SPECIAL_TAG,
	},

	// GET /tags
	{
		method: "get",
		pattern: /\/tags$/,
		handler: () => ({ items: MOCK_TAGS }),
	},

	// GET /vendors
	{
		method: "get",
		pattern: /\/vendors$/,
		handler: () => ({ items: MOCK_VENDORS }),
	},

	// GET /products/:id
	{
		method: "get",
		pattern: /\/products\/([^/]+)$/,
		handler: (url) => {
			const match = url.pathname.match(/\/products\/([^/]+)$/);
			const id = match?.[1];
			const found = MOCK_PRODUCTS.find((p) => p.id === id);
			return found ?? null;
		},
	},

	// GET /products (with query params)
	{
		method: "get",
		pattern: /\/products$/,
		handler: (url) => filterProducts(url),
	},

	// GET /collections/:id
	{
		method: "get",
		pattern: /\/collections\/([^/]+)$/,
		handler: (url) => {
			const match = url.pathname.match(/\/collections\/([^/]+)$/);
			const id = match?.[1];
			const found = MOCK_COLLECTIONS.find((c) => c.id === id);
			return (
				found ?? {
					id,
					title: id,
					description: "",
					image_id: null,
					image: null,
					is_visible: true,
					tag: "",
					created_at: "",
					updated_at: "",
				}
			);
		},
	},

	// POST /orders
	{
		method: "post",
		pattern: /\/orders$/,
		handler: async () => {
			await delay(500);
			return { id: `order-${Date.now()}`, status: "pending" };
		},
	},
];

/* ------------------------------------------------------------------ */
/*  Setup — overrides globalThis.fetch with mock handler               */
/* ------------------------------------------------------------------ */

export const setupMocks = () => {
	const originalFetch = globalThis.fetch;

	globalThis.fetch = async (
		input: RequestInfo | URL,
		init?: RequestInit,
	): Promise<Response> => {
		const urlStr =
			typeof input === "string"
				? input
				: input instanceof URL
					? input.toString()
					: input.url;
		const url = new URL(urlStr);
		const method = (init?.method ?? "GET").toLowerCase();

		const route = routes.find(
			(r) => r.method === method && r.pattern.test(url.pathname),
		);

		if (route) {
			// Simulate network latency
			await delay(150 + Math.random() * 200);

			const data = await route.handler(url);
			return new Response(JSON.stringify(data), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});
		}

		return originalFetch(input, init);
	};

	console.log(
		"%c[Mock] API mocks enabled — 36 products, 8 collections, 4 tags, 8 vendors",
		"color: #80c040; font-weight: bold",
	);
};
