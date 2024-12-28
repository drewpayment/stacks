<script lang="ts">
	import AddEmployeeDialog from '$lib/components/AddEmployeeDialog.svelte';
	import EmployeeCard from '$lib/components/EmployeeCard.svelte';
	import {
		Breadcrumb,
		BreadcrumbItem,
		Button,
		Input	} from 'flowbite-svelte';
	import { SearchOutline } from 'flowbite-svelte-icons';
	import EmployeePaginator from './EmployeePaginator.svelte';
	import { enhance } from '$app/forms';
	import { onMount, tick } from 'svelte';
	import { writable } from 'svelte/store';

	export let data;

	const { employees: employeesData, params } = data;
	const allEmployees = employeesData?.data || [];
	const count = employeesData?.count || 0;
	
	const employeesStore = writable([...allEmployees]);
  $: employees = $employeesStore;
  
  let btn: HTMLButtonElement;
  
	let search = params?.search;
	let page = params?.page || 1;
	let limit = params?.limit || 16;

	const previous = async () => {
		if (page <= 1) {
      page = 1;
      return;
    }
    page = page - 1;
		await tick();
    btn.click();
  };
	const next = async () => {
		if (Math.floor((page - 1) * limit) >= count) return;
    if (page < 1) page = 1;
		page = page + 1;
		await tick();
    btn.click();
	};
  
  onMount(() => {
    btn = document.getElementById('search_button') as HTMLButtonElement;
  });
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
		<form
			method="post"
			action="?/search"
			use:enhance={() => {
				return async ({ result }) => {
          if (!result.data) return;
          
					const data = result.data;
          employeesStore.set(data.employees.data);
          page = data.params.page;
				};
			}}
		>
			<input type="hidden" name="page" bind:value={page} />
			<input type="hidden" name="limit" bind:value={limit} />
			<Input id="search" type="text" size="lg" name="search" bind:value={search}>
				<SearchOutline slot="left" class="w-6 h-6 text-gray-500 dark:text-gray-400" />
				<Button slot="right" size="sm" type="submit" id="search_button">Search</Button>
			</Input>
		</form>
	</div>
</div>

<div class="flex justify-center pb-4">
  <EmployeePaginator {previous} {next} {page} />
</div>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
	{#each $employeesStore as employee (employee.id)}
		<div class="space-y-6"><EmployeeCard {employee} /></div>
	{/each}
</div>

<div class="flex justify-center pt-4">
  <EmployeePaginator {previous} {next} {page} />
</div>
