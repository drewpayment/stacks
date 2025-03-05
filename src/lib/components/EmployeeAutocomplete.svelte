<script lang="ts">
  import { Check, ChevronsUpDown } from "lucide-svelte";
  import * as Command from "$lib/components/ui/command";
  import { buttonVariants } from "$lib/components/ui/button";
  import * as Popover from "$lib/components/ui/popover";
  import { cn } from '$lib/utils';
  import { onMount, tick } from 'svelte';
	import { Input, MultiSelect, type SelectOptionType } from 'flowbite-svelte';
  
  interface Props {
    employees: { name: string; value: string; }[];
    value: string | undefined;
    placeholder: string;
    loading?: boolean;
    name: string;
    disabled?: boolean;
    required: boolean;
    clearable: boolean;
  }
  
  let {
    employees = [],
    value = $bindable(undefined),
    placeholder = 'Select an employee...',
    loading = false,
    name,
    disabled = false,
    required = false,
    clearable = false,
  }: Props = $props();
  
  let select: MultiSelect;
  let open = $state(false);
  let inputValue = $state('');

  // Create a properly formatted list for display
  let employeeOptions = $derived(employees.filter(ee => (ee.name as string).toLowerCase().trim().includes(inputValue)));
  let selectedEmployees = $derived(value ? employees.filter(o => o.value === value).map(e => e.value) : []);
  
  $effect(() => {
    const search = inputValue;
    
    console.log(search);
    
    console.log(select);
  })
  
  
  

  function handleSelect(currentValue: string) {
    if (currentValue === value && clearable) {
      value = undefined;
    } else {
      value = currentValue;
    }
    open = false;
    inputValue = "";
  }
  
  function clearSelection() {
    if (!clearable) return;
    value = undefined;
    inputValue = "";
  }
  
  // Refocus the trigger button when selection is made
  function closeAndFocusTrigger(triggerId: string) {
    open = false;
    tick().then(() => {
      document.getElementById(triggerId)?.focus();
    });
  }
  
  onMount(() => {
    if (name === "") {
      throw new Error('Name is a required property.');
    }
  });
</script>

<div class="w-full max-w-md relative">
  <Input type="search" bind:value={inputValue} />
  <MultiSelect items={employeeOptions} value={selectedEmployees} bind:this={select} />
  <!-- Hidden input for form submission -->
  <input 
    type="hidden" 
    {name} 
    {value} 
    {required} 
    {disabled}
  />
  
  {#if value && clearable}
    <button 
      type="button"
      class="absolute right-10 top-1/2 -translate-y-1/2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-1" 
      on:click|stopPropagation={clearSelection}
      aria-label="Clear selection"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x">
        <path d="M18 6 6 18"></path>
        <path d="m6 6 12 12"></path>
      </svg>
    </button>
  {/if}
</div>