<script lang="ts">
	import { enhance } from '$app/forms';
	import type { InsertExpenseItem, InsertExpenseReport } from '$lib/drizzle/postgres/db.model';
	import dayjs from 'dayjs';
  import { Button, Card, Label, Input, Select, type SelectOptionType } from 'flowbite-svelte';
	import { nanoid } from 'nanoid';
  import { Icon, Plus, Trash } from 'svelte-hero-icons';

  export let data;
  const { employees } = data;
  
  let expenses: InsertExpenseItem[] = [];
  let newExpense = {} as InsertExpenseItem;
  let report = {
    items: expenses,
    clientId: data.profile?.clientId,
    submissionDate: dayjs().toDate(),
    approvalStatus: 'pending',
    totalAmount: '0',
  } as InsertExpenseReport & { items: InsertExpenseItem[] };
  
  //#region Category options
  const categories: SelectOptionType[] = [
    { name: 'Travel', value: 'travel', },
    { name: 'Meals', value: 'meals', },
    { name: 'Supplies', value: 'supplies', },
    { name: 'Equipment', value: 'equipment', },
    { name: 'Vehicles', value: 'vehicles', },
    { name: 'Utilities', value: 'utilities', },
    { name: 'Rent', value: 'rent', },
    { name: 'Marketing', value: 'marketing', },
    { name: 'Professional Development', value: 'professional_development', },
    { name: 'Subscriptions', value: 'subscriptions', },
    { name: 'Insurance', value: 'insurance', },
    { name: 'Professional Services', value: 'professional_services', },
    { name: 'Repairs', value: 'repairs', },
    { name: 'Shipping', value: 'shipping', },
    { name: 'Employee Benefits', value: 'employee_benefits', },
    { name: 'Taxes & Licenses', value: 'taxes_licenses', },
    { name: 'Interest & Bank Fees', value: 'interest_bank_fees', },
    { name: 'Miscellaneous', value: 'misc', },
  ];
  //#endregion

  function addExpense() {
    if (newExpense.date && newExpense.description && newExpense.amount) {
      const newExpenseItem = { ...newExpense, id: nanoid(), };
      
      expenses = [...expenses, newExpenseItem ];
      report.items = [...report.items, newExpenseItem];
      report.totalAmount = (Number(report.totalAmount) + Number(newExpense.amount)).toString();
      
      newExpense = {} as InsertExpenseItem;
    }
  }

  function removeExpense(id: string) {
    expenses = expenses.filter(expense => expense.id !== id);
  }

  $: totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
</script>

<Card class="w-full max-w-2xl mx-auto">
  <div class="p-4">
    <h2 class="text-2xl font-bold text-center">Expense Report</h2>
  </div>
  <div class="p-4">
    <div class="space-y-4">
      <div class="grid grid-cols-2">
        <div class="space-y-4">
          <Label for="employee">Employee</Label>
          <Select id="employee" name="employee" bind:value={report.employeeId} required>
            {#each employees as employee}
              <option value={employee.value}>{employee.name}</option>
            {/each}
          </Select>
        </div>
      </div>
    </div>
  </div>
  <div class="p-4">
    <div class="space-y-4">
      <div class="grid grid-cols-5 gap-4 font-semibold">
        <div>Date</div>
        <div>Category</div>
        <div class="col-span-2">Description</div>
        <div>Amount</div>
      </div>
      {#each expenses as expense (expense.id)}
        <div class="grid grid-cols-5 gap-4 items-center">
          <div>{expense.date}</div>
          <div class="capitalize">{expense.category}</div>
          <div class="col-span-2">{expense.description}</div>
          <div class="flex items-center justify-between">
            ${Number(expense.amount).toFixed(2)}
            <Button color="none" size="xs" on:click={() => removeExpense(expense.id)}>
              <Icon src={Trash} class="h-4 w-4" />
            </Button>
          </div>
        </div>
      {/each}
    </div>
    <div class="mt-6 grid grid-cols-5 gap-4 items-end">
      <div>
        <Label for="date" class="mb-2">Date</Label>
        <Input id="date" type="date" bind:value={newExpense.date} />
      </div>
      <div>
        <Label for="category" class="mb-2">Category</Label>
        <Select class="capitalize" id="category" bind:value={newExpense.category} items={categories} />
      </div>
      <div class="col-span-2">
        <Label for="description" class="mb-2">Description</Label>
        <Input id="description" bind:value={newExpense.description} />
      </div>
      <div>
        <Label for="amount" class="mb-2">Amount</Label>
        <Input id="amount" type="number" step="0.01" bind:value={newExpense.amount} />
      </div>
    </div>
    <Button class="mt-4" on:click={addExpense}>
      <Icon src={Plus} class="mr-2 h-4 w-4" /> Add Expense
    </Button>
  </div>
  <div class="p-4 flex justify-between items-center">
    <div class="font-semibold">Total Expenses:</div>
    <div class="text-xl font-bold">${totalExpenses.toFixed(2)}</div>
  </div>
  <div class="p4 flex justify-end">
    <form action="?/save" method="post" use:enhance={({ formData, cancel, submitter }) => {
      const report = formData.get('report');
      formData.set('report', JSON.stringify(report));
      
      return ({ result, }) => {
        console.log(result);
      }
    }}>
      <input type="hidden" name="report" bind:value={report} />
      <Button type="submit" disabled={totalExpenses < 1}>Save Report</Button>
    </form>
  </div>
</Card>