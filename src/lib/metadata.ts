import type { CollectionEntry } from "astro:content";
import { siteMetadata } from "./site";

export interface PageMetadata {
	title?: string;
	description?: string;
	type?: "Blog" | "WebSite" | "WebPage" | "BlogPosting" | "AboutPage" | "CollectionPage";
	publishedAt?: Date;
	modifiedAt?: Date;
	image?: CollectionEntry<"blog">["data"]["image"];
	items?: { name: string; url: string }[];
}

export const getPageMetadata = (page: PageMetadata, url: URL, site: URL | undefined) => {
	const {
		title = siteMetadata.title,
		description = siteMetadata.description,
		type = "WebPage",
		publishedAt,
		modifiedAt,
		image: postImage,
		items,
	} = page;

	if (!site) throw new Error("Configure the site URL before building the site.");

	const canonical = new URL(url.pathname, site);
	const image = postImage && {
		"@type": "ImageObject",
		url: new URL(postImage.path, site).href,
		height: postImage.height,
		width: postImage.width,
	};
	const authorUrl = new URL("/about/", site);

	const author = {
		"@type": "Person",
		"@id": new URL("#person", authorUrl).href,
		name: siteMetadata.author.name,
		url: authorUrl.href,
		sameAs: siteMetadata.socialLinks,
	};

	const website = {
		"@type": "WebSite",
		"@id": new URL("#website", site).href,
		name: siteMetadata.title,
		url: site.href,
		publisher: { "@id": author["@id"] },
	};

	let entityId = new URL("#content", canonical).href;
	if (type === "WebSite") entityId = website["@id"];

	const structuredData = {
		"@context": "https://schema.org",
		"@type": type,
		"@id": entityId,
		name: title,
		headline: title,
		description,
		url: canonical.href,
		author,
		publisher: { "@id": author["@id"] },
		datePublished: publishedAt?.toISOString(),
		dateModified: modifiedAt?.toISOString(),
		image,
	};

	if (type !== "WebSite") {
		Object.assign(structuredData, { isPartOf: website });
	}

	if (publishedAt) {
		Object.assign(structuredData, {
			mainEntityOfPage: { "@type": "WebPage", "@id": canonical.href },
		});
	}

	if (type === "CollectionPage" && items) {
		Object.assign(structuredData, {
			mainEntity: {
				"@type": "ItemList",
				"@id": new URL("#list", canonical).href,
				itemListElement: items.map((item, index) => ({
					"@type": "ListItem",
					position: index + 1,
					name: item.name,
					url: new URL(item.url, site).href,
				})),
			},
		});
	}

	return {
		title,
		description,
		type,
		publishedAt,
		modifiedAt,
		canonical,
		image,
		structuredData,
	};
};
