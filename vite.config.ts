import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// Check for production in both Node.js and Deno environments
const isProduction = process?.env?.NODE_ENV === 'production';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		minify: isProduction,
	},
});
