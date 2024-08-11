<script lang="ts">
  import { enhance } from '$app/forms';
  import SelectedClientStore from '$lib/stores/client';
	import type { User } from '$lib/drizzle/postgres/db.model';
  import { createDialog, melt, createLabel, createSelect } from '@melt-ui/svelte';
	import { Check, ChevronDown } from 'lucide-svelte';
  import { createToast } from './Toast.svelte';
	import UserStore from '$lib/stores/user';
	import { Button, CloseButton, Input, Label, Select, Modal } from 'flowbite-svelte';
	import { EnvelopeSolid, EyeSolid } from 'flowbite-svelte-icons';
	import type { SelectClient } from '$lib/drizzle/postgres/db.model';
  
  export let user: User;
  export let client: SelectClient;
  let origUser: User;
  
  const {
    elements: { trigger: triggerSelect, menu, option, group, groupLabel, label },
    states: { selectedLabel, open: openSelect, selected },
    helpers: { isSelected },
  } = createSelect({
    forceVisible: true,
    positioning: {
      placement: 'bottom',
      fitViewport: true,
      sameWidth: true,
    },
  });
  
  const {
		elements: { trigger, overlay, content, title, close, portalled },
		states: { open },
	} = createDialog();
  
  const {
    elements: { root, },
  } = createLabel();
  
  const options = [
    { name: 'Admin', value: 'admin' },
    { name: 'Manager', value: 'manager' },
    { name: 'User', value: 'user' },
  ];
  
  let userRole = user.user_profile.role;
  $: selectedUserRole = options.find(x => x.value === userRole);
  
  if (user) {
    origUser = {...user};
    selected.set(options.find(x => x.value === user.user_profile.role));
  }
  
  const payload: {[key: string]: any} = {};
  let defaultModal = false;
  let saveBtn: HTMLButtonElement;
</script>

<!-- <span use:melt={$trigger}> -->
  <Button class="space-x-2" type="submit" size="sm" on:click={() => defaultModal = true}>
    <EyeSolid />
    <span>View</span>
  </Button>
<!-- </span> -->

<Modal title={'Editing: ' + user?.user_profile.firstName + ' ' + user?.user_profile.lastName} bind:open={defaultModal} autoclose={false}>
  <form action="?/update" method="post" class="py-5 px-2"
    use:enhance={({ formElement, formData, action, cancel, submitter }) => {
      // `formElement` is this `<form>` element
      // `formData` is its `FormData` object that's about to be submitted
      // `action` is the URL to which the form is posted
      // calling `cancel()` will prevent the submission
      // `submitter` is the `HTMLElement` that caused the form to be submitted
      
      for (const [key, value] of formData.entries()) {
        switch (key) {
          case 'first_name':
            if (value !== origUser.user_profile.firstName) payload[key] = value;
            break;
          case 'last_name':
            if (value !== origUser.user_profile.lastName) payload[key] = value;
            break;
          case 'email':
            if (value !== origUser.auth_user.email) payload[key] = value;
            break;
          default:
            payload[key] = value; 
            break;
        }
      }
      
      // if the user doesn't change any of the field values, we just don't send the request
      if (Object.keys(payload).length < 4) cancel();
  
      return async ({ result, update }) => {            
        if (result.data.success) {
          update();
          
          createToast({
            type: 'success',
            title: 'User Updated',
            description: 'The user has been updated successfully.'
          });
          
          // update the user in the store
          // TODO: I hate everything about this... but it works
          UserStore.update(users => {
            const user = users.findIndex(x => x.auth_user.id === payload.user_id &&
              x.user_profile.id === payload.user_profile_id);
              
            if (user > -1) {
              for (const prop in payload) {
                if (prop === 'user_id' || prop === 'user_profile_id') continue;
                if (prop === 'client_id') continue;
                if (prop === 'email') {
                  users[user] = {...users[user],
                    auth_user: {...users[user].auth_user,
                      email: payload.email,
                    },
                  };
                  continue;
                }
                if (prop === 'first_name' || prop === 'last_name') {
                  users[user] = {...users[user],
                    user_profile: {...users[user].user_profile,
                      firstName: payload.first_name,
                      lastName: payload.last_name,
                    },
                  };
                  continue;
                }
              }
            }
            
            return users;
          });
          
          defaultModal = false;
        }
        // `result` is an `ActionResult` object
        // `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
      };
    }}
  >
    <div class="flex gap-2 mb-2">
      <div class="space-y-2">
        <Label for="first_name">First Name</Label>
        <input type="hidden" name="user_id" value={user.auth_user.id} />
        <input type="hidden" name="user_profile_id" value={user.user_profile.id} />
        <Input type="text" name="first_name" id="first_name" value={user.user_profile.firstName} required />
      </div>
      
      <div class="space-y-2">
        <Label for="last_name">Last Name</Label>
        <Input type="text" name="last_name" id="last_name" value={user.user_profile.lastName} required />
      </div>
    </div>
    
    <div class="space-y-2 mb-2">
      <Label for="email">Email</Label>
      <Input type="email" name="email" id="email" value={user.auth_user.email} required>
        <EnvelopeSolid slot="left" class="w-4 h-4" />
      </Input>
    </div>
    
    <div class="mb-2">
      <Label>
        User Type
        <Select class="mt-2" items={options} bind:value={userRole} disabled={userRole == 'org_admin'} placeholder="Choose user type" name="role" required />
      </Label>
    </div>
    
    <div class="space-y-2 mb-2">
      <Label>Client</Label>
      <Input type="hidden" name="client_id" id="client_id" bind:value={$SelectedClientStore} required />
      <Input type="text" name="client_name" id="client_name" value={client.name} disabled />
    </div>
    
    <div class="flex justify-between pt-4">      
      <!-- <button type="submit" class="sr-only" bind:this={saveBtn}>Save</button> -->
      <Button color="alternative" type="button" on:click={() => defaultModal = false}>Cancel</Button>
      <Button type="submit">Save</Button>
    </div>
  </form>
  
  <!-- <svelte:fragment slot="footer">
    <Button color="alternative">Cancel</Button>
    <Button type="button" on:click={() => saveBtn.click()}>Save</Button>
  </svelte:fragment> -->
</Modal>

<!-- <button use:melt={$trigger} class="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 flex justify-around items-center gap-2">
  <Eye />
</button> -->

<div use:melt={$portalled}>
  {#if $open}
    <div use:melt={$overlay} class="fixed inset-0 z-50 bg-black/50" />
    <div
			use:melt={$content}
			class="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw]
      max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-white
      p-6 shadow-lg dark:bg-gray-800 dark:text-neutral-50"
		>
      <div class="flex justify-between">
        <h3 class="text-xl font-bold text-neutral-900 dark:text-neutral-50" use:melt={$title}>
          Edit: {user?.user_profile.firstName} {user?.user_profile.lastName}
        </h3>
        <button use:melt={$close}>
          <CloseButton />
        </button>
      </div>
      
      
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
</style>