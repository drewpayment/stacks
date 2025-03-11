<script lang="ts">
	import { Breadcrumb, BreadcrumbItem, Card, Badge, Button, type SelectOptionType } from 'flowbite-svelte';
	import type { SelectTeam } from '$lib/drizzle/postgres/db.model';
	import NewTeamModal from './NewTeamModal.svelte';

  const { data } = $props();
  const { teams: allTeams, profile, employees } = data;
  
  let teams = $state(allTeams);
  
  function handleClose(team: SelectTeam | null) {
    if (!team) return;
    teams.push(team);
  }
  
  let employeeOptions = $derived(employees.map(e => ({ name: `${e.firstName} ${e.lastName}`, value: e.id } as SelectOptionType<string>)))
</script>

<svelte:head>
	<title>Teams</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="mb-6">
		<Breadcrumb aria-label="Breadcrumb" class="mb-4">
			<BreadcrumbItem href="/" home>Home</BreadcrumbItem>
			<BreadcrumbItem>Teams</BreadcrumbItem>
		</Breadcrumb>
		<h2 class="text-3xl font-bold dark:text-gray-300 text-gray-900 mb-4">Teams</h2>
	</div>
	
	<div class="flex justify-between items-center mb-10">
		<div class="relative">
			<input type="text" placeholder="Search" class="py-2 pl-4 pr-10 border rounded-lg w-full" />
			<span class="absolute right-3 top-1/2 transform -translate-y-1/2">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
			</span>
		</div>
		<NewTeamModal onClose={handleClose} {employeeOptions} />
	</div>
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each teams as team}
			<Card>
				<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
					{team?.name}
				</h5>
				<Button href={`/app/teams/${team.id}`}>View Details</Button>
			</Card>
		{/each}
    
    {#if !teams || teams.length < 1}
      <h4 class="mb-2 text-2xl font-bold tracking-tight text-gray-800 dark:text-gray-400 col-span-2">
        No teams
      </h4>
    {/if}
	</div>
</div>