<script lang="ts">
	import FieldItem from '$lib/components/ui/onboarding/FieldItem.svelte';
	import { get } from 'svelte/store';
	import { onboardingStore } from '../store';

  
  // Use Svelte 5 runes
  let { steps, selectedStep } = get(onboardingStore);
  
  // Derived state using computed values in Svelte 5
  let currentStep = $derived(steps.find(step => step.id === selectedStep) || {}) as { [key: string]: any }
  
  function updateStepProperty(property: string, value: any) {
    onboardingStore.updateStep(selectedStep!, { [property]: value });
  }
  
  function addNewField() {
    const newField = { id: `field-${Date.now()}`, label: 'New Field', type: 'text' };
    onboardingStore.addField(selectedStep!, newField);
  }
  
  function saveChanges() {
    // Implementation for saving changes
    alert('Changes saved successfully!');
  }
</script>

<div class="w-80 h-screen border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 overflow-y-auto">
  <div>
    <h2 class="text-lg font-semibold mb-4">Properties</h2>
    
    <div class="mb-4">
      <h3 class="text-md font-medium mb-2">Step: {currentStep.title}</h3>
      
      <div class="mb-4">
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Required:
        </label>
        <label class="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            class="sr-only peer"
            checked={currentStep.required}
            on:change={e => updateStepProperty('required', e.target.checked)}
          />
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span class="ml-3 text-sm font-medium text-gray-900 dark:text-white">Yes</span>
        </label>
      </div>
      
      <div class="mb-4">
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Assigned to:
        </label>
        <div class="space-y-2">
          <div class="flex items-center">
            <input 
              id="checkbox-employee" 
              type="checkbox" 
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              checked={currentStep.assignedTo?.includes('Employee')}
              on:change={e => {
                const newAssigned = e.target.checked 
                  ? [...(currentStep.assignedTo || []), 'Employee']
                  : (currentStep.assignedTo || []).filter(a => a !== 'Employee');
                updateStepProperty('assignedTo', newAssigned);
              }}
            />
            <label for="checkbox-employee" class="ml-2 text-sm font-medium text-gray-900 dark:text-white">Employee</label>
          </div>
          
          <div class="flex items-center">
            <input 
              id="checkbox-hr" 
              type="checkbox" 
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              checked={currentStep.assignedTo?.includes('HR')}
              on:change={e => {
                const newAssigned = e.target.checked 
                  ? [...(currentStep.assignedTo || []), 'HR']
                  : (currentStep.assignedTo || []).filter(a => a !== 'HR');
                updateStepProperty('assignedTo', newAssigned);
              }}
            />
            <label for="checkbox-hr" class="ml-2 text-sm font-medium text-gray-900 dark:text-white">HR</label>
          </div>
          
          <div class="flex items-center">
            <input 
              id="checkbox-manager" 
              type="checkbox" 
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              checked={currentStep.assignedTo?.includes('Manager')}
              on:change={e => {
                const newAssigned = e.target.checked 
                  ? [...(currentStep.assignedTo || []), 'Manager']
                  : (currentStep.assignedTo || []).filter(a => a !== 'Manager');
                updateStepProperty('assignedTo', newAssigned);
              }}
            />
            <label for="checkbox-manager" class="ml-2 text-sm font-medium text-gray-900 dark:text-white">Manager</label>
          </div>
        </div>
      </div>
      
      <div class="mb-4">
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Due: {currentStep.dueDate}
        </label>
        <select
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={currentStep.dueDate}
          on:change={e => updateStepProperty('dueDate', e.target.value)}
        >
          <option value="Before Start">Before Start</option>
          <option value="Day 1">Day 1</option>
          <option value="Day 3">Day 3</option>
          <option value="Week 1">Week 1</option>
          <option value="Week 2">Week 2</option>
        </select>
      </div>
      
      <div class="mb-4">
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Fields:
        </label>
        <div class="space-y-2">
          {#if currentStep.fields}
            {#each currentStep.fields as field}
              <FieldItem name={field.label} />
            {/each}
          {/if}
          
          <button 
            type="button" 
            class="text-blue-600 dark:text-blue-500 hover:underline text-sm font-medium"
            on:click={addNewField}
          >
            [+] Add Field
          </button>
        </div>
      </div>
      
      <button 
        type="button" 
        class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-4 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        on:click={saveChanges}
      >
        Save
      </button>
    </div>
  </div>
</div>