<script>
  // Props using Svelte 5 style
  export let name;
  export let stepCount;
</script>

<div class="p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer">
  <p class="text-sm font-medium">{name}</p>
  <p class="text-xs text-gray-500 dark:text-gray-400">{stepCount} Steps</p>
</div>