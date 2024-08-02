import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import{ svelteTesting } from '@testing-library/svelte/vite';

export default defineConfig(({mode}) => ({
  plugins: [sveltekit(), svelteTesting(),],
  resolve: {
    // The default would be [ 'svelte', 'node' ]
    // as set by vite-plugin-svelte and vitest.
    // This sets [ 'browser', 'svelte', 'node' ]
    conditions: mode === 'test' ? ['browser'] : [],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.ts'],
    include: ['src/**/*.test.ts'],
  },
}));