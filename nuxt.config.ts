// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2024-11-01",
	devtools: { enabled: true },

	content: {
		build: {
			markdown: {
				highlight: {
					theme: {
						default: "catppuccin-latte",
						light: "catppuccin-latte",
						dark: "catppuccin-macchiato",
					},
					langs: [
						"rust",
					],
				},
			},
		},
		database: {
			type: "d1",
			bindingName: "DB",
		},
	},

	nitro: {
		preset: "cloudflare_pages",
	},

	modules: [
		"@nuxt/content",
		"@nuxt/eslint",
		"@nuxt/fonts",
		"@nuxt/image",
		"nuxt-twemoji",
		"@nuxt/icon",
		"nuxt-time",
	],

	css: [
		"~/neat.css",
		"~/custom.css",
	],

	runtimeConfig: {
		kamaitachiApiUrl: "https://kamai.tachi.ac/api/v1",
		kamaitachiApiKey: process.env.KAMAITACHI_API_KEY,
	},
});
