import hagemanto from "eslint-plugin-hagemanto";
import pluginVue from "eslint-plugin-vue";

import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
	{ files: ["**/*.{ts,vue}"] },
	{ ignores: ["node_modules/**/*", "nuxt/**/*"] },
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	...hagemanto({
		enableJsx: false,
		enableTailwind: false,
		vueConfig: pluginVue.configs["flat/recommended"],
	}),
);
