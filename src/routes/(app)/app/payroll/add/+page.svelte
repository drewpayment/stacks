<script lang="ts">
	import { enhance } from '$app/forms';
	import SelectSaleOverridesTable from '$lib/components/SelectSaleOverridesTable.svelte';
	import SelectSalesTable from '$lib/components/SelectSalesTable.svelte';
	import { getEmployeeOptions, getManualOverrides, getSelectedCampaign, getSelectedEmployee, setEmployeeOptions, setSelectedEmployee, type EmployeeOptions } from '$lib/components/context.js';
	import type { OverrideTableInputData } from '$lib/drizzle/postgres/types/override-table-input-data.model.js';
	import type { SaleTableInputData } from '$lib/drizzle/postgres/types/sale-table-input-data.model.js';
	import type { SelectSale, SelectSaleOverride } from '$lib/drizzle/postgres/db.model.js';
	import { Breadcrumb, BreadcrumbItem, Button, Card, Checkbox, Helper, Label, Select, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
  import { ArrowUpRight, Icon } from 'svelte-hero-icons';
  
  export let data;
  const { employees, campaigns, cycles, preloadEmployeeId, expenseReports } = data;
  
  const selectedEmployeeContext = getSelectedEmployee();
  const employeeContext = getEmployeeOptions();
  employeeContext.set(employees as EmployeeOptions[]);
  const manualOverrides = getManualOverrides();
  const lastSearchCriteria = {
    employeeId: '',
    campaignId: '',
  };
  
  //TODO: Need to finish passing emplid and campaignid to the add sales page
  const campaignContext = getSelectedCampaign();
  
  let submitBtn: HTMLButtonElement;
  let selectedSales: SelectSale[] = [];
  let selectedSaleOverrides: SelectSaleOverride[] = [];
  let selectedExpenseReports: string[] = [];
  let selectedEmployee = preloadEmployeeId || '';
  let selectedCampaign = '';
  let selectedCycle = '';
  
  if (selectedEmployee) selectedEmployeeContext.set(selectedEmployee);
  
  let salesTableData = {
    sales: [],
    startDate: '',
    endDate: '',
  } as SaleTableInputData;
  
  let overrideTableData = {
    overrides: [],
  } as OverrideTableInputData;
  
  export const snapshot = {
    capture: () => {
      return {
        selectedSales,
        selectedSaleOverrides,
        selectedEmployee,
        selectedCampaign,
        selectedCycle,
        salesTableData,
        overrideTableData,
        selectedExpenseReports,
      };
    },
    restore: (snapshot) => {
      selectedEmployee = snapshot.selectedEmployee;
      selectedCampaign = snapshot.selectedCampaign;
      selectedCycle = snapshot.selectedCycle;
      salesTableData = snapshot.salesTableData;
      overrideTableData = snapshot.overrideTableData;
      selectedSales = snapshot.selectedSales;
      selectedSaleOverrides = snapshot.selectedSaleOverrides;
      selectedExpenseReports = snapshot.selectedExpenseReports;
    },
  }
  
  const handleSaleSelected = (e: CustomEvent<SelectSale[]>) => {
    const sales = e.detail;
    selectedSales = [...sales];
  };
  
  const handleOverrideSelected = (e: CustomEvent<SelectSaleOverride[]>) => {
    const overrides = e.detail;
    selectedSaleOverrides = [...overrides];
  };
  
  const handleCampaignSelected = (e: any) => {
    selectedCampaign = e.target?.value;
    campaignContext.set(selectedCampaign);
    trySearch({ campaignId: selectedCampaign });
  }
  
  const handleEmployeeSelect = (e: any) => {
    selectedEmployeeContext.set(e.target.value);
    trySearch({ employeeId: e.target.value });
  }
  
  const usd = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  
  const handleExpenseReportSelected = (e: Event) => {
    const expenseReportId = (e.target as any).value as string;
    selectedExpenseReports.push(expenseReportId);
  }
  
  const trySearch = ({ campaignId, employeeId }: { campaignId?: string, employeeId?: string }) => {
    let shouldSearch = false;
    
    if (campaignId && campaignId !== lastSearchCriteria.campaignId) {
      lastSearchCriteria.campaignId = campaignId;
      shouldSearch = true;
    }
    
    if (employeeId && employeeId !== lastSearchCriteria.employeeId) {
      lastSearchCriteria.employeeId = employeeId;
      shouldSearch = true;
    }
    
    if (shouldSearch) submitBtn.click();
  }
  
  const selectAll = () => {
    
  }
</script>

<div class="container max-w-5xl">
  <div class="flex">
    <div>
      <h4 class="mb-2">Create a Paystub</h4>
      <p class="mb-4">
        Create a new paystub for an employee.
      </p>
    </div>
  </div>
  
  <div class="pb-4">
    <Breadcrumb>
      <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
      <BreadcrumbItem href="/app/payroll/search">Payroll</BreadcrumbItem> 
      <BreadcrumbItem>Create a Paystub</BreadcrumbItem>
    </Breadcrumb>
  </div>
  
  <div class="grid grid-cols-3 pt-4 gap-2">
    <form action="?/get-sales-by-employee" method="post" class="flex gap-2 justify-between col-span-2"
      use:enhance={({ cancel }) => {
        
        return ({ result, update }) => {
          if (result.data) {
            salesTableData = {
              ...salesTableData,
              sales: [...result.data.sales,],
            };
            
            overrideTableData = {
              ...overrideTableData,
              overrides: [...result.data.overrides,],
            };
          }
        }
      }}
    >
      <Card class="w-full max-w-md">
        <div class="flex flex-col space-y-6">
          <Label class="space-y-2">
            <span>Employee</span>
            <Select placeholder="Select Employee" name="employeeId" items={employees} bind:value={selectedEmployee} on:change={handleEmployeeSelect} required />
          </Label>
        </div>
      </Card>
      
      <Card class="w-full max-w-md">
        <div class="flex flex-col space-y-6">
          <Label class="space-y-2">
            <span>Campaign</span>
            <Select placeholder="Select Campaign" name="campaignId" items={campaigns} bind:value={selectedCampaign} on:change={handleCampaignSelected} required />
          </Label>
        </div>
      </Card>
      <button type="submit" bind:this={submitBtn} class="hidden"></button>
    </form>
    
    <Card class="w-full max-w-md">
      <div class="flex flex-col space-y-6">
        <Label class="space-y-2">
          <span>Payroll Cycle <span class="text-gray-400 text-sm italic">Optional</span></span>
          <Select placeholder="Select Cycle" items={cycles} value={selectedCycle} />
          <Helper class="text-sm">
            Assign this paystub to a payroll cycle.
          </Helper>
        </Label>
      </div>
    </Card>
  </div>
  
  <div class="flex justify-end my-6">
    <form action="?/save-paystub" method="post" use:enhance={async ({ cancel, formData }) => {
      return ({ result, update }) => {
        console.dir(result);
      }
    }}>
      <Button disabled={!selectedSales?.length} type="submit">
        Next <ArrowRightOutline class="w-3.5 h-3.5 ms-2" />
      </Button>
      <input type="hidden" name="employeeId" value={selectedEmployee} />
      <input type="hidden" name="campaignId" value={selectedCampaign} />
      <input type="hidden" name="selectedSales" value={JSON.stringify(selectedSales)} />
      <input type="hidden" name="selectedSaleOverrides" value={JSON.stringify(selectedSaleOverrides)} />
      <input type="hidden" name="selectedExpenseReports" value={JSON.stringify(selectedExpenseReports)} />
      <input type="hidden" name="pendingManualOverrides" value={JSON.stringify($manualOverrides)} />
    </form>
  </div>
  
  <div class="my-6">
    <SelectSalesTable bind:data={salesTableData} on:saleSelected={handleSaleSelected}></SelectSalesTable>
  </div>
  
  <div class="my-6">
    <SelectSaleOverridesTable bind:data={overrideTableData} on:overrideSelected={handleOverrideSelected}></SelectSaleOverridesTable>
  </div>
  
  <div class="my-6">
    <div class="flex justify-between">
      <h5 class="mb-2">Expense Reports</h5>
      <!-- <div class="p-2">
        <Button type="button" on:click={() => openAddOverrideModal = !openAddOverrideModal} size="sm">Add Manual Override</Button>
      </div> -->
    </div>
    <Table striped={true} shadow={true} divClass="bg-background-100 dark:bg-background-300 max-h-80 overflow-y-auto">
      <TableHead class="text-sm text-background-800 font-semibold">
        <TableHeadCell>
          <Checkbox on:change={() => selectAll()}></Checkbox>
        </TableHeadCell>
        <TableHeadCell>Amount</TableHeadCell>
        <TableHeadCell>Submitted</TableHeadCell>
        <TableHeadCell>Status</TableHeadCell>
      </TableHead>
      
      <TableBody tableBodyClass="divide-y">
        {#if expenseReports != null && expenseReports.length}
        {#each expenseReports as report (report.id)}
          <TableBodyRow>
            <TableBodyCell>
              {#if report.approvalStatus === 'approved'}
              <Checkbox name="expenseReportId" value={report?.id} on:change={handleExpenseReportSelected}></Checkbox>
              {:else}
              <a href={`/app/expenses/${report.id}`}>
                <Icon src={ArrowUpRight} class="w-4 h-4" />
              </a>
              {/if}
            </TableBodyCell>
            <TableBodyCell>{usd.format(Number(report?.totalAmount))}</TableBodyCell>
            <TableBodyCell>{report.submissionDate.toLocaleDateString()}</TableBodyCell>
            <TableBodyCell tdClass="capitalize">{report.approvalStatus}</TableBodyCell>
          </TableBodyRow>
        {/each}
        {/if}
      </TableBody>
    </Table>
  </div>
</div>
