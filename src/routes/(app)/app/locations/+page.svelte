<script lang="ts">
	import { Breadcrumb, BreadcrumbItem, Card, Badge, Button } from 'flowbite-svelte';
	import NewLocationModal from './NewLocationModal.svelte';

  const { data } = $props();
  const { locations, profile } = data;
</script>

<svelte:head>
	<title>Locations</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="mb-6">
		<Breadcrumb aria-label="Breadcrumb" class="mb-4">
			<BreadcrumbItem href="/" home>Home</BreadcrumbItem>
			<BreadcrumbItem>Clients</BreadcrumbItem>
		</Breadcrumb>
		<h2 class="text-3xl font-bold dark:text-gray-300 text-gray-900 mb-4">{profile.client.name}'s Locations</h2>
	</div>
	
	<div class="flex justify-between items-center mb-10">
		<div class="relative">
			<input type="text" placeholder="Search" class="py-2 pl-4 pr-10 border rounded-lg w-full" />
			<span class="absolute right-3 top-1/2 transform -translate-y-1/2">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
			</span>
		</div>
		<NewLocationModal />
	</div>
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each locations as location}
			<Card>
				<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
					{location?.name}
				</h5>
				<Button href={`/app/locations/${location.id}`}>View Details</Button>
			</Card>
		{/each}
	</div>
</div>