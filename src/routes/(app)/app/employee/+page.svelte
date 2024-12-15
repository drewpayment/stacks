<script lang="ts">
	import AddEmployeeDialog from '$lib/components/AddEmployeeDialog.svelte';
	import EmployeeCard from '$lib/components/EmployeeCard.svelte';
	import type { SelectLegacyEmployee } from '$lib/drizzle/mysql/db.model';
	import type { Employee } from '$lib/drizzle/postgres/db.model';
	import { Breadcrumb, BreadcrumbItem, Button, Input, Label } from 'flowbite-svelte';
	import { SearchOutline } from 'flowbite-svelte-icons';

  
  export let data: {
    employees: Employee[];
    legacyEmployees: SelectLegacyEmployee[];
  }
  
  
</script>

<div class="pb-4">
  <Breadcrumb aria-label="Breadcrumb">
    <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
    <BreadcrumbItem>Employees</BreadcrumbItem>
  </Breadcrumb>
</div>

<div class="flex justify-between pb-4">
  <AddEmployeeDialog />
  
  <div class="flex-grow-1 pr-4">
    <form>
      <Input id="search" type="text" size="lg">
        <SearchOutline slot="left" class="w-6 h-6 text-gray-500 dark:text-gray-400" />
        <Button slot="right" size="sm" type="submit">Search</Button>
      </Input>
    </form>
  </div>
</div>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
  {#each data?.employees as employee}
    <div class="space-y-6"><EmployeeCard employee={employee} /></div>
  {/each}
  {#each data?.legacyEmployees as legacyEmployee}
    <div class="space-y-6"><EmployeeCard employee={legacyEmployee} /></div>
  {/each}
</div>