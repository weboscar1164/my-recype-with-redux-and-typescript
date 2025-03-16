import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: "autoUpdate",
			manifest: {
				name: "my_recipe",
				short_name: "myrecipe",
				description: "簡単なレシピ編集アプリ",
				theme_color: "#ffffff",
				background_color: "#ffffff",
				display: "standalone",
				start_url: "/",
				icons: [
					{
						src: "/my_recipe_logo_192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "/my_recipe_logo_512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
				],
				screenshots: [
					{
						src: "/screenshots_mobile.png",
						sizes: "1080x1920",
						type: "image/png",
						form_factor: "narrow",
					},
					{
						src: "/screenshots_desctop.png",
						sizes: "1920x1080",
						type: "image/png",
						form_factor: "wide",
					},
				],
			},
		}),
	],
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
