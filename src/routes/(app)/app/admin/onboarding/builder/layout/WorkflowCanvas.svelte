<script lang="ts">
	import StepConnectionLine from '$lib/components/ui/onboarding/StepConnectionLine.svelte';
	import WorkflowStep from '$lib/components/ui/onboarding/WorkflowStep.svelte';
	import { onboardingStore } from '../store';

  
  // Use Svelte 5 runes
  let { steps, selectedStep } = onboardingStore;
  
  function selectStep(stepId: string) {
    selectedStep = stepId;
  }
  
  function addNewStep() {
    onboardingStore.addStep();
  }
</script>

<div class="flex-grow p-6 bg-gray-100 dark:bg-gray-800 overflow-auto">
  <div class="mb-4 flex justify-between items-center">
    <h2 class="text-lg font-semibold">Workflow Canvas</h2>
    <div class="flex gap-2">
      <button type="button" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
        Preview
      </button>
      <button type="button" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
        Add Section
      </button>
    </div>
  </div>
  
  <div class="flex flex-col items-center space-y-6 max-w-2xl mx-auto">
    {#each steps as step, index}
      {#if index > 0}
        <StepConnectionLine />
      {/if}
      
      <WorkflowStep
        id={step.id}
        title={step.title}
        dueDate={step.dueDate}
        tags={step.tags}
        selected={selectedStep === step.id}
        on:click={() => selectStep(step.id)}
      />
    {/each}
    
    <button 
      type="button" 
      class="mt-4 w-full max-w-md border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
      on:click={addNewStep}
    >
      <span class="text-lg">+ Add Step</span>
    </button>
  </div>
</div>