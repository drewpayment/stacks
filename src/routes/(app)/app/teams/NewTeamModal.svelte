<script lang="ts">
	import { enhance } from '$app/forms';
	import Autocomplete from '$lib/components/Autocomplete.svelte';
	import type { SelectTeam } from '$lib/drizzle/postgres/db.model';
	import { Button, Checkbox, Input, Label, Modal, MultiSelect, type SelectOptionType } from 'flowbite-svelte';
	import { PlusSolid } from 'flowbite-svelte-icons';
	import { ListPlus, UsersRound } from 'lucide-svelte';
  
  interface Props {
    onClose: (location: SelectTeam | null) => void;
    employeeOptions: SelectOptionType<string>[];
  }
  let { onClose, employeeOptions }: Props = $props();

  let clickOutsideModal = $state(false);
  
  let teamMembers = $state([]);
</script>

<Button onclick={() => clickOutsideModal = true}>
  <PlusSolid class="size-3" />
  Team
</Button>

<form action="?/add" method="post" class="flex flex-col gap-4" use:enhance={({ formData }) => {
  formData.set('team_members', teamMembers as any);
  
  return ({ result }) => {
    if (result.status === 200) {
      onClose((result as any).data);
      clickOutsideModal = false
    };
  }
}}>
  <Modal title="New Team" bind:open={clickOutsideModal} outsideclose>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 pb-10">
      <Label class="space-y-2">
        <span>Name *</span>
        <Input type="text" name="name" required placeholder="Team Name" />
      </Label>
      
      <Checkbox name="is_broker" class="space-y-2">Broker</Checkbox>
      
      <Label class="col-span-2 space-y-2">
        <span>Team Members</span>
        <MultiSelect items={employeeOptions} name="team_members" bind:value={teamMembers} />
      </Label>
      
      <Label class="space-y-2">
        <span>General Manager</span>
        <Input type="text" name="general_manager" placeholder="Manager Guy" />
      </Label>

      <Label class="space-y-2">
        <span>Regional Manager</span>
        <Input type="text" name="regional_manager" placeholder="Regional Mgr Guy" />
      </Label>
    </div>
    
    <svelte:fragment slot="footer">
      <Button type="submit" class="w-full mt-4">
        <UsersRound class="mr-2 h-5 w-5" />
        Create Team
      </Button>
    </svelte:fragment>
  </Modal>
</form>