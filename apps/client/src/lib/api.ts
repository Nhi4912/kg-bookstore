import { API_BASE_URL } from "@/constants";

/* ─── Error type ─── */

export class ApiError extends Error {
	status: number;
	data: unknown;

	constructor(status: number, statusText: string, data?: unknown) {
		super(statusText);
		this.name = "ApiError";
		this.status = status;
		this.data = data;
	}
}

/* ─── URL builder ─── */

const buildUrl = (path: string, params?: Record<string, unknown>): string => {
	const url = new URL(`${API_BASE_URL}${path}`);
	if (params) {
		for (const [key, value] of Object.entries(params)) {
			if (value !== undefined && value !== null) {
				url.searchParams.set(key, String(value));
			}
		}
	}
	return url.toString();
};

/* ─── Core request ─── */

const request = async <T>(url: string, init?: RequestInit): Promise<T> => {
	const response = await fetch(url, {
		...init,
		headers: {
			"Content-Type": "application/json",
			...init?.headers,
		},
	});

	if (!response.ok) {
		let data: unknown;
		try {
			data = await response.json();
		} catch {
			/* empty body */
		}
		throw new ApiError(response.status, response.statusText, data);
	}

	const contentType = response.headers.get("content-type");
	if (contentType?.includes("application/json")) {
		return response.json() as Promise<T>;
	}
	return undefined as T;
};

/* ─── Public API ─── */

export const api = {
	get: <T>(path: string, params?: Record<string, unknown>): Promise<T> =>
		request<T>(buildUrl(path, params)),

	post: <T>(path: string, body?: unknown): Promise<T> =>
		request<T>(buildUrl(path), {
			method: "POST",
			body: body !== undefined ? JSON.stringify(body) : undefined,
		}),

	put: <T>(path: string, body?: unknown): Promise<T> =>
		request<T>(buildUrl(path), {
			method: "PUT",
			body: body !== undefined ? JSON.stringify(body) : undefined,
		}),

	delete: <T = void>(path: string): Promise<T> =>
		request<T>(buildUrl(path), { method: "DELETE" }),
};
