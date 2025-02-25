<script lang="ts">
  import { enhance } from '$app/forms';
	import type { SelectClient } from '$lib/drizzle/postgres/db.model';
  import { Button, Helper, Input, Label, Modal, Select } from 'flowbite-svelte';
  import { CopySolid } from 'flowbite-svelte-icons';
  
  interface Props {
    client: SelectClient;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  }
	  
  const options = [
    { name: 'User', value: 'user' },
    { name: 'Manager', value: 'manager' },
    { name: 'Admin', value: 'admin' },
  ];
  
  let { client, size = 'xs' }: Props = $props();
  
  let open = $state(false);
  let showRoleHelperText = $state(false);
  let temporaryPassword = $state('');
  let showTemporaryPassword = $state(false);
  let copyTempPasswordColor: any = $state(undefined);
  
  const copyTemporaryPassword = async () => {
    if (!navigator.clipboard) {
      console.error('Clipboard API not supported.');
      return;
    }
    
    try {
      navigator.clipboard.writeText(temporaryPassword)
        .then(() => copyTempPasswordColor = 'green');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }
  
  const handleClose = () => {
    open = false;
    showRoleHelperText = false;
    temporaryPassword = '';
    showTemporaryPassword = false;
    copyTempPasswordColor = undefined;
  }
  
  // setTimeout(() => {
  //   temporaryPassword = 'test_password';
  //   showTemporaryPassword = true;
  // }, 500)
</script>

<div class="p-2">
	<Button type="button" size="sm" on:click={() => open = true}>Add User</Button>
</div>
<Modal bind:open bind:size={size} autoclose={false} class="w-full">
  <form action="?/add" method="post" class="flex flex-col"
    use:enhance={({ formData, cancel }) => {
      
      return ({ result, update }) => {
        if (result.status != 200) return;
        
        update();
        temporaryPassword = result.data;
        showTemporaryPassword = true;
      };
    }}
  >
    <h3 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">
      Add User
    </h3>
    
    {#if showTemporaryPassword}
    <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
      Your temporary password is below. Please change it as soon as possible.
    </p>
    <div class="flex flex-col space-y-6">
      <div>
        <Label class="space-y-2" color={copyTempPasswordColor}>
          Temporary Password
        </Label>
        <Input type="text" value={temporaryPassword} color={copyTempPasswordColor} disabled />
      </div>
      
      <div class="flex justify-between mb-2">
        <Button type="button" color="alternative" on:click={handleClose}>Close</Button>
        <Button type="button" on:click={copyTemporaryPassword}>
          Copy <CopySolid class="w-4 h-4 ms-2" />
        </Button>
      </div>
    </div>
    {:else}
    <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
      Please fill out the form below to add a new user.
    </p>
    <div class="flex flex-col space-y-6">
      <Label class="space-y-2">
        <span>First Name</span>
        <Input type="text" name="first_name" required />
      </Label>
      
      <Label class="space-y-2">
        <span>Last Name</span>
        <Input type="text" name="last_name" required />
      </Label>
      
      <Label class="space-y-2">
        <span>Email Address</span>
        <Input type="email" name="email" required />
      </Label>
      
      <Label class="space-y-2">
        <span>User Role</span>
        <Select items={options} placeholder="Select Role" name="role" required 
          on:change={(e) => showRoleHelperText = e.target?.value == 'admin'} />
        {#if showRoleHelperText}
          <Helper class="text-sm mt-2">
            Admins have full rights to make changes to the entire organization. This should rarely be used.
          </Helper>
        {/if}
      </Label>
      
      <input type="hidden" name="client_id" value={client?.id} required />
      
      <div class="flex justify-between mb-2">
        <Button type="button" color="alternative" on:click={() => open = false}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </div>
    {/if}
  </form>
</Modal>

<!--
<button use:melt={$trigger} class="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm 
font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 
focus-visible:outline-offset-2 focus-visible:outline-primary-600 flex justify-around items-center gap-2">
  <span>Add User</span>
</button>

<div use:melt={$portalled}>
  {#if $open}
    <div use:melt={$overlay} class="fixed inset-0 z-50 bg-black/50" />
    <div
			use:melt={$content}
			class="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw]
      max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-white
      p-6 shadow-lg"
		>
      <div class="flex justify-between">
        <h3 use:melt={$title} class="text-neutral-900 dark:text-neutral-50">Add User</h3>
        <button use:melt={$close}>
          <XSquare />
        </button>
      </div>
      
      <form action="?/add" method="post" class="py-5 px-2"
        use:enhance={() => {
          // `formElement` is this `<form>` element
          // `formData` is its `FormData` object that's about to be submitted
          // `action` is the URL to which the form is posted
          // calling `cancel()` will prevent the submission
          // `submitter` is the `HTMLElement` that caused the form to be submitted
      
          return async ({ result }) => {
            console.log(result);
            // `result` is an `ActionResult` object
            // `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
          };
        }}
      >
        <div class="flex flex-col items-start justify-center">
          <div class="flex flex-col items-start justify-center pb-2">
            <label use:melt={$root} for="first_name" class="mb-0.5 font-medium text-neutral-900" data-melt-part="root">
              First Name
            </label>
            <input type="text" name="first_name" id="first_name" required class="h-10 w-[240px] rounded-md px-3 py-2 text-neutral-700" />
          </div>
          
          <div class="flex flex-col items-start justify-center pb-2">
            <label use:melt={$root} for="last_name" class="mb-0.5 font-medium text-neutral-900" data-melt-part="root">
              Last Name
            </label>
            <input type="text" name="last_name" id="last_name" required class="h-10 w-[240px] rounded-md px-3 py-2 text-neutral-700" />
          </div>
          
          <div class="flex flex-col items-start justify-center pb-2">
            <label use:melt={$root} for="email" class="mb-0.5 font-medium text-neutral-900" data-melt-part="root">
              Email
            </label>
            <input type="email" name="email" id="email" required class="h-10 w-[240px] rounded-md px-3 py-2 text-neutral-700" />
          </div>
          
          <div class="pb-2">
            <button 
              use:melt={$triggerSelect} 
              class="flex h-10 min-w-[220px] items-center justify-between rounded-lg bg-white px-3 py-2 shadow transition-opacity hover:opacity-90"
              on:m-keydown={(e) => {
                e.preventDefault(); // Cancel default builder behabiour
                e.detail.originalEvent.preventDefault(); // Cancel page scroll
           
                const { key } = e.detail.originalEvent;
           
                if (!['ArrowDown', 'ArrowUp', 'Space', 'Enter'].includes(key)) return;
           
                const index = options.findIndex(x => x.label === `${$selectedLabel}`);
           
                if (key === 'ArrowDown') {
                  const nextIndex = index + 1;
                  const nextOption = options[nextIndex] || options[0];
                  selected.set(nextOption);
                } else if (key === 'ArrowUp') {
                  const prevIndex = index - 1;
                  const prevOption = options[prevIndex] || options[options.length - 1];
                  selected.set(prevOption);
                } else {
                  open.set(true);
                }
              }}
            >
              <span>{$selectedLabel || 'Select a Role'}</span>
              <ChevronDown class="square-5" />
            </button>
            
            {#if $openSelect}
              <div class="z-10 flex max-h-[300px] flex-col overflow-y-auto rounded-lg bg-white p-1 shadow focus:!ring-0"
                use:melt={$menu}
              >
                {#each options as item}
                <div
                  class="relative cursor-pointer rounded-lg py-1 pl-8 pr-4 text-neutral-800
                  focus:z-10 focus:text-neutral-700
                data-[highlighted]:bg-magnum-50 data-[selected]:bg-neutral-100
                data-[highlighted]:text-neutral-900 data-[selected]:text-neutral-900"
                  use:melt={$option(item)}
                  on:m-click={(e) => {
                    e.preventDefault();
                    
                    selected.set(item);
                    openSelect.set(false);
                  }}
                >
                  <div class="check {$isSelected(item) ? 'block' : 'hidden'}">
                    <Check class="square-4" />
                  </div>
    
                  {item.label}
                </div>
                {/each}
              </div>
            {/if}
          </div>
          
          <div class="flex flex-col items-start justify-center pb-2">
            <input type="text" name="client_id" id="client_id" readonly
              placeholder={$SelectedClientStore}
              value={$SelectedClientStore}
              class="hidden" />
          </div>
        </div>
        
        <div class="flex justify-between">
          <button type="button" use:melt={$close}>
            Cancel
          </button>
          
          <button type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  {/if}
</div>

<style lang="postcss">
  .check {
    position: absolute;
    left: theme(spacing.2);
    top: 50%;
    z-index: theme(zIndex.20);
    translate: 0 calc(-50% + 1px);
    color: theme(colors.magnum.500);
  }
</style>-->