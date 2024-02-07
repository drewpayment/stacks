<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Label, Modal, Select } from 'flowbite-svelte';

  export let paystubId: string;
  export let open = false;
  export let size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'xs';
  export let cycles = [] as { name: string, value: string }[];
</script>

<Modal bind:open bind:size autoclose={false} class="w-full">
  <form action="?/add-to-cycle" class="flex flex-col" method="post"
    use:enhance={({ formData, cancel }) => {
      const data = Object.fromEntries(formData.entries());
      console.log(data);
      cancel();
      
      return ({ result, update }) => {
        if (!result.data) return;
        console.log(result.data);
      }
    }}
  >
    <h3 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">Attach to Payroll Cycle</h3>
    <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
      Attach this paystub to a payroll cycle.
    </p>
    <div class="flex flex-col space-y-6">
      <Label class="space-y-2">
        <span>Payroll Cycle</span>
        <Select items={cycles} placeholder="Select Payroll Cycle" name="payrollCycleId" required />
      </Label>
      <div class="flex justify-end">
        <Button type="submit">Attach</Button>
      </div>
    </div>
    <input type="hidden" name="paystubId" bind:value={paystubId} />
  </form>
</Modal>