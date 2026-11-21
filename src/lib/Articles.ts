import { getCollection } from "astro:content";

export const featuredPosts = new Map([
	["user-avatar", "Round avatars are easy until somebody uploads a tall photo."],
	[
		"block-level-links",
		"I wanted the whole card to be clickable without making the whole card one big link.",
	],
	["chips", "I couldn't find poker chips I liked, so I drew my own with a few SVG circles."],
]);

export const postTransitionName = (id: string, part: "row" | "title") =>
	`post-${part}-${id.replace(/[^a-z0-9-]/gi, (character) => `\\${character.codePointAt(0)!.toString(16)} `)}`;

export async function getPosts() {
	const posts = await getCollection("blog", ({ data }) => import.meta.env.DEV || !data.draft);
	return posts.sort(
		(first, second) => second.data.pubDate.getTime() - first.data.pubDate.getTime(),
	);
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
	day: "2-digit",
	month: "long",
	year: "numeric",
	timeZone: "UTC",
});

export const formatDate = (date: Date) => dateFormatter.format(date);
