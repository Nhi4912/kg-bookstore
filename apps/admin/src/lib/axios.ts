import axios from "axios";
import { ADMIN_TOKEN_KEY, API_BASE_URL, ROUTES } from "@/constants";
import { deleteCookie, getCookie } from "@/lib/cookie";

export const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// ─── Request interceptor: attach auth token ───
apiClient.interceptors.request.use((config) => {
	const token = getCookie(ADMIN_TOKEN_KEY);
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// ─── Response interceptor: handle 401 ───
apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (axios.isAxiosError(error) && error.response?.status === 401) {
			deleteCookie(ADMIN_TOKEN_KEY);
			localStorage.removeItem("admin_profile");
			window.location.href = ROUTES.LOGIN;
		}
		return Promise.reject(error);
	},
);
