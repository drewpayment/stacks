import { preprocessMeltUI } from '@melt-ui/pp';
import * as adapterAuto from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import sequence from 'svelte-sequential-preprocessor';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: sequence([
		vitePreprocess({}),
		preprocessMeltUI()
	]),

	kit: {
		adapter: process.env.NODE_ENV === 'production' ? adapter() : adapterAuto.default(),
		alias: {
			$styles: 'src/styles',
		}
	}
};

export default config;
