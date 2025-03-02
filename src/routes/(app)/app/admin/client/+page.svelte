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
		<h1 class="text-3xl font-bold text-gray-900 mb-4">Manage Clients</h1>
	</div>

	<Accordion class="pr-4">
		<AccordionItem>
			<svelte:fragment slot="header">
				<span class="text-xl font-semibold text-gray-900"> Add a new client </span>
			</svelte:fragment>
			<form action="?/add" method="post" class="flex flex-col gap-4" use:enhance>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Label class="space-y-2">
						<span>Name *</span>
						<Input type="text" name="name" required placeholder="Client name" />
					</Label>
					<Label class="space-y-2">
						<span>Slug *</span>
						<Input type="text" name="slug" required placeholder="Unique URL slug" />
					</Label>

					<Label class="space-y-2">
						<span>Legal Name</span>
						<Input type="text" name="legalName" placeholder="Legal business name" />
					</Label>
					<Label class="space-y-2">
						<span>Tax ID</span>
						<Input type="text" name="taxId" placeholder="Business tax ID" />
					</Label>
					<Label class="space-y-2">
						<span>Industry</span>
						<Input type="text" name="industry" placeholder="Industry sector" />
					</Label>

					<Label class="space-y-2">
						<span>Primary Contact Name</span>
						<Input type="text" name="primaryContactName" placeholder="Contact person name" />
					</Label>
					<Label class="space-y-2">
						<span>Primary Contact Email</span>
						<Input type="email" name="primaryContactEmail" placeholder="contact@example.com" />
					</Label>
					<Label class="space-y-2">
						<span>Primary Contact Phone</span>
						<Input type="tel" name="primaryContactPhone" placeholder="+1 (555) 123-4567" />
					</Label>

					<Label class="space-y-2">
						<span>Billing Email</span>
						<Input type="email" name="billingEmail" placeholder="billing@example.com" />
					</Label>
					<Label class="space-y-2 col-span-full">
						<span>Billing Address (JSON)</span>
						<Input
							type="text"
							name="billingAddress"
						/>
					</Label>

					<Label class="space-y-2">
						<span>Subdomain</span>
						<Input type="text" name="subdomain" placeholder="client-subdomain" />
					</Label>
					<Label class="space-y-2">
						<span>Timezone</span>
						<Input type="text" name="timezone" placeholder="UTC" value="UTC" />
					</Label>
					<Label class="space-y-2">
						<span>Locale</span>
						<Input type="text" name="locale" placeholder="en-US" value="en-US" />
					</Label>
					<Label class="space-y-2">
						<span>Max Users</span>
						<Input type="number" name="maxUsers" placeholder="10" value="10" />
					</Label>

					<Label class="space-y-2">
						<span>Subscription Tier</span>
						<Input type="text" name="subscriptionTier" placeholder="standard" value="standard" />
					</Label>
					<Label class="space-y-2 flex items-center gap-2">
						<Checkbox name="isActive" checked />
						<span>Active Client</span>
					</Label>
					<Label class="space-y-2">
						<span>Trial End Date</span>
						<Input type="datetime-local" name="trialEndsAt" />
					</Label>
				</div>

				<Button type="submit" class="w-full mt-4">
					<UserPlus class="mr-2 h-5 w-5" />
					Create Client
				</Button>
			</form>
		</AccordionItem>
	</Accordion>

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
				<Button href={`/app/admin/client/${client.id}`}>View Details</Button>
			</Card>
		{/each}
	</div>
</div>
