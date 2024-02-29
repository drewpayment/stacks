<script lang="ts">
	import { formatCurrency, formatDate } from '$lib/utils.js';
	import { Breadcrumb, BreadcrumbItem, Button, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';

  export let data;
</script>

<div class="container max-w-5xl">
  <div class="flex">
    <div>
      <h4 class="mb-2">My Pay</h4>
      <p class="mb-4">
        View my pay information.
      </p>
    </div>
  </div>
  
  <div class="pb-4">
    <Breadcrumb>
      <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
      <BreadcrumbItem>My Pay</BreadcrumbItem>
    </Breadcrumb>
  </div>
  
  <Table class="my-6 space-y-6 rounded-lg">
    <TableHead>
      <TableHeadCell>&nbsp;</TableHeadCell>
      <TableHeadCell>Campaign</TableHeadCell>
      <TableHeadCell>Sales</TableHeadCell>
      <TableHeadCell>Total</TableHeadCell>
      <TableHeadCell>Payment Date</TableHeadCell>
    </TableHead>
    
    <TableBody>
      {#each data?.paystubs as paystub (paystub.id)}
        <TableBodyRow>
          <TableBodyCell>
            <a href={`/app/paystubs/${paystub.id}`} class="flex items-baseline">
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
              <!-- You have no paystubs yet. -->
              <p>You have no paystubs yet. Come back after payday.</p>
              <!-- <Button type="button" size="xs" color="alternative" outline pill on:click={() => paystub.open = !paystub.open}>Add to Cycle</Button>
              <AttachPaystubToCycleModal cycles={cycles} paystubId={paystub.id} open={paystub.open}></AttachPaystubToCycleModal> -->
            </TableBodyCell>
          {/if}
        </TableBodyRow>
      {/each}
      {#if !data?.paystubs.length}
        <TableBodyRow>
          <TableBodyCell colspan="5">No paystubs found.</TableBodyCell>
        </TableBodyRow>
      {/if}
    </TableBody>
  </Table>
</div>