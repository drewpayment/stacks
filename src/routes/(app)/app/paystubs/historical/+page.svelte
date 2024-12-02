<script lang="ts">
	import { enhance } from '$app/forms';
	import { formatCurrency, formatDate, toHumanDate } from '$lib/utils/utils';
	import { Breadcrumb, BreadcrumbItem, Card, Label, Select, Input, Table, TableHead, TableHeadCell, TableBody, TableBodyCell, TableBodyRow, Toggle, Button, Pagination } from 'flowbite-svelte';
  import { ArrowLeftOutline, ArrowRightOutline, ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';
	import type { Snapshot } from './$types.js';
	import type { ILegacyPaystubSearchResult } from '$lib/drizzle/types/legacy-paystub.model.js';
	import type { OptionItem } from '$lib/drizzle/types/option-item.model.js';
	import type { ActionResult } from '@sveltejs/kit';
	import { updateSearchParams } from '$lib/utils/url-params.js';
	import AutocompleteSelect from '$lib/components/AutocompleteSelect.svelte';

  export let data: { paystubs: ILegacyPaystubSearchResult; campaigns: OptionItem[]; employees: OptionItem[]; startDate: string; endDate: string; };
  const { paystubs: ogPaystubs, campaigns, employees, startDate, endDate, } = data;
  
  let searchButton: HTMLButtonElement;
  let pagination = ogPaystubs.pagination;
  let paystubs = [...(ogPaystubs.data)];
  
  console.log(pagination);
  
  let selectedEmployee = '-1';
  let selectedCampaign = '-1';
  let currentPage = pagination && pagination.currentPage > 0 ? pagination.currentPage : 1;
  let limit = pagination.limit;  
  
  const getHelper = (pagination: {
    total: number;
    offset: number;
    limit: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }) => {
    return { start: pagination.offset < 1 ? 1 : pagination.offset + 1, end: pagingEnd, total: pagination.total };
  }
  
  $: pagingEnd = pagination.total < pagination.limit + pagination.offset ? pagination.total : pagination.limit + pagination.offset;
  $: helper = getHelper(pagination);
  
  export const snapshot: Snapshot = {
    capture: () => ({
      helper,
      paystubs,
      selectedEmployee,
      selectedCampaign,
    }),
    restore: (value) => {
      helper = value.helper;
      paystubs = value.paystubs;
      selectedEmployee = value.selectedEmployee;
      selectedCampaign = value.selectedCampaign;
    },
  }
  
  const enhanceResultHandler = ({ result, update }: { 
    result: ActionResult<{ paystubs: ILegacyPaystubSearchResult; } | undefined>;
    update: (options?: {
        reset?: boolean;
        invalidateAll?: boolean;
    }) => Promise<void>
  }) => {
    console.log(result);
    if (!result.data) return;
    pagination = result.data.paystubs.pagination;
    // helper = getHelper(pagination);
    paystubs = [...result.data.paystubs.data];
  }
  
  const handlePageChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && pagination.currentPage === 1) return;
    if (direction === 'next' && pagination.currentPage === pagination.totalPages) return;
    
    if (direction === 'next') currentPage = currentPage + 1;
    else currentPage = currentPage - 1;
      
    updateSearch(`${currentPage}`, selectedEmployee, selectedCampaign, startDate, endDate);
    
    searchButton.click();
  }
  
  const updateSearch = (page: string, employeeId: string, campaignId: string, startDate: string, endDate: string) => {
    updateSearchParams({
      page,
      employeeId,
      campaignId,
      startDate,
      endDate,  
    });
  }
  
  const updateSearchFromForm = (formData: FormData) => {
    const form = Object.fromEntries(formData.entries());
    updateSearch(form.page as string, form.employeeId as string, form.campaignId as string, form.startDate as string, form.endDate as string);
  }
</script>

