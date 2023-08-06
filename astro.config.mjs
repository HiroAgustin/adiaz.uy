import { defineConfig } from "astro/config";

import robotsTxt from "astro-robots-txt";
import webmanifest from "astro-webmanifest";

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
	site: "https://adiaz.uy",
	compressHTML: true,
	integrations: [
		robotsTxt(),
		mdx(),
		sitemap(),
		tailwind({
			applyBaseStyles: false,
		}),
		webmanifest(),
	],
	redirects: {
		"/user-avatar": "/blog/user-avatar",
		"/webpack": "/blog/webpack",
		"/block-level-links": "/blog/block-level-links",
		"/target-blank": "/blog/target-blank",
		"/social-sharing": "/blog/social-sharing",
		"/plectica": "/blog/plectica",
		"/take-home-assignments": "/blog/take-home-assignments",
		"/pin": "/blog/pin",
		"/chips": "/blog/chips",
		"/hash": "/blog/hash",
		"/uniq": "/blog/uniq",
		"/flatten": "/blog/flatten",
		"/uyrobot": "/blog/uyrobot",
		"/interview-trivia": "/blog/interview-trivia",
		"/why-i-hate-images": "/blog/why-i-hate-images",
	},
});
