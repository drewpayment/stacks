<script lang="ts">
  import { Check, ChevronsUpDown } from "lucide-svelte";
  import * as Command from "$lib/components/ui/command";
  import { buttonVariants } from "$lib/components/ui/button";
  import * as Popover from "$lib/components/ui/popover";
  import type { OptionItem } from '$lib/drizzle/types/option-item.model';
	import { cn } from '$lib/utils';
	import { onMount, tick } from 'svelte';
	
  export let options: OptionItem[] = [];
  export let value: string | undefined = undefined;
  export let placeholder = "Select an option...";
  export let loading = false;
  export let name: string;

  let open = false;
  let inputValue = "";

  $: selectedOption = options.find(option => option.value === value);
  $: filteredOptions = options.filter(option => {
    const name = option.name.trim().replace(' ', '').toLowerCase();
    const input = inputValue.trim().replace(' ', '').toLowerCase();
    
    const result = name.includes(input);
    
    console.log(`Compare option (${name}): ${input} - ${result}`);
    
    return result;
  });

  function handleSelect(currentValue: string) {
    value = currentValue === value ? undefined : currentValue;
    open = false;
    inputValue = "";
  }
  
  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
  function closeAndFocusTrigger(triggerId: string) {
    open = false;
    tick().then(() => {
      document.getElementById(triggerId)?.focus();
    });
  }
  
  onMount(() => {
    if (name === "") {
      throw new Error('Name is a required property.')
    }
  })
</script>

<div class="w-[200px]">
  <Popover.Root bind:open let:ids>
    <div>
      <Popover.Trigger
        class={cn(
          buttonVariants({ variant: "outline" }),
          "w-[200px] justify-between",
          !selectedOption?.value && "text-muted-foreground"
        )}
        role="combobox"
      >
        {filteredOptions.find((f) => f.value === selectedOption?.value)?.name ??
          "Select"}
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Popover.Trigger>
      <input hidden value={selectedOption?.value} {name} />
    </div>
    <Popover.Content class="w-[200px] p-0">
      <Command.Root>
        <Command.Input
          autofocus
          placeholder="Search..."
          class="h-9"
          bind:value={inputValue}
        />
        <Command.Empty>No results found.</Command.Empty>
        <Command.Group>
          {#each filteredOptions as option}
            <Command.Item
              value={option.value}
              onSelect={() => {
                selectedOption = option;
                closeAndFocusTrigger(ids.trigger);
              }}
            >
              {option.name}
              <Check
                class={cn(
                  "ml-auto h-4 w-4",
                  option.value !== selectedOption?.value && "text-transparent"
                )}
              />
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.Root>
    </Popover.Content>
  </Popover.Root>
</div>