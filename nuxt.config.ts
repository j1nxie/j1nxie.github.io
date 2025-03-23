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

	routeRules: {
		"/blog/**": {
			prerender: true,
		},
	},

	css: [
		"~/neat.css",
		"~/custom.css",
	],

	runtimeConfig: {
		kamaitachiApiUrl: "https://kamai.tachi.ac/api/v1",
		kamaitachiApiKey: process.env.KAMAITACHI_API_KEY,
	},
});
