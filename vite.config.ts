import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		cors: {
			origin: "*",
			methods: ["GET", "POST"],
		},
	},
	// resolve: {
	// 	alias: {
	// 		path: "path-browserify",
	// 	},
	// },
	// build: {
	// 	rollupOptions: {
	// 		external: ["path"],
	// 	},
	// },
});
