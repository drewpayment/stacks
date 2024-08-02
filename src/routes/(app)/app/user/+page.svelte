<script lang="ts">
	import AddUserDialog from '$lib/components/AddUserDialog.svelte';
	import ViewUserDialog from '$lib/components/ViewUserDialog.svelte';
	import UserStore from '$lib/stores/user';
	import {
		Avatar,
		Badge,
		Breadcrumb,
		BreadcrumbItem,
		Card,
		Dropdown,
		DropdownItem,
		Indicator
	} from 'flowbite-svelte';
	import { AddressCardSolid, DotsHorizontalOutline } from 'flowbite-svelte-icons';
	import { enhance } from '$app/forms';

	export let data;
	const { users, client } = data;

	if (users) UserStore.set(users);
</script>

<div class="pb-4">
	<Breadcrumb aria-label="Breadcrumb">
		<BreadcrumbItem href="/" home>Home</BreadcrumbItem>
		<BreadcrumbItem>Users</BreadcrumbItem>
	</Breadcrumb>
</div>

<div class="max-w-4xl">
	<h4 class="text-text-900">Users</h4>
</div>

<AddUserDialog {client} />

<div class="flex flex-row justify-start gap-2 py-3">
	{#each $UserStore as user}
		<Card padding="sm">
			<div class="flex justify-end">
				{#if !user.auth_user.emailVerified}
					<DotsHorizontalOutline class="absolute" />
					<Dropdown class="w-36">
						<DropdownItem on:click={(e) => console.log(e)} type="submit">Verify Email</DropdownItem>
						<form action="?/sendPasswordResetLink" method="post" use:enhance={() => {
							return ({ result, update }) => {
								console.log(result);
							}
						}}>
							<input type="hidden" name="email" value={user.auth_user.email} />
							<input type="hidden" name="userId" value={user.auth_user.id} />
							<DropdownItem on:click={(e) => console.log(e)} type="submit">Reset Password</DropdownItem>
						</form>
					</Dropdown>
				{/if}
			</div>
			<div class="flex flex-col items-center pb-4">
				{#if user.user_profile.picture}
					<Avatar size="lg" src={user.user_profile.picture} />
				{:else}
					<Avatar size="lg" />
				{/if}
				<h5 class="my-1 text-xl font-medium text-gray-900 dark:text-white">
					{user.user_profile.firstName}
					{user.user_profile.lastName}
				</h5>
				<span class="text-sm text-gray-500 dark:text-gray-400"
					>{user.auth_user.githubUsername ? user.auth_user.githubUsername : ''}</span
				>
				<div class="flex flex-col mt-4 lg:mt-6 space-y-3">
					<div class="flex items-center space-x-3 rtl:space-x-reverse">
						<span><AddressCardSolid /></span>
						<span>{user.auth_user.email}</span>
					</div>
					<div class="flex justify-center items-center">
						{#if user.auth_user.emailVerified}
							<Badge color="green" rounded class="px-2.5 py-0.5">
								<Indicator color="green" size="xs" class="me-1" />Verified
							</Badge>
						{:else}
							<Badge color="red" rounded class="px-2.5 py-0.5">
								<Indicator color="red" size="xs" class="me-1" />Unverified
							</Badge>
						{/if}
					</div>
				</div>

				<div class="flex justify-end mt-3">
					<ViewUserDialog {user} {client} />
				</div>
			</div>
		</Card>
	{/each}
</div>
