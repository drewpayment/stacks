<script lang="ts">
	import { ArrowLeftOutline, ArrowRightOutline } from 'flowbite-svelte-icons';
  
  export let previous: () => void;
  export let next: () => void;
  export let page: number;
  export let count: number;
  export let limit: number;

  $: totalPages = Math.ceil(count / limit);
</script>

<div class="flex flex-col items-center">
  <span class="text-sm text-gray-700 dark:text-gray-400">
    Page <span class="font-semibold text-gray-900 dark:text-white">{page}</span> of <span class="font-semibold text-gray-900 dark:text-white">{totalPages}</span>
  </span>
  <div class="inline-flex mt-2 xs:mt-0">
    <button
      class="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      on:click={previous}
      disabled={page <= 1}
    >
      <ArrowLeftOutline class="w-5 h-5" />
    </button>
    <button
      class="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-l border-gray-700 rounded-r hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      on:click={next}
      disabled={page >= totalPages}
    >
      <ArrowRightOutline class="w-5 h-5" />
    </button>
  </div>
</div>