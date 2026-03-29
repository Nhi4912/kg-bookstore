import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR =
	'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Traps keyboard focus within a container while active.
 * Returns a ref to attach to the container element.
 */
export const useFocusTrap = (active: boolean) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const previousFocusRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		if (!active) return;

		// Store the currently focused element to restore later
		previousFocusRef.current = document.activeElement as HTMLElement;

		const container = containerRef.current;
		if (!container) return;

		// Focus the first focusable element
		const focusableElements = container.querySelectorAll(FOCUSABLE_SELECTOR);
		const firstFocusable = focusableElements[0] as HTMLElement | undefined;
		firstFocusable?.focus();

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key !== "Tab") return;

			const focusable = container.querySelectorAll(FOCUSABLE_SELECTOR);
			const first = focusable[0] as HTMLElement | undefined;
			const last = focusable[focusable.length - 1] as HTMLElement | undefined;

			if (!first || !last) return;

			if (e.shiftKey) {
				if (document.activeElement === first) {
					e.preventDefault();
					last.focus();
				}
			} else {
				if (document.activeElement === last) {
					e.preventDefault();
					first.focus();
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			// Restore focus to previously focused element
			previousFocusRef.current?.focus();
		};
	}, [active]);

	return containerRef;
};
