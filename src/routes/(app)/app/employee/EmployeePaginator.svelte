<script lang="ts">
	import { PaginationItem } from 'flowbite-svelte';
	import { ArrowLeftOutline, ArrowRightOutline } from 'flowbite-svelte-icons';
  
  export let previous: () => void;
  export let next: () => void;
  
  const noop = () => {};
  
  previous = previous || noop;
  next = next || noop;
</script>

<div class="flex space-x-3 rtl:space-x-reverse">
  <PaginationItem large class="flex items-center" on:click={previous}>
    <ArrowLeftOutline class="me-2 w-5 h-5" />
    Previous
  </PaginationItem>
  <PaginationItem large class="flex items-center" on:click={next}>
    Next
    <ArrowRightOutline class="ms-2 w-5 h-5" />
  </PaginationItem>
</div>