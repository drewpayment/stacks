<script lang="ts">
	import '$styles/app.css';
	import '@fontsource-variable/inter';
	import posthog from 'posthog-js'
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { PUBLIC_POSTHOG_KEY } from '$env/static/public';

	import Toast from '$lib/components/Toast.svelte';
	
	onMount(() => {
		if (browser) {
			posthog.init(
				`${PUBLIC_POSTHOG_KEY}`,
				{ 
					api_host: 'https://us.i.posthog.com',
					person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
				}
			)
		}
	})
</script>

<Toast />

<slot />
