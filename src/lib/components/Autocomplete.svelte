<script lang="ts">
	import { Badge, Input, type SelectOptionType } from 'flowbite-svelte';
	import { tick } from 'svelte';
  import type { HTMLSelectAttributes } from 'svelte/elements';
  import { twMerge, type ClassNameValue } from 'tailwind-merge';
  
  interface SelectOptionDisableType<T> extends SelectOptionType<T> {
    disabled?: boolean;
  }

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  interface $$Props extends Omit<HTMLSelectAttributes, 'size'> {
    name: string;
    items: SelectOptionDisableType<any>[];
    value?: any;
    placeholder?: string;
    underline?: boolean;
    size?: 'sm' | 'md' | 'lg';
    defaultClass?: string;
    underlineClass?: string;
    required?: boolean;
    multiple?: boolean;
    clearable?: boolean;
    /**
     * On focus, how much time should the autocomplete wait for input before it shows the entire options results?
     * Defaults to 750ms.
     */
    inputDelay?: number;
  };

  // const { class: classFromProps, ...restProps } = defineProps(['class']);
  let { 
    name,
    items = $bindable(),
    value = $bindable(),
    placeholder = 'Choose option...',
    underline = false,
    size = 'md',
    defaultClass = 'text-gray-900 disabled:text-gray-400 bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:disabled:text-gray-500 dark:focus:ring-primary-500 dark:focus:border-primary-500',
    underlineClass = 'text-gray-500 disabled:text-gray-400 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:disabled:text-gray-500 dark:border-gray-700 focus:outline-hidden focus:ring-0 focus:border-gray-200 peer',
    required = false,
    multiple = false,
    clearable = false,
    inputDelay = 750,
    ...restProps
  }: $$Props = $props();

  const common = 'block w-full';
  const sizes = {
    sm: 'text-sm p-2',
    md: 'text-sm p-2.5',
    lg: 'text-base py-3 px-4'
  };
  
  let selectElement: HTMLSelectElement;
  let searchInput = $state('');
  let searchValue = $state('');
  let options = $derived(searchValue ? items.filter(i => i.name.toString().replace(' ', '').toLowerCase().includes(searchValue.trim().toLowerCase())): items);
  let isSearchReadonly = $state(false);
  let userInputTimer: NodeJS.Timer | null = $state(null);

  let selectClass = $derived(twMerge(common, underline ? underlineClass : defaultClass, sizes[size], underline && 'px-0!', restProps.class as ClassNameValue));
  
  function debounce<T extends (...args: any[]) => void>(
    fn: T, 
    delay = 300
  ): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    
    return function(this: any, ...args: Parameters<T>): void {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  }
  
  const showNativeSelectDropdown = () => {
    // Method 1: Using showPicker() (modern browsers)
    if (typeof selectElement.showPicker === 'function') {
      selectElement.showPicker();
    } 
    // Method 2: Fallback to click simulation
    else {
      selectElement.dispatchEvent(new MouseEvent('mousedown'));
    }
  }
  
  const handleKeyDown = debounce((e: KeyboardEvent) => {
    if (userInputTimer) userInputTimer = null;
    const inputVal = (e.target as any)?.value ?? '';
    searchValue = inputVal;
    
    tick().then(() => showNativeSelectDropdown());
  });
  
  const handleSelectOption = (e: Event) => {
    const id = (e.target as any).value;
    const item = items.find(i => i.value === id);
    value = item;
    searchInput = '';
    isSearchReadonly = true;
  }
  
  const handleRemoveSelected = () => {
    value = '';
    isSearchReadonly = false;
  }
  
  function isObject(instance: any) {
    return instance !== null && typeof instance === 'object' && !Array.isArray(instance);
  }
  
  function onInputFocus() {
    // if the input is in a readonly state we shouldn't ever show the results 
    if (isSearchReadonly) return;
    // if the user doesn't start search by $$Props.inputDelay we should show all results
    userInputTimer = setTimeout(() => {
      showNativeSelectDropdown();
      userInputTimer = null;
    }, inputDelay);
  }
</script>

<div class="relative space-y-8 pb-6">
  <div class="absolute w-full">
    {#if value !== null && isObject(value)}
      <div class="absolute h-11 flex items-center pl-4">
        <Badge color="none" class="relative" large dismissable on:close={handleRemoveSelected}>{value.name}</Badge>
      </div>
    {/if}
    <Input type="search" {name} onkeydown={handleKeyDown} bind:value={searchInput} readonly={isSearchReadonly} onfocus={onInputFocus} />
    <select {...restProps} class={selectClass + ' invisible'} on:change={handleSelectOption} on:contextmenu on:input bind:this={selectElement}>
      {#if placeholder}
        <option disabled selected={(value === '') ? true : undefined} value="">{placeholder}</option>
      {/if}
      {#if options && options.length > 0}
        {#each options as { value: itemValue, name, disabled }}
          <option disabled={disabled} value={itemValue} selected={(itemValue === value) ? true : undefined}>{name}</option>
        {/each}
      {/if}
    </select>
  </div>  
</div>