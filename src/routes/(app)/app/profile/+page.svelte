<script lang="ts">
	import { enhance } from '$app/forms';
	import { Card, Breadcrumb, BreadcrumbItem, Dropdown, DropdownItem, Avatar, Badge, Indicator, Label, Input, Button, Modal, Fileupload } from 'flowbite-svelte';
	import { DotsHorizontalOutline } from 'flowbite-svelte-icons';

	export let data;
	const { profile, user } = data;
	
	let isEditMode = false;
	let showAvatarModal = false;
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>

<div class="container max-w-5xl">
	<div class="flex">
		<div>
			<h4 class="mb-2">
				Welcome, {profile?.firstName}
				{profile?.lastName}.
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
				<DropdownItem on:click={() => isEditMode = !isEditMode}>{isEditMode ? 'Cancel' : 'Edit'}</DropdownItem>
			</Dropdown>
		</div>
		
		<div class="flex flex-col items-center pb-4 space-y-1">
			<Button on:click={() => showAvatarModal = true} color="none">
				<Avatar size="lg" />
			</Button>
			<h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">
				{profile?.firstName} {profile?.lastName}
			</h5>
			<span class="text-sm text-gray-500 dark:text-gray-400">{user?.email}</span>
			<Badge color="{user?.emailVerified ? 'green' : 'red'}" class="px-2.5 py-0.5">
				<Indicator color="{user?.emailVerified ? 'green' : 'red'}" size="xs" class="me-1" />{user?.emailVerified ? 'Verified' : 'Not verified'}
			</Badge>
		</div>
		
		<form method="post" action="?/edit" class="flex flex-col space-y-3" use:enhance={() => {
			return ({ result, }) => {
				console.log(result);
			}
		}}>
			<Label class="space-y-2">
				<span>Email</span>
				<Input type="email" value={user?.email} disabled="true" />
			</Label>
			<Label class="space-y-2">
				<span>Address</span>
				<Input type="text" value={profile?.address} name="address" disabled={!isEditMode} />
			</Label>
			<Label class="space-y-2">
				<span>Apt / Unit / Lot</span>
				<Input type="text" value={profile?.address2} name="address2" disabled={!isEditMode} />
			</Label>
			<Label class="space-y-2">
				<span>City</span>
				<Input type="text" value={profile?.city} name="city" disabled={!isEditMode} />
			</Label>
			<div class="flex justify-around space-x-2">
				<Label class="space-y-2">
					<span>State</span>
					<Input type="text" value={profile?.state} name="state" disabled={!isEditMode} />
				</Label>
				<Label class="space-y-2">
					<span>Zip</span>
					<Input type="text" value={profile?.zip} name="zip" disabled={!isEditMode} />
				</Label>
			</div>
			
			<div class="flex justify-end px-2">
				<Button type="submit" disabled={!isEditMode}>Save</Button>
			</div>
		</form>
	</Card>
</div>

<Modal bind:open={showAvatarModal} size="xs" autoclose={false} class="w-full">
	<form method="post" action="?/uploadProfilePhoto" class="flex flex-col space-y-6">
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Upload a profile photo</h3>
		<Label class="space-y-2">
			<span>Profile photo</span>
			<Fileupload accept="image/*" name="profile_photo" />
			<!-- <Input type="file" name="profile_photo" accept="jpg,png,jpeg" /> -->
		</Label>
		<Button type="submit" class="w-full">Upload</Button>
	</form>
</Modal>