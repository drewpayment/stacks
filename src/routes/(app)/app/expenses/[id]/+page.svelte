<script lang="ts">
	import { enhance } from '$app/forms';
	import { createToast } from '$lib/components/Toast.svelte';
	import type { SelectExpenseItem } from '$lib/drizzle/postgres/db.model.js';
  import { Card, Table, Button, Badge, TableHead, TableHeadCell, TableBody, TableBodyRow, TableBodyCell, Footer, Select } from 'flowbite-svelte';
  import { ChevronLeft, Printer, ArrowDownCircle, Icon, CheckCircle } from 'svelte-hero-icons';

  // Mock data for the expense report
  export let data;
  const { report, user, paystubs } = data;
  let expenseItems: SelectExpenseItem[] = [];
  
  $: {
    expenseItems = report?.items.length ? report?.items as SelectExpenseItem[] : expenseItems;
  }
  
  const startDate = report?.paystub?.payrollCycle.startDate;
  const endDate = report?.paystub?.payrollCycle.endDate;
  
  let paystubId: string = '';
  let setPaystubBtn: HTMLButtonElement;

  function goBack() {
    // In a real application, this would navigate back to the expense reports list
    console.log('Navigating back to expense reports list');
  }

  function printReport() {
    // Implement print functionality
    console.log('Printing report');
  }

  function downloadReport() {
    // Implement download functionality
    console.log('Downloading report');
  }
</script>

<div class="container max-w-5xl mx-auto p-4">
  <div class="flex justify-between items-center mb-6">
    <Button color="light" href="/app/expenses">
      <Icon src={ChevronLeft} class="w-4 h-4 mr-2" /> Back to Reports
    </Button>
    {#if ['super_admin', 'org_admin'].includes(user?.profile.role) && report?.approvalStatus === 'pending'}
      <form method="post" action="?/approve" use:enhance={() => {
        return ({ result }) => {
          if (result.status === 200) {
            createToast({
              type: 'success',
              title: 'Success',
              description: 'Expense report approved successfully',
            });
          } else {
            createToast({
              type: 'error',
              title: 'Error!',
              description: 'Something went wrong',
            });
          }
        }        
      }}>
        <input type="hidden" name="reportId" value={report?.id} />
        <Button color="blue" class="mr-2" type="submit">
          <Icon src={CheckCircle} class="w-4 h-4 mr-2" /> Approve
        </Button>
      </form>
    {:else if ['super_admin', 'org_admin'].includes(user?.profile.role) && report?.approvalStatus === 'approved'}
      <div>
        <Button color="light" class="mr-2" disabled={true}>
          <Icon src={CheckCircle} class="w-4 h-4 mr-2" /> Approved
        </Button>
      </div>
    {/if}
  </div>

  <Card class="w-full mb-6 max-w-5xl">
    <h1 class="text-2xl font-bold mb-4">Expense Report Details</h1>
    <div class="grid grid-cols-2 gap-4 mb-4">
      <div>
        <p class="font-semibold">Employee Name:</p>
        <p>{report?.employee.firstName} {report?.employee.lastName} (ID: {report?.employeeId})</p>
      </div>
      <div>
        <p class="font-semibold">Pay Period:</p>
        <p>
          {#if report?.paystub?.payrollCycle != null}
            {startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}
          {:else if ['super_admin', 'org_admin'].includes(user.profile.role)}
            {#if paystubs?.length > 0}
            <form action="?/setPaystub" method="post" use:enhance={() => {
              return ({ result }) => {
                if (result.status === 200) {
                  createToast({
                    type: 'success',
                    title: 'Success',
                    description: 'Attached to paystub',
                  });
                } else {
                  createToast({
                    type: 'error',
                    title: 'Error!',
                    description: 'Something went wrong',
                  });
                }
              }
            }}>
              <input type="hidden" name="reportId" value={report?.id} />
              <Select items={paystubs} size="sm" name="paystubId" bind:value={paystubId} on:change={() => setPaystubBtn.click()} />
              <button type="submit" class="hidden" bind:this={setPaystubBtn}>Attach to paystub</button>
            </form>
            {:else}
            <span class="text-sm italic">No paystubs available - <a href="/app/payroll/add" class="text-blue-500 hover:underline">Create one</a></span>
            {/if}
          {:else}
            <span class="text-sm italic">Unassigned</span>
          {/if}
        </p>
      </div>
      <div>
        <p class="font-semibold">Submission Date:</p>
        <p>{report?.submissionDate.toLocaleDateString()}</p>
      </div>
      <div>
        <p class="font-semibold">Status:</p>
        <Badge
          color={report?.approvalStatus === 'approved' ? 'green' : 
                 report?.approvalStatus === 'pending' ? 'yellow' : 'red'}
        >
          <span class="capitalize">{report?.approvalStatus}</span>
        </Badge>
      </div>
      <div>
        <p class="font-semibold">Approval Notes:</p>
        <p>
          {#if report?.approvalNotes != null}
            {report?.approvalNotes}
          {:else}
            <span class="text-sm italic">No notes provided.</span>
          {/if}
        </p>
      </div>
      <div>
        <p class="font-semibold">Approval Date:</p>
        <p>
          {#if report?.approvalDate != null}
            {report?.approvalDate?.toLocaleDateString()}
          {:else}
            <span class="text-sm italic">Not yet approved.</span>
          {/if}
        </p>
      </div>
    </div>
  </Card>

  <Card class="w-full mb-6 max-w-5xl">
    <h2 class="text-xl font-semibold mb-4">Expense Items</h2>
    <Table hoverable={true}>
      <TableHead>
        <TableHeadCell>Date</TableHeadCell>
        <TableHeadCell>Category</TableHeadCell>
        <TableHeadCell>Description</TableHeadCell>
        <TableHeadCell>Amount</TableHeadCell>
      </TableHead>
      <TableBody tableBodyClass="divide-y">
        {#each expenseItems as expense (expense.id)}
          <TableBodyRow>
            <TableBodyCell>{expense.date.toLocaleDateString()}</TableBodyCell>
            <TableBodyCell tdClass="capitalize">{expense.category}</TableBodyCell>
            <TableBodyCell>{expense.description}</TableBodyCell>
            <TableBodyCell>${Number(expense.amount).toFixed(2)}</TableBodyCell>
          </TableBodyRow>
        {/each}
        <TableBodyRow>
          <TableBodyCell colspan="3" class="text-right font-semibold">Total:</TableBodyCell>
          <TableBodyCell class="font-bold">${Number(report?.totalAmount).toFixed(2)}</TableBodyCell>
        </TableBodyRow>
      </TableBody>
    </Table>
  </Card>

  <div class="mt-4 text-sm text-gray-600">
    <p>Note: This expense report is associated with the paystub for the pay period {startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}.</p>
    <p>For any questions or concerns, please contact the payroll department.</p>
  </div>
</div>