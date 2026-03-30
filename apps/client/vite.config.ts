import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (
						id.includes("node_modules/react-dom") ||
						id.includes("node_modules/react-router") ||
						id.includes("node_modules/react/")
					) {
						return "vendor-react";
					}
					if (id.includes("node_modules/@tanstack/react-query")) {
						return "vendor-query";
					}
					if (
						id.includes("node_modules/sonner") ||
						id.includes("node_modules/lucide-react")
					) {
						return "vendor-ui";
					}
				},
			},
		},
	},
});
