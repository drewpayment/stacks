<script lang="ts">
	import { enhance } from '$app/forms';
	import type { InsertExpenseItem, InsertExpenseReport } from '$lib/drizzle/postgres/db.model';
  import { Button, Card, Label, Input } from 'flowbite-svelte';
	import { nanoid } from 'nanoid';
  import { Icon, Plus, Trash } from 'svelte-hero-icons';

  let expenses: InsertExpenseItem[] = [];
  let newExpense = {} as InsertExpenseItem;
  let report = {
    items: expenses,
  } as InsertExpenseReport & { items: InsertExpenseItem[] };

  function addExpense() {
    if (newExpense.date && newExpense.description && newExpense.amount) {
      const newExpenseItem = { ...newExpense, id: nanoid(), };
      
      expenses = [...expenses, newExpenseItem ];
      report.items = [...report.items, newExpenseItem];
      
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
      <div class="grid grid-cols-4 gap-4 font-semibold">
        <div>Date</div>
        <div class="col-span-2">Description</div>
        <div>Amount</div>
      </div>
      {#each expenses as expense (expense.id)}
        <div class="grid grid-cols-4 gap-4 items-center">
          <div>{expense.date}</div>
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
    <div class="mt-6 grid grid-cols-4 gap-4 items-end">
      <div>
        <Label for="date" class="mb-2">Date</Label>
        <Input id="date" type="date" bind:value={newExpense.date} />
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