<script>
  import { createEventDispatcher } from 'svelte';
	import TagBadge from './TagBadge.svelte';
  
  const dispatch = createEventDispatcher();
  
  // Props using Svelte 5 style
  const { id, title, dueDate, tags, selected } = $props();
  
  function handleClick() {
    dispatch('click', { id });
  }
</script>

<div 
  class="w-full max-w-md p-4 bg-white dark:bg-gray-700 rounded-lg border-2 {selected ? 'border-blue-500 dark:border-blue-400' : 'border-gray-200 dark:border-gray-600'} shadow-sm hover:shadow-md cursor-pointer transition-all duration-200"
  on:click={handleClick}
>
  <div class="flex flex-col">
    <div class="mb-2">
      <h3 class="text-md font-medium">{title}</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400">Due: {dueDate}</p>
    </div>
    
    <div class="flex flex-wrap gap-1 mt-2">
      {#each tags as tag}
        <TagBadge {tag} />
      {/each}
    </div>
  </div>
</div>