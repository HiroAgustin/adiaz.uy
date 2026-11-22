import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import buffalo from "astro-buffalo";
import { getPublishingPosts } from "./scripts/BufferPosts.js";

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
			posts: new URL("./src/BufferPosts.ts", import.meta.url),
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
		css: {
			postcss: {
				plugins: [
					{
						postcssPlugin: "layer-css-modules",
						OnceExit(root, { atRule, list, result }) {
							if (!/\.module\.css(?:\?|$)/.test(result.opts.from ?? "")) return;

							const prelude = [];
							root.each((rule) => {
								if (rule.type !== "atrule") return;
								if (/^(charset|namespace)$/i.test(rule.name)) {
									prelude.push(rule.remove());
								} else if (/^import$/i.test(rule.name)) {
									const [url, ...conditions] = list.space(rule.params);
									const importedLayer = conditions[0]?.match(/^layer(?:\((.*)\))?$/i);
									if (importedLayer && !importedLayer[1]) {
										throw rule.error("Anonymous import layers are not supported in CSS modules.");
									}
									if (importedLayer) {
										conditions[0] = `layer(components.${importedLayer[1]})`;
									} else {
										conditions.unshift("layer(components)");
									}
									rule.params = [url, ...conditions].join(" ");
									prelude.push(rule.remove());
								}
							});

							const layer = atRule({ name: "layer", params: "components" });
							layer.append(...root.nodes);
							root.append(...prelude, layer);
						},
					},
				],
			},
		},
		plugins: [tailwindcss()],
	},
});
