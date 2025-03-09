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
			street: form.get('street') as string,
			city: form.get('city') as string,
			state: form.get('state') as string,
			zip: form.get('postal') as string,
		} as {
			country: string;
			street: string;
			city: string;
			state: string;
			zip: string;
		};
		
		return JSON.stringify(result);
	}
	
	function prepareFormData(formData: FormData): FormData {
		const data = new FormData();
		
		switch (activeTab) {
			case 'billing':
				data.set('email', formData.get('email') as string);
				data.set('billingAddress', setBillingAddressFormData(formData));
				break;
			case 'contact':
				data.set('primaryContactName', formData.get('primaryContactName') as string);
				data.set('primaryContactEmail', formData.get('primaryContactEmail') as string);
				data.set('primaryContactPhone', formData.get('primaryContactPhone') as string);
				break;
			case 'tenant':
				data.set('timezone', formData.get('timezone') as string);
				data.set('locale', formData.get('locale') as string);
				break;
			case 'settings':
				const subTier = formData.get('subscription_tier') as string;
				data.set('maxUsers', formData.get('max_users') as string);
				data.set('subscriptionTier', subTier);
				data.set('isActive', formData.get('is_active') as string);
				if (subTier === 'trial') data.set('trialEndsAt', formData.get('trial_ends_at') as string);
				break;
			case 'overview':
			default:
				data.set('name', formData.get('name') as string);
				data.set('legalName', formData.get('legal_name') as string);
				data.set('taxId', formData.get('tax') as string);
				break;
		}
		
		return data;
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
							<h3 class="text-lg font-medium mb-4">Company Overview</h3>
						</div>
						
						<!-- Company Logo -->
						<div class="grid grid-cols-3 gap-4 items-center">
							<Label for="logo" class="font-medium">Company logo*</Label>
							<div class="col-span-2 flex items-center">
								<div class="w-16 h-16 bg-purple-500 rounded-lg mr-4 flex items-center justify-center">
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg>
								</div>
								<Button color="light" class="flex items-center">
									<Upload class="w-4 h-4 mr-2" />
									Upload
								</Button>
							</div>
						</div>

						<!-- Company Name -->
						<div class="grid grid-cols-3 gap-4 items-center">
							<Label for="name" class="font-medium">Company name*</Label>
							<div class="col-span-2">
								<Input id="name" name="name" type="text" placeholder="Company name" value={client.name} />
							</div>
						</div>
						
						<div class="grid grid-cols-3 gap-4 items-center">
							<Label for="legal_name" class="font-medium">Legal name*</Label>
							<div class="col-span-2">
								<Input id="legal_name" name="legal_name" type="text" placeholder="Legal name" value={client.legalName} />
							</div>
						</div>

						<!-- Email Verification -->
						<!-- <div class="grid grid-cols-3 gap-4">
							<div></div>
							<div class="col-span-2 bg-gray-50 p-4 rounded-lg">
								<div class="flex items-center mb-2 text-gray-700">
									<AlertCircle class="w-4 h-4 mr-2" />
									<span>Please verify your email</span>
								</div>
								<p class="text-sm text-gray-600 mb-4">We sent a 4-digit code to hello@quartzai.io</p>
								<div class="flex gap-2 mb-4">
									<Input type="text" class="w-12 h-12 text-center" maxlength="1" />
									<Input type="text" class="w-12 h-12 text-center" maxlength="1" />
									<Input type="text" class="w-12 h-12 text-center" maxlength="1" />
									<Input type="text" class="w-12 h-12 text-center" maxlength="1" />
								</div>
								<div class="flex items-center justify-between">
									<a href="#" class="text-sm text-gray-600 hover:underline">Didn't get the email?</a>
									<Button size="sm">Verify email</Button>
								</div>
							</div>
						</div> -->

						<!-- VAT or Tax ID -->
						<div class="grid grid-cols-3 gap-4 items-center">
							<Label for="tax" class="font-medium">Company Tax ID</Label>
							<div class="col-span-2">
								<Input id="tax" name="tax" type="text" placeholder="Company VAT or Tax ID" value={client.taxId} />
							</div>
						</div>
					</div>
				</TabItem>
				
				<TabItem onclick={() => setActiveTab('billing')}>
					<div slot="title" class="flex items-center gap-2">
						<ReceiptSolid size="md" />
						Billing
					</div>
					<div class="space-y-8">
						<!-- Billing Address Header -->
						<div class="pt-4">
							<h3 class="text-lg font-medium mb-4">Billing Details</h3>
						</div>
						
						<!-- Email Address -->
						<div class="grid grid-cols-3 gap-4 items-center">
							<Label for="email" class="font-medium">Email*</Label>
							<div class="col-span-2">
								<Input id="email" name="email" type="email" placeholder="hello@quartzai.io" value={client.billingEmail} />
							</div>
						</div>

						<!-- Country -->
						<div class="grid grid-cols-3 gap-4 items-center">
							<Label for="country" class="font-medium">Country</Label>
							<div class="col-span-2">
								<Select id="country" name="country" items={countries} value={client.billingAddress.country} />
							</div>
						</div>

						<!-- Address -->
						<div class="grid grid-cols-3 gap-4 items-center">
							<Label for="street" class="font-medium">Address</Label>
							<div class="col-span-2">
								<Input id="street" name="street" type="text" placeholder="123 Main Street" value={client.billingAddress.street} />
							</div>
						</div>

						<!-- City -->
						<div class="grid grid-cols-3 gap-4 items-center">
							<Label for="city" class="font-medium">City</Label>
							<div class="col-span-2">
								<Input id="city" name="city" type="text" placeholder="City" value={client.billingAddress.city} />
							</div>
						</div>

						<!-- State -->
						<div class="grid grid-cols-3 gap-4 items-center">
							<Label for="state" class="font-medium">State</Label>
							<div class="col-span-2">
								<Input id="state" name="state" type="text" placeholder="State" value={client.billingAddress.state} />
							</div>
						</div>

						<!-- Postal Code -->
						<div class="grid grid-cols-3 gap-4 items-center">
							<Label for="postal" class="font-medium">Postal code</Label>
							<div class="col-span-2">
								<Input id="postal" name="postal" type="text" placeholder="Postal code" value={client.billingAddress.zip} />
							</div>
						</div>
					</div>				
				</TabItem>
				
				<TabItem onclick={() => setActiveTab('contact')}>
					<div slot="title" class="flex items-center gap-2">
						<UserCircleSolid size="md" />
						Contact
					</div>
					<div class="space-y-8">
						<div class="pt-4">
							<h3 class="text-lg font-medium mb-4">Primary Contact</h3>
						</div>
						
						<!-- Contact Name -->
						<div class="grid grid-cols-3 gap-4 items-center">
							<Label for="primaryContactName" class="font-medium">Contact name</Label>
							<div class="col-span-2">
								<Input id="primaryContactName" name="primaryContactName" type="text" placeholder="Contact name" value={client.primaryContactName} />
							</div>
						</div>
						
						<div class="grid grid-cols-3 gap-4 items-center">
							<Label for="primaryContactEmail" class="font-medium">Contact email</Label>
							<div class="col-span-2">
								<Input id="primaryContactEmail" name="primaryContactEmail" type="email" placeholder="Contact email" value={client.primaryContactEmail} />
							</div>
						</div>
						
						<div class="grid grid-cols-3 gap-4 items-center">
							<Label for="primaryContactPhone" class="font-medium">Contact phone</Label>
							<div class="col-span-2">
								<Input id="primaryContactPhone" name="primaryContactPhone" type="tel" placeholder="Contact phone" value={client.primaryContactPhone} />
							</div>
						</div>
					</div>
				</TabItem>
				
				<TabItem onclick={() => setActiveTab('tenant')}>
					<div slot="title" class="flex items-center gap-2">
						<InfoCircleSolid size="md" />
						Tenant
					</div>
					<div class="space-y-8">
						<div class="pt-4">
							<h3 class="text-lg font-medium mb-4">Tenant Information</h3>
						</div>
						
						<div class="grid grid-cols-3 gap-4 items-center">
							<Label for="timezone" class="font-medium">Timezone</Label>
							<div class="col-span-2">
								<Input id="timezone" name="timezone" type="text" placeholder="EST" value={client.timezone} />
							</div>
						</div>
						
						<div class="grid grid-cols-3 gap-4 items-center">
							<Label for="locale" class="font-medium">Locale</Label>
							<div class="col-span-2">
								<Input id="locale" name="locale" type="text" placeholder="America/Detroit" value={client.locale} />
							</div>
						</div>					
					</div>
				</TabItem>
				
				<TabItem onclick={() => setActiveTab('settings')}>
					<div slot="title" class="flex items-center gap-2">
						<AdjustmentsVerticalSolid size="md" />
						Settings
					</div>
					<div class="space-y-8">
						<div class="pt-4">
							<h3 class="text-lg font-medium mb-4">Settings</h3>
						</div>
						
						<div class="grid grid-cols-3 gap-4 items-center">
							<Label for="max_users" class="font-medium">Max Users</Label>
							<div class="col-span-2">
								<Input id="max_users" name="max_users" type="text" placeholder="Max # of Users" value={client.maxUsers} />
							</div>
						</div>
						
						<div class="grid grid-cols-3 gap-4 items-center">
							<Label for="subscription_tier" class="font-medium">Subscription</Label>
							<div class="col-span-2">
								<Select id="subscription_tier" name="subscription_tier" items={subscriptions} value={client.subscriptionTier}></Select>
							</div>
						</div>
						
						<div class="grid grid-cols-3 gap-4 items-center">
							<Label for="is_active" class="font-medium">Active</Label>
							<div class="col-span-2">
								<Toggle id="is_active" name="is_active" checked={client.isActive} />
							</div>
						</div>
						
						{#if client.subscriptionTier === 'trial'}
							<div class="grid grid-cols-3 gap-4 items center">
								<Label for="trial_ends_at" class="font-medium">Trial Ends</Label>
								<div class="col-span-2">
									<Input type="date" id="trial_ends_at" name="tial_ends_at" value={client.trialEndsAt} />
								</div>
							</div>
						{/if}
					</div>
				</TabItem>
			</Tabs>
		</div>
		
		<div class="mt-8">
			<input type="hidden" name="activeTab" bind:value={activeTab} />
			<input type="hidden" name="id" bind:value={client.id} />
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