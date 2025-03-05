<script lang="ts">
	import { enhance } from '$app/forms';
	import { UserPlus } from 'lucide-svelte';
	import {
		Breadcrumb,
		BreadcrumbItem,
		Card,
		Button,
		Label,
		Input,
		Badge,
		Accordion,
		AccordionItem,

		Checkbox

	} from 'flowbite-svelte';
	import NewClientModal from './NewClientModal.svelte';

	const { data } = $props();
</script>

<svelte:head>
	<title>Clients</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="mb-6">
		<Breadcrumb aria-label="Breadcrumb" class="mb-4">
			<BreadcrumbItem href="/" home>Home</BreadcrumbItem>
			<BreadcrumbItem>Clients</BreadcrumbItem>
		</Breadcrumb>
		<h2 class="text-3xl font-bold dark:text-gray-300 text-gray-900 mb-4">Manage Clients</h2>
	</div>
	
	<div class="flex justify-between items-center mb-10">
		<div class="relative">
			<input type="text" placeholder="Search" class="py-2 pl-4 pr-10 border rounded-lg w-full" />
			<span class="absolute right-3 top-1/2 transform -translate-y-1/2">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
			</span>
		</div>
		<NewClientModal />
	</div>
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each data?.clients as client}
			<Card>
				<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
					{client?.name}
				</h5>
				{#if client?.contactUserId}
					<Badge color="blue" class="mt-2">
						Contact User ID: {client?.contactUserId}
					</Badge>
				{/if}
				<Button href={`/app/admin/client/${client.id}`}>View Details</Button>
			</Card>
		{/each}
	</div>
</div>
