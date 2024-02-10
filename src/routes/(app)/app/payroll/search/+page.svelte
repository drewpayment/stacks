<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PaystubWith } from '$lib/types/paystbus.model';
	import { formatCurrency, formatDate } from '$lib/utils';
	import { Breadcrumb, BreadcrumbItem, Card, Label, Select, Input, Table, TableHead, TableHeadCell, TableBody, TableBodyCell, TableBodyRow, Button, Toggle } from 'flowbite-svelte';
  import { ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';
	import type { Snapshot } from './$types.js';
	import AttachPaystubToCycleModal from '$lib/components/AttachPaystubToCycleModal.svelte';

  export let data;
  const { campaigns, employees, startDate, endDate, cycles, } = data;
  
  let paystubs = [] as PaystubWith[];
  
  let submitBtn: HTMLButtonElement;
  let selectedEmployee = '';
  let selectedCampaign = '';
  let filterPayrollCycles = false;
  
  export const snapshot: Snapshot = {
    capture: () => ({
      paystubs,
      selectedEmployee,
      selectedCampaign,
    }),
    restore: (value) => {
      paystubs = value.paystubs;
      selectedEmployee = value.selectedEmployee;
      selectedCampaign = value.selectedCampaign;
    },
  }
</script>

<div class="container max-w-5xl">
  <div class="flex">
    <div>
      <h4 class="mb-2">Search Paystubs</h4>
      <p class="mb-4">
        Search paystubs by employee, campaign, or cycle.
      </p>
    </div>
  </div>
  
  <div class="pb-4">
    <Breadcrumb>
      <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
      <BreadcrumbItem href="/app/payroll/search">Payroll</BreadcrumbItem>
    </Breadcrumb>
  </div>
  
  <form action="?/search" method="post" class="flex flex-col pt-4"
    use:enhance={({ formData, cancel }) => {
      const data = Object.fromEntries(formData.entries());
      console.dir(data);
      
      return ({ result, update }) => {
        if (!result.data) return;
        
        paystubs = [...result.data.paystubs];
      }
    }}
  >
    <div class="w-full grid grid-cols-4 gap-2">
      <Card class="grid grid-cols-2 gap-2 max-w-md col-span-2">
        <Label class="space-y-2">
          <span>Start Date</span>
          <Input type="date" name="startDate" value={startDate} />
        </Label>
        
        <Label class="space-y-2">
          <span>End Date</span>
          <Input type="date" name="endDate" value={endDate} />
        </Label>
      </Card>
      
      <Card class="w-full max-w-md">
        <div class="flex flex-col space-y-6">
          <Label class="space-y-2">
            <span>Employee</span>
            <Select name="employeeId" items={employees} bind:value={selectedEmployee} on:change={() => submitBtn.click()} />
          </Label>
        </div>
      </Card>
      
      <Card class="w-full max-w-md">
        <div class="flex flex-col space-y-6">
          <Label class="space-y-2">
            <span>Campaign</span>
            <Select name="campaignId" items={campaigns} bind:value={selectedCampaign} on:change={() => submitBtn.click()} />
          </Label>
        </div>
        <button type="submit" bind:this={submitBtn} class="hidden"></button>
      </Card>
    </div>
    
    <div class="w-full pt-4">
      <Toggle bind:checked={filterPayrollCycles} value={`${filterPayrollCycles}`} on:change={() => submitBtn.click()}>
        Hide paystubs attached to payroll cycles
      </Toggle>
      <input type="hidden" name="filterPayrollCycles" bind:value={filterPayrollCycles} />
    </div>
  </form>
  
  <Table class="my-6 space-y-6 rounded-lg">
    <TableHead>
      <TableHeadCell>Employee</TableHeadCell>
      <TableHeadCell>Campaign</TableHeadCell>
      <TableHeadCell>Sales</TableHeadCell>
      <TableHeadCell>Total</TableHeadCell>
      <TableHeadCell>Payment Date</TableHeadCell>
    </TableHead>
    
    <TableBody>
      {#each paystubs as paystub (paystub.id)}
        <TableBodyRow>
          <TableBodyCell>
            <a href={`/app/payroll/${paystub.id}`} class="flex items-baseline">
              <span>{paystub.employee?.firstName} {paystub.employee?.lastName}</span>
              <ArrowUpRightFromSquareOutline class="w-3 h-3 ml-1" />
            </a>
          </TableBodyCell>
          <TableBodyCell>{paystub.campaign?.name}</TableBodyCell>
          <TableBodyCell>{paystub.totalSales}</TableBodyCell>
          <TableBodyCell>{formatCurrency(paystub.netPay)}</TableBodyCell>
          {#if paystub.payrollCycle}
            <TableBodyCell>{formatDate(paystub.payrollCycle?.paymentDate)}</TableBodyCell>
          {:else}
            <TableBodyCell>
              <Button type="button" size="xs" color="alternative" outline pill on:click={() => paystub.open = !paystub.open}>Add to Cycle</Button>
              <AttachPaystubToCycleModal cycles={cycles} paystubId={paystub.id} open={paystub.open}></AttachPaystubToCycleModal>
            </TableBodyCell>
          {/if}
        </TableBodyRow>
      {/each}
      {#if !paystubs.length}
        <TableBodyRow>
          <TableBodyCell colspan="5">No paystubs found.</TableBodyCell>
        </TableBodyRow>
      {/if}
    </TableBody>
  </Table>
</div>