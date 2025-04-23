<script>
  // Props using Svelte 5 style
  export let name;
</script>

<div class="flex items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
  <div class="flex items-center justify-center w-5 h-5 mr-2 text-blue-500">
    [+]
  </div>
  <span class="text-sm">{name}</span>
</div>