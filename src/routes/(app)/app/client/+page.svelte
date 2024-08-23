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
		AccordionItem
	} from 'flowbite-svelte';

	export let data;
	/** @type {import('./$types').ActionData} */
	export let form;
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
		<h1 class="text-3xl font-bold text-gray-900 mb-4">Manage Clients</h1>
	</div>

	<Card class="mb-8">
		<Accordion>
			<AccordionItem>
				<svelte:fragment slot="header">
					<span class="text-xl font-semibold text-gray-900"> Add a new client </span>
				</svelte:fragment>
				<form action="?/add" method="post" class="flex flex-col gap-4" use:enhance>
					<Label class="space-y-2">
						<span>Name</span>
						<Input type="text" name="name" id="name" required placeholder="Enter client name" />
					</Label>
					<Button type="submit" class="w-full">
						<UserPlus class="mr-2 h-5 w-5" />
						Save Client
					</Button>
				</form>
			</AccordionItem>
		</Accordion>
	</Card>

	<h2 class="text-2xl font-semibold text-gray-900 mb-4">Clients</h2>
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
				<!-- <Button href={`/clients/${client.id}`} class="mt-4">View Details</Button> -->
			</Card>
		{/each}
	</div>
</div>
