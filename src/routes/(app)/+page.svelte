<script lang="ts">
	import type { SelectPayrollCycle, SelectPaystub } from '$lib/drizzle/postgres/db.model.js';
	import { toHumanDate } from '$lib/utils';
	import { Button, Card } from 'flowbite-svelte';
	import { CheckCircleSolid } from 'flowbite-svelte-icons';

	export let data;
	
	const { lastPayrollCycle, profile, user } = data;
	
	const cycle = (lastPayrollCycle || {}) as SelectPayrollCycle & { paystubs: SelectPaystub[] };
</script>

<svelte:head>
	<title>Stacks</title>
</svelte:head>

<div class="flex flex-col gap-2">
	{#if user}
		<h4>Welcome, {profile?.firstName} {profile?.lastName}.</h4>
	{/if}

	<div
		class="flex flex-col gap-2 mt-4 px-4 py-6 bg-secondary-100 border-secondary-100
		dark:bg-background-300 border dark:border-background-300 rounded-md shadow-md"
	>
		{#if user}
			<Card size="sm">
				<div class="mb-4 text-xl font-medium text-gray-400 dark:text-gray-500">Latest Payroll</div>
				<h5 class="mb-4 text-2xl font-medium text-gray-600 dark:text-gray-50">{ toHumanDate(cycle.paymentDate) }</h5>
				<div class="flex items-baseline text-gray-900 dark:text-white">
					<ul class="my-7 space-y-4">
						<li class="flex space-x-2 rtl:space-x-reverse">
							<CheckCircleSolid class="w-4 h-4 text-primary-600 dark:text-primary-500" />
							<span class="text-xl font-extrabold tracking-tight">{ cycle.paystubs?.length } paystubs</span>
						</li>
						<li class="flex space-x-2 rtl:space-x-reverse">
							<CheckCircleSolid class="w-4 h-4 text-primary-600 dark:text-primary-500" />
							<span class="text-xl font-extrabold tracking-tight">${ cycle.paystubs?.reduce((acc, curr) => acc + Number(curr.netPay), 0) }</span> total net
						</li>
					</ul>
				</div>
				<Button href={'/app/payroll-cycles/' + cycle.id}>View Details</Button>
			</Card>
		{:else}
			<h5 class="dark:text-text-600">What is Stacks?</h5>
			<p class="leading-9">Please log in to get started.</p>
		{/if}
	</div>
</div>
