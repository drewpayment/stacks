<script lang="ts">
	import type { SaleTableInputData } from '$lib/drizzle/postgres/types/sale-table-input-data.model';
	import type { SaleWithEmployee } from '$lib/drizzle/postgres/types/sale.model';
	import { toHumanDate } from '$lib/utils/utils';
	import dayjs from 'dayjs';
	import { TableHead, TableHeadCell, TableBody, TableBodyRow, TableBodyCell, Table, Checkbox, Button } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';
	import { getSelectedCampaign, getSelectedEmployee } from './context';
	import { get } from 'svelte/store';
  const dispatch = createEventDispatcher();
	  
  export let data: SaleTableInputData;

  const usd = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  
  const selectedEmployeeContext = getSelectedEmployee();
  const employeeId = get(selectedEmployeeContext);
  const selectedCampaignContext = getSelectedCampaign();
  const campaignId = get(selectedCampaignContext);
  
  const startDate = dayjs(data.startDate).format('YYYY-MM-DD');
  const endDate = dayjs(data.endDate).format('YYYY-MM-DD');
  
  $: sales = data && data.sales ? data.sales : [];
  
  let selectedSales: SaleWithEmployee[] = [];
  
  const handleCheckboxChange = (e: Event) => {
    const checkbox = e.target as HTMLInputElement;
    const saleId = checkbox.value;
    const sale = sales.find(s => s.id === saleId);
    
    selectedSales = (checkbox.checked ? [...selectedSales, sale] : selectedSales.filter(s => s.id !== saleId)) as SaleWithEmployee[];
    
    dispatch('saleSelected', selectedSales);
  };
  
  const selectAll = () => {
    sales = sales.map(s => {
      s.checked = !s.checked;
      return s;
    });
  }
</script>

<div class="mb-6">
  <div class="flex justify-between">
    <h5 class="mb-2">Pending Sales</h5>
    <div class="p-2">
      <Button href={'/app/sales/add?employee=' + (employeeId || '') + '&campaign=' + (campaignId || '')} size="sm">Create Sales</Button>
    </div>
  </div>
  <Table striped={true} shadow={true} divClass="bg-background-100 dark:bg-background-300 max-h-80 overflow-y-auto">
    <TableHead class="text-sm text-background-800 font-semibold">
      <TableHeadCell>
        <Checkbox on:change={() => selectAll()}></Checkbox>
      </TableHeadCell>
      <TableHeadCell>Sale Date</TableHeadCell>
      <TableHeadCell>Customer</TableHeadCell>
      <TableHeadCell>Address</TableHeadCell>
      <TableHeadCell>Status</TableHeadCell>
      <TableHeadCell>Amount</TableHeadCell>
    </TableHead>
    
    <TableBody tableBodyClass="divide-y">
      {#each sales as sale (sale.id)}
        <TableBodyRow>
          <TableBodyCell>
            <Checkbox on:change={e => handleCheckboxChange(e)} value={sale.id} checked={sale.checked}></Checkbox>
          </TableBodyCell>
          <TableBodyCell>{toHumanDate(sale.saleDate)}</TableBodyCell>
          <TableBodyCell>{sale.customerFirstName} {sale.customerLastName}</TableBodyCell>
          <TableBodyCell>{sale.customerAddress}</TableBodyCell>
          <TableBodyCell tdClass="capitalize">{sale.statusDescription}</TableBodyCell>
          <TableBodyCell>{usd.format(Number(sale.saleAmount))}</TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
</div>