import { defineCollection, defineContentConfig, z } from "@nuxt/content";

export default defineContentConfig({
	collections: {
		blog: defineCollection({
			type: "page",
			source: "blog/*.md",
			schema: z.object({
				date: z.date(),
			}),
		}),
		projects: defineCollection({
			type: "page",
			source: "projects/*.md",
			schema: z.object({
				date: z.date(),
			}),
		}),
	},
});
