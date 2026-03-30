import { useCallback, useEffect, useSyncExternalStore } from "react";

type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "kgbookstore_theme";

const getStoredTheme = (): Theme => {
	if (typeof window === "undefined") return "system";
	return (localStorage.getItem(STORAGE_KEY) as Theme) ?? "system";
};

const getSystemTheme = (): "light" | "dark" =>
	typeof window !== "undefined" &&
	window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";

const applyTheme = (theme: Theme) => {
	const resolved = theme === "system" ? getSystemTheme() : theme;
	document.documentElement.classList.toggle("dark", resolved === "dark");
};

// Simple external store for theme
let currentTheme: Theme = getStoredTheme();
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
	listeners.add(listener);
	return () => listeners.delete(listener);
};

const getSnapshot = () => currentTheme;

const setTheme = (theme: Theme) => {
	currentTheme = theme;
	localStorage.setItem(STORAGE_KEY, theme);
	applyTheme(theme);
	for (const listener of listeners) listener();
};

// Apply on module load
if (typeof window !== "undefined") {
	applyTheme(currentTheme);

	// Listen for system theme changes
	window
		.matchMedia("(prefers-color-scheme: dark)")
		.addEventListener("change", () => {
			if (currentTheme === "system") {
				applyTheme("system");
			}
		});
}

export const useTheme = () => {
	const theme = useSyncExternalStore(subscribe, getSnapshot);

	const resolvedTheme = theme === "system" ? getSystemTheme() : theme;

	const toggle = useCallback(() => {
		const next = resolvedTheme === "dark" ? "light" : "dark";
		setTheme(next);
	}, [resolvedTheme]);

	const set = useCallback((t: Theme) => {
		setTheme(t);
	}, []);

	// Re-apply on mount (handles SSR hydration)
	useEffect(() => {
		applyTheme(theme);
	}, [theme]);

	return { theme, resolvedTheme, toggle, setTheme: set };
};
