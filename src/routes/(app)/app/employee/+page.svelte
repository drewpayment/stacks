<script lang="ts">
	import AddEmployeeDialog from '$lib/components/AddEmployeeDialog.svelte';
	import EmployeeCard from '$lib/components/EmployeeCard.svelte';
	import type { SelectLegacyEmployee } from '$lib/drizzle/mysql/db.model';
	import type { Employee } from '$lib/drizzle/postgres/db.model';
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';

  
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

<div class="pb-4">
  <AddEmployeeDialog />
</div>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
  {#each data?.employees as employee}
    <div class="space-y-6"><EmployeeCard employee={employee} /></div>
  {/each}
  {#each data?.legacyEmployees as legacyEmployee}
    <div class="space-y-6"><EmployeeCard employee={legacyEmployee} /></div>
  {/each}
</div>