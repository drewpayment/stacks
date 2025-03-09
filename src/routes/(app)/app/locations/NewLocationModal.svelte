<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Checkbox, Input, Label, Modal } from 'flowbite-svelte';
	import { PlusSolid } from 'flowbite-svelte-icons';
	import { ListPlus } from 'lucide-svelte';

  let clickOutsideModal = $state(false);
</script>

<Button class="gap-2" onclick={() => clickOutsideModal = true}>
  <PlusSolid class="size-3" />
  Location
</Button>
<Modal title="New Location" bind:open={clickOutsideModal} autoclose outsideclose>
  <form action="?/add" method="post" class="flex flex-col gap-4" use:enhance>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Label class="col-span-2 space-y-2">
        <span>Name *</span>
        <Input type="text" name="name" required placeholder="Location Name" />
      </Label>
      
      <Label class="col-span-2 space-y-2">
        <span>Address</span>
        <Input type="text" name="address" placeholder="Street" />
      </Label>

      <Label class="space-y-2">
        <span>City</span>
        <Input type="text" name="city" placeholder="Street" />
      </Label>
      
      <Label class="space-y-2">
        <span>State</span>
        <Input type="text" name="state" placeholder="Street" />
      </Label>
      
      <Label class="space-y-2">
        <span>Zip</span>
        <Input type="text" name="zip" placeholder="Street" />
      </Label>
      
      <Label class="space-y-2">
        <span>Country</span>
        <Input type="text" name="country" placeholder="Street" />
      </Label>
    </div>

    <Button type="submit" class="w-full mt-4">
      <ListPlus class="mr-2 h-5 w-5" />
      Create Location
    </Button>
  </form>
</Modal>