import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

import "./index.css";

const root = document.getElementById("root");

if (!root) {
	throw new Error("Root element not found");
}

const boot = async () => {
	if (import.meta.env.VITE_USE_MOCKS === "true") {
		const { setupMocks } = await import("@/mocks/setup");
		await setupMocks();
	}

	createRoot(root).render(
		<StrictMode>
			<App />
		</StrictMode>,
	);
};

boot();