<div class="container max-w-5xl">
  <div class="flex">
    <div>
      <h5 class="mb-1">Search Paystubs</h5>
      <p class="mb-2">
        Search paystubs by employee, campaign, or cycle.
      </p>
    </div>
  </div>
  
  <div class="pb-2">
    <Breadcrumb>
      <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
      <BreadcrumbItem href="/app/payroll/search">Payroll</BreadcrumbItem>
    </Breadcrumb>
  </div>
  
  <form action="?/search" method="post" class="flex flex-col pt-4"
    use:enhance={({ formData, cancel }) => {
      formData.set('page', `${currentPage}`);
      formData.set('employeeId', selectedEmployee);
      
      updateSearchFromForm(formData);
      
      return enhanceResultHandler;
    }}
  >
    <div class="w-full">
      <Card class="w-full max-w-full grid grid-cols-5 gap-2 col-span-4">
        <Label class="space-y-2">
          <span>Start Date</span>
          <Input type="date" name="startDate" value={startDate} />
        </Label>
        
        <Label class="space-y-2">
          <span>End Date</span>
          <Input type="date" name="endDate" value={endDate} />
        </Label>
        
        <div class="flex flex-col space-y-6">
          <!-- <AutocompleteSelect name="employeeId" options={employees} value={selectedEmployee} placeholder="Select Employee" /> -->
          <Label class="space-y-2">
            <span>Employee</span>
            <Select name="employeeId" items={employees} bind:value={selectedEmployee} />
          </Label>
        </div>
        
        <div class="flex flex-col space-y-6">
          <Label class="space-y-2">
            <span>Campaign</span>
            <Select name="campaignId" items={campaigns} bind:value={selectedCampaign} />
          </Label>
        </div>
        
        <div class="flex flex-col justify-end items-end">
          <input type="hidden" name="page" value={currentPage} />
          <input type="hidden" name="take" value={limit} />
          <button type="submit" class="hidden" bind:this={searchButton} />
          <Button type="button" color="primary" on:click={() => searchButton.click()}>Search</Button>
        </div>
      </Card>
    </div>
  </form>
  
  <Table class="my-6 space-y-6 rounded-lg">
    <TableHead>
      <TableHeadCell>Employee</TableHeadCell>
      <TableHeadCell>Campaign</TableHeadCell>
      <TableHeadCell>Total</TableHeadCell>
      <TableHeadCell>Payment Date</TableHeadCell>
    </TableHead>
    
    <TableBody>
      {#each paystubs as paystub (paystub.id)}
        <TableBodyRow>
          <TableBodyCell>
            <a href={`/app/paystubs/historical/${paystub.id}`} class="flex items-baseline">
              <span>{paystub.agentName}</span>
              <ArrowUpRightFromSquareOutline class="w-3 h-3 ml-1" />
            </a>
          </TableBodyCell>
          <TableBodyCell>{paystub.vendorName}</TableBodyCell>
          <TableBodyCell>{formatCurrency(paystub.amount)}</TableBodyCell>
          <TableBodyCell>{toHumanDate(new Date(paystub.issueDate))}</TableBodyCell>
        </TableBodyRow>
      {/each}
      {#if !paystubs.length}
        <TableBodyRow>
          <TableBodyCell colspan="5">No paystubs found.</TableBodyCell>
        </TableBodyRow>
      {/if}
    </TableBody>
  </Table>
  <div class="flex flex-col items-center justify-center gap-2">
    <div class="text-sm text-gray-700 dark:text-gray-400">
      Showing <span class="font-semibold text-gray-900 dark:text-white">{helper.start}</span>
      to
      <span class="font-semibold text-gray-900 dark:text-white">{helper.end}</span>
      of
      <span class="font-semibold text-gray-900 dark:text-white">{helper.total}</span>
      Entries
    </div>
  
    <Pagination table large on:previous={() => handlePageChange('prev')} on:next={() => handlePageChange('next')}>
      <div slot="prev" class="flex items-center gap-2 text-white bg-gray-800">
        <ArrowLeftOutline class="w-3.5 h-3.5 me-2" />
        Prev
      </div>
      <div slot="next" class="flex items-center gap-2 text-white bg-gray-800">
        Next
        <ArrowRightOutline class="w-6 h-6 me-2" />
      </div>
    </Pagination>
  </div>
</div>