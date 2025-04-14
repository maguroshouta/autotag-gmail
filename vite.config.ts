import { defineConfig } from "vite";
import { crx, defineManifest } from "@crxjs/vite-plugin";

const manifest = defineManifest({
	manifest_version: 3,
	name: "AutoTag Gmail",
	version: "1.0.0",
	description: "Automatically tag emails in Gmail",
	content_scripts: [
		{
			matches: ["https://mail.google.com/*"],
			js: ["./src/content.ts"],
		},
	],
});

export default defineConfig({
	plugins: [crx({ manifest })],
	build: {
		outDir: "dist",
		emptyOutDir: true,
	},
	server: {
		port: 5173,
		strictPort: true,
		hmr: {
			port: 5173,
		},
	},
});
