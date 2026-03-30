import { useEffect } from "react";

const SITE_NAME = "Nhà Sách Kiên Giang";

/**
 * Sets the document title reactively.
 * @param title - Page-specific title. Pass empty string for just the site name.
 */
export const useDocumentTitle = (title: string) => {
	useEffect(() => {
		document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
		return () => {
			document.title = SITE_NAME;
		};
	}, [title]);
};

/**
 * Sets a canonical URL for the current page via a <link rel="canonical"> tag.
 * Removes the tag on cleanup.
 * @param path - Path relative to origin (e.g. "/product/123"). Uses window.location.pathname if omitted.
 */
export const useCanonicalUrl = (path?: string) => {
	useEffect(() => {
		const url = `${window.location.origin}${path ?? window.location.pathname}`;
		let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
		if (!link) {
			link = document.createElement("link");
			link.setAttribute("rel", "canonical");
			document.head.appendChild(link);
		}
		link.setAttribute("href", url);

		return () => {
			link?.remove();
		};
	}, [path]);
};
