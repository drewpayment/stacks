<script lang="ts">
	export let running = false;
	export let text = 'Submit';
</script>

<button type="submit" disabled={running} class="rounded-md bg-primary-600 dark:bg-primary-300 p-2.5 text-sm font-semibold text-white 
	shadow-sm hover:bg-primary-500 dark:hover:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
	focus-visible:outline-primary-600 flex justify-around items-center">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="lucide lucide-rotate-cw {running
			? 'w-4 h-4 opacity-100 transition-all mr-2 animate-spin duration-500'
			: 'h-0 w-0 opacity-0 mr-0'}"
		><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg
	>

	<span>{text}</span>
</button>
