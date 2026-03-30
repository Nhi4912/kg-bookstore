import { ADMIN_TOKEN_KEY, API_BASE_URL, ROUTES } from "@/constants";
import { deleteCookie, getCookie } from "@/lib/cookie";

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

/* ─── Core request (with auth + 401 handling) ─── */

const request = async <T>(url: string, init?: RequestInit): Promise<T> => {
	const token = getCookie(ADMIN_TOKEN_KEY);

	const response = await fetch(url, {
		...init,
		headers: {
			"Content-Type": "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...init?.headers,
		},
	});

	if (response.status === 401) {
		deleteCookie(ADMIN_TOKEN_KEY);
		localStorage.removeItem("admin_profile");
		window.location.href = ROUTES.LOGIN;
		throw new ApiError(401, "Unauthorized");
	}

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
