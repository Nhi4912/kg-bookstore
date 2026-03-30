import type {
	AdminProfile,
	CreatedResponse,
	SignInRequest,
	SignInResponse,
	SignUpRequest,
} from "@kgbookstore/api-contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import {
	ACCESS_TOKEN_DAYS,
	ADMIN_PROFILE_KEY,
	ADMIN_REFRESH_TOKEN_KEY,
	ADMIN_TOKEN_KEY,
	REFRESH_TOKEN_DAYS,
	ROUTES,
} from "@/constants";
import { api } from "@/lib/api";
import { deleteCookie, getCookie, setCookie } from "@/lib/cookie";

// ─── Query keys ───
export const authKeys = {
	profile: ["auth", "profile"] as const,
};

// ─── Read auth state from cookie + localStorage ───

const readAuthState = (): {
	token: string;
	profile: AdminProfile | null;
} => {
	const token = getCookie(ADMIN_TOKEN_KEY);
	const raw = localStorage.getItem(ADMIN_PROFILE_KEY);
	const profile: AdminProfile | null = (() => {
		try {
			return raw ? (JSON.parse(raw) as AdminProfile) : null;
		} catch {
			return null;
		}
	})();
	return { token, profile };
};

// ─── Hooks ───

export const useAuth = () => {
	const queryClient = useQueryClient();

	const { data } = useQuery({
		queryKey: authKeys.profile,
		queryFn: readAuthState,
		staleTime: Number.POSITIVE_INFINITY,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	});

	const token = data?.token ?? "";
	const profile = data?.profile ?? null;
	const isAuthenticated = token !== "" && profile !== null;

	const login = useCallback(
		(response: SignInResponse) => {
			setCookie({
				key: ADMIN_TOKEN_KEY,
				value: response.access_token,
				dayOffset: ACCESS_TOKEN_DAYS,
			});
			setCookie({
				key: ADMIN_REFRESH_TOKEN_KEY,
				value: response.refresh_token,
				dayOffset: REFRESH_TOKEN_DAYS,
			});
			localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(response.profile));
			queryClient.setQueryData(authKeys.profile, {
				token: response.access_token,
				profile: response.profile,
			});
		},
		[queryClient],
	);

	const logout = useCallback(() => {
		deleteCookie(ADMIN_TOKEN_KEY);
		deleteCookie(ADMIN_REFRESH_TOKEN_KEY);
		localStorage.removeItem(ADMIN_PROFILE_KEY);
		queryClient.setQueryData(authKeys.profile, {
			token: "",
			profile: null,
		});
		window.location.href = ROUTES.LOGIN;
	}, [queryClient]);

	return { token, profile, isAuthenticated, login, logout };
};

// ─── API mutations ───

export const useSignIn = () => {
	return useMutation({
		mutationFn: async (data: SignInRequest) => {
			return api.post<SignInResponse>("/admins/sign-in", data);
		},
	});
};

export const useSignUp = () => {
	return useMutation({
		mutationFn: async (data: SignUpRequest) => {
			return api.post<CreatedResponse>("/admins/sign-up", data);
		},
	});
};
