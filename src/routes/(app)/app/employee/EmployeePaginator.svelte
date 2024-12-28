<script lang="ts">
	import { PaginationItem } from 'flowbite-svelte';
	import { ArrowLeftOutline, ArrowRightOutline } from 'flowbite-svelte-icons';
  
  export let previous: () => void;
  export let next: () => void;
  export let page: number;
</script>

<div class="flex flex-col items-center">
  <div class="inline-flex mt-2 xs:mt-0">
    <button
      class="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      on:click={previous}
      disabled={page <= 1}
    >
      <ArrowLeftOutline class="w-5 h-5" />
    </button>
    <button
      class="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-l border-gray-700 rounded-r hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
      on:click={next}
    >
      <ArrowRightOutline class="w-5 h-5" />
    </button>
  </div>
</div>