import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import buffalo from "astro-buffalo";
import { getPublishingPosts } from "./scripts/buffer-posts.js";

import tailwindcss from "@tailwindcss/vite";

const site = "https://adiaz.uy";

export default defineConfig({
	site,

	fonts: [
		{
			provider: fontProviders.google(),
			name: "Atkinson Hyperlegible",
			cssVariable: "--font-body",
			display: "swap",
			weights: [400, 700],
			styles: ["normal", "italic"],
			subsets: ["latin"],
		},
		{
			provider: fontProviders.google(),
			name: "Space Grotesk",
			cssVariable: "--font-heading",
			display: "swap",
			weights: ["500 700"],
			styles: ["normal"],
			subsets: ["latin"],
		},
	],

	integrations: [
		{
			name: "check-publishing-choices",
			hooks: {
				"astro:config:setup": ({ command }) => {
					if (command === "build" && process.env.BUFFER_PUBLISH === "true") {
						getPublishingPosts();
					}
				},
			},
		},
		buffalo({
			posts: new URL("./src/buffer-posts.ts", import.meta.url),
			contentDirectory: "src/content/blog",
		}),
		sitemap(),
	],

	trailingSlash: "always",

	build: {
		format: "directory",
	},

	markdown: {
		shikiConfig: {
			theme: "dark-plus",
		},
	},

	vite: {
		plugins: [tailwindcss()],
	},
});
