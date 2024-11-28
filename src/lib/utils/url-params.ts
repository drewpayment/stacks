import { page } from '$app/stores';
import { get } from 'svelte/store';
import { goto } from '$app/navigation';


export function updateSearchParams(updates: Record<string, string | null>, replaceState = false) {
  const currentUrl = new URL(get(page).url);
  const searchParams = currentUrl.searchParams;

  // Update or remove parameters
  Object.entries(updates).forEach(([key, value]) => {
    if (value === null) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
    }
  });

  // Use SvelteKit's goto function with the proper options
  const newUrl = `${currentUrl.pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
  return goto(newUrl, {
    replaceState,
    noScroll: true,
    keepFocus: true
  });
}
