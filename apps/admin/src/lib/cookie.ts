/**
 * Cookie utility helpers for auth token management.
 */

interface SetCookieOptions {
	key: string;
	value: string;
	dayOffset?: number;
}

export const setCookie = ({ key, value, dayOffset = 3 }: SetCookieOptions) => {
	const expires = new Date();
	expires.setDate(expires.getDate() + dayOffset);
	document.cookie = `${key}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

export const getCookie = (key: string): string => {
	const match = document.cookie.match(new RegExp(`(?:^|; )${key}=([^;]*)`));
	return match ? decodeURIComponent(match[1]) : "";
};

export const deleteCookie = (key: string) => {
	document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
};
