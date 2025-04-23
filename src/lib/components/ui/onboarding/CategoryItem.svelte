<script>
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  // Props using Svelte 5 style
  export let name;
  export let color;
  export let active = false;
  
  function handleClick() {
    dispatch('click');
  }
</script>

<div 
  class="flex items-center p-2 rounded-lg cursor-pointer {active ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}"
  on:click={handleClick}
>
  <div class="w-4 h-4 rounded-full {color} mr-3"></div>
  <span class="text-sm font-medium">{name}</span>
</div>