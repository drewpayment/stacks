<script lang="ts">
	import { enhance } from '$app/forms';
	import { ArrowLeft, Upload } from 'lucide-svelte';
	import {
		Card,
		Button,
		Label,
		Input,
		Badge,
		Select,
		Tabs,
		TabItem,
		Toggle
	} from 'flowbite-svelte';
	import { AdjustmentsVerticalSolid, BuildingSolid, InfoCircleSolid, ReceiptSolid, UserCircleSolid } from 'flowbite-svelte-icons';
	
	const { data } = $props();
  const { location } = data;
	
  const client = {};
	let activeTab = $state('overview');
	
	// For country selection
	const countries = [
		{ name: 'United States', value: 'USA' },
		{ name: 'Canada', value: 'CAN' },
	];
	
	const subscriptions = [
		{ name: 'Standard', value: 'standard' },
		{ name: 'Premium', value: 'premium' },
		{ name: 'Trial', value: 'trial' },
	];
	
	function setActiveTab(tab: string) {
		activeTab = tab;
	}
	
	function setBillingAddressFormData(form: FormData) {
		const result = {
			country: form.get('country') as string,
			address: form.get('address') as string,
			city: form.get('city') as string,
			state: form.get('state') as string,
			zip: form.get('zip') as string,
		} as {
			country: string;
			address: string;
			city: string;
			state: string;
			zip: string;
		};
		
		return JSON.stringify(result);
	}
</script>

<svelte:head>
	<title>Location Information</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-2xl font-bold">Location Information</h1>
	</div>

	<div class="mb-6">
		<a href="/app/locations" class="inline-flex items-center text-gray-600 hover:text-gray-900">
			<ArrowLeft class="w-4 h-4 mr-2" />
			<span>All Locations</span>
		</a>
	</div>

	<form action="?/update" method="post" class="max-w-3xl" use:enhance={() => {
		return ({ result }) => {
			console.log(result);	
		}
	}}>
		<div>
			<Tabs style="underline">
				<TabItem open onclick={() => setActiveTab('overview')}>
					<div slot="title" class="flex items-center gap-2">
						<BuildingSolid size="md" />
						Overview
					</div>
					<div class="space-y-8">
						<div class="pt-4">
							<h3 class="text-lg font-medium mb-4">Location Overview</h3>
						</div>

						<!-- Location Name -->
						<div class="grid grid-cols-3 gap-4 items-center">
							<Label for="name" class="font-medium">Location name*</Label>
							<div class="col-span-2">
								<Input id="name" name="name" type="text" placeholder="Location name" value={location?.name} />
							</div>
						</div>
						
            <!-- Address -->
						<div class="grid grid-cols-3 gap-4 items-center">
							<Label for="address" class="font-medium">Street Address</Label>
							<div class="col-span-2">
								<Input id="address" name="address" type="text" placeholder="123 Main Street" value={location?.address} />
							</div>
						</div>
            
            <!-- City -->
            <div class="grid grid-cols-3 gap-4 items-center">
              <Label for="city" class="font-medium">City</Label>
              <div class="col-span-2">
                <Input id="city" name="city" type="text" placeholder="Townsville" value={location?.city} />
              </div>
            </div>
            
            <!-- State -->
            <div class="grid grid-cols-3 gap-4 items-center">
              <Label for="state" class="font-medium">State</Label>
              <div class="col-span-2">
                <Input id="state" name="state" type="text" placeholder="WA" value={location?.state} />
              </div>
            </div>
            
            <!-- Postal Code -->
            <div class="grid grid-cols-3 gap-4 items-center">
              <Label for="zip" class="font-medium">Zip</Label>
              <div class="col-span-2">
                <Input id="zip" name="zip" type="text" placeholder="97865" value={location?.zip} />
              </div>
            </div>
            
            <!-- Country -->
            <div class="grid grid-cols-3 gap-4 items-center">
              <Label for="country" class="font-medium">Country</Label>
              <div class="col-span-2">
                <Input id="country" name="country" type="text" placeholder="US" value={location?.country} />
              </div>
            </div>
					</div>
				</TabItem>
			</Tabs>
		</div>
		
		<div class="mt-8">
			<input type="hidden" name="id" bind:value={location!.id} />
			<Button type="submit">Save changes</Button>
		</div>
	</form>

	<!-- Existing clients list - hidden by default, could be toggled -->
	<div class="hidden mt-12">
		<h2 class="text-2xl font-semibold text-gray-900 mb-4">Clients</h2>
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each data?.clients || [] as client}
				<Card>
					<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
						{client?.name}
					</h5>
					{#if client?.contactUserId}
						<Badge color="blue" class="mt-2">
							Contact User ID: {client?.contactUserId}
						</Badge>
					{/if}
					<Button href={`/clients/${client.id}`}>View Details</Button>
				</Card>
			{/each}
		</div>
	</div>
</div>