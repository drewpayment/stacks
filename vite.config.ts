import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { runtime } from './src/lib/utils';

// Check for production in both Node.js and Deno environments
const isProduction = runtime.isDeno 
	? Deno?.env?.get('NODE_ENV') === 'production'
	: process?.env?.NODE_ENV === 'production';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		minify: isProduction,
	},
});
