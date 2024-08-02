import { vi } from 'vitest';


export const mockStores = (
	pageStore = { url: new URL('http://localhost:5173'), params: {} },
  sessionStore = null,
	navigatingStore = null,
	updatedStore = false,
) => vi.mock('$app/stores', async () => {
	const { readable, writable } = await import('svelte/store');
	/**
	 * @type {import('$app/stores').getStores}
	 */
	const getStores = () => ({
		navigating: readable(navigatingStore),
		page: readable(pageStore),
		session: writable(sessionStore),
		updated: readable(updatedStore),
	});
	/** @type {typeof import('$app/stores').page} */
	const page = {
		subscribe(fn: any) {
			return getStores().page.subscribe(fn);
		},
	};
	/** @type {typeof import('$app/stores').navigating} */
	const navigating = {
		subscribe(fn: any) {
			return getStores().navigating.subscribe(fn);
		}
	};
	/** @type {typeof import('$app/stores').session} */
	const session = {
		subscribe(fn: any) {
			return getStores().session.subscribe(fn);
		}
	};
	/** @type {typeof import('$app/stores').updated} */
	const updated = {
		subscribe(fn: any) {
			return getStores().updated.subscribe(fn);
		}
	};
	return {
		getStores,
		navigating,
		page,
		session,
		updated
	};
});
