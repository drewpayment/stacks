<script lang="ts">
	import CategoryItem from '$lib/components/ui/onboarding/CategoryItem.svelte';
	import TemplateCard from '$lib/components/ui/onboarding/TemplateCard.svelte';
	import { derived, get } from 'svelte/store';
	import { onboardingStore } from '../store';

  
  // Use Svelte 5 runes
  let { categories, templates, availableSteps } = get(onboardingStore);
  let activeCategory = $state('personal');
  
  function setActiveCategory(categoryId: string) {
    activeCategory = categoryId;
  }
</script>

<div class="w-72 h-screen border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 overflow-y-auto">
  <div class="mb-6">
    <h2 class="text-lg font-semibold mb-2">Step Library</h2>
    
    <div class="mb-4">
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Categories:</p>
      <div class="space-y-1">
        {#each categories as category}
          <CategoryItem 
            name={category.name} 
            color={category.color} 
            active={activeCategory === category.id}
            on:click={() => setActiveCategory(category.id)}
          />
        {/each}
      </div>
    </div>
    
    <div class="mb-4">
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Templates:</p>
      <div class="space-y-2">
        {#each templates as template}
          <TemplateCard 
            name={template.name} 
            stepCount={template.stepCount} 
          />
        {/each}
      </div>
    </div>
    
    <div>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Available Steps:</p>
      <p class="text-blue-600 dark:text-blue-400 text-sm font-medium mb-2">
        {categories.find(c => c.id === activeCategory)?.name}
      </p>
      <div class="space-y-2">
        {#each availableSteps.filter(step => step.category === categories.find(c => c.id === activeCategory)?.name) as step}
          <div class="p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer">
            <p class="text-sm font-medium">{step.name}</p>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>