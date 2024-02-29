<script lang="ts">
	import { Card, Breadcrumb, BreadcrumbItem, Dropdown, DropdownItem, Avatar, Badge, Indicator, Label, Input } from 'flowbite-svelte';
	import { DotsHorizontalOutline } from 'flowbite-svelte-icons';

	export let data;
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>

<div class="container max-w-5xl">
	<div class="flex">
		<div>
			<h4 class="mb-2">
				Welcome, {data?.profile.firstName}
				{data?.profile.lastName}.
			</h4>
			<p class="mb-4">This is your user information. Keep it updated and make it your own.</p>
		</div>
	</div>

	<div class="pb-8">
		<Breadcrumb aria-label="Breadcrumb">
			<BreadcrumbItem href="/" home>Home</BreadcrumbItem>
			<BreadcrumbItem>Profile</BreadcrumbItem>
		</Breadcrumb>
	</div>

	<Card padding="md">
		<div class="flex justify-end">
			<DotsHorizontalOutline />
			<Dropdown class="w-36">
				<DropdownItem>Edit</DropdownItem>
			</Dropdown>
		</div>
		
		<div class="flex flex-col items-center pb-4 space-y-1">
			<Avatar size="lg" />
			<h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">
				{data?.profile.firstName} {data?.profile.lastName}
			</h5>
			<span class="text-sm text-gray-500 dark:text-gray-400">{data.user?.email}</span>
			<Badge color="{data.user?.emailVerified ? 'green' : 'red'}" class="px-2.5 py-0.5">
				<Indicator color="{data.user?.emailVerified ? 'green' : 'red'}" size="xs" class="me-1" />{data.user?.emailVerified ? 'Verified' : 'Not verified'}
			</Badge>
		</div>
		
		<form action="?/edit" class="flex flex-col space-y-3">
			<Label class="space-y-2">
				<span>Email</span>
				<Input type="email" value={data.user?.email} disabled />
			</Label>
			<Label class="space-y-2">
				<span>Address</span>
				<Input type="text" value={data.employee?.employeeProfile.address} disabled />
			</Label>
			<Label class="space-y-2">
				<span>Apt / Unit / Lot</span>
				<Input type="text" value={data.employee?.employeeProfile.address2} disabled />
			</Label>
			<Label class="space-y-2">
				<span>City</span>
				<Input type="text" value={data.employee?.employeeProfile.city} disabled />
			</Label>
			<div class="flex justify-around space-x-2">
				<Label class="space-y-2">
					<span>State</span>
					<Input type="text" value={data.employee?.employeeProfile.state} disabled />
				</Label>
				<Label class="space-y-2">
					<span>Zip</span>
					<Input type="text" value={data.employee?.employeeProfile.zip} disabled />
				</Label>
			</div>
		</form>
	</Card>
</div>
