<!-- src/routes/(app)/app/admin/onboarding/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { Heading } from 'flowbite-svelte';
	import { Button } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
	import dayjs from 'dayjs'; // Assuming you have a date formatting utility

	export let data: PageData;

	$: employees = data.employees || [];

	// Placeholder for potential actions like resending invites
	function resendInvite(userId: string | null) {
		if (!userId) {
			console.warn('Cannot resend invite: User ID is missing.');
			// Add user feedback (e.g., toast notification)
			return;
		}
		console.log('Resending invite for user:', userId);
		// TODO: Implement API call to resend invitation/verification email
		alert(`Resend invite action triggered for user ID: ${userId}. (Implementation needed)`);
	}
</script>

<div class="container mx-auto p-4 space-y-6">
	<Heading tag="h3" class="mb-4">Employee Onboarding Status</Heading>

	<div class="flex justify-end mb-4">
		<Button href="/app/admin/onboarding/new">
			New Employee
			<ArrowRightOutline class="w-3 h-3 ms-2" />
		</Button>
	</div>

	{#if employees.length > 0}
		<Table hoverable={true}>
			<TableHead>
				<TableHeadCell>Name</TableHeadCell>
				<TableHeadCell>Email</TableHeadCell>
				<TableHeadCell>Onboarding Since</TableHeadCell>
				<TableHeadCell>Status</TableHeadCell>
				<TableHeadCell>Actions</TableHeadCell>
			</TableHead>
			<TableBody tableBodyClass="divide-y">
				{#each employees as employee (employee.id)}
					<TableBodyRow>
						<TableBodyCell>{employee.firstName} {employee.lastName}</TableBodyCell>
						<TableBodyCell>{employee.email ?? 'N/A'}</TableBodyCell>
						<TableBodyCell>{dayjs(employee.created).format('MMM dd, YYYY')}</TableBodyCell>
						<TableBodyCell>
							{#if employee.emailVerified === false}
								<span
									class="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300"
								>
									Pending Email Verification
								</span>
							{:else}
								<!-- Add other potential statuses here -->
								<span
									class="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
								>
									Unknown
								</span>
							{/if}
						</TableBodyCell>
						<TableBodyCell>
							{#if employee.emailVerified === false && employee.userId}
								<Button size="xs" on:click={() => resendInvite(employee.userId)}>
									Resend Invite <ArrowRightOutline class="w-3 h-3 ms-2" />
								</Button>
							{:else}
								<span class="text-gray-400 italic text-sm">No actions</span>
							{/if}
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	{:else}
		<div
			class="p-4 text-center text-gray-500 bg-gray-50 rounded-lg dark:bg-gray-800 dark:text-gray-400"
		>
			No employees are currently in the onboarding process.
		</div>
	{/if}
</div>
