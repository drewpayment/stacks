<script lang="ts">
	import Toast from '$lib/components/Toast.svelte';
	import type {
		SelectEmployee,
		SelectPayrollCycle,
		SelectPaystub
	} from '$lib/drizzle/postgres/db.model';
	import { formatCurrency, toHumanDate } from '$lib/utils/utils';
	import {
		Button,
		Card,
		Checkbox,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { CheckCircleSolid } from 'flowbite-svelte-icons';
	import { Icon, ArrowUpRight } from 'svelte-hero-icons';
	export let data;
	const { lastPayrollCycle, profile, user, cycles: historyCycles } = data;
	const cycle = (lastPayrollCycle || {}) as SelectPayrollCycle & {
		paystubs: (SelectPaystub & { employee: SelectEmployee })[];
	};
	const cycles = historyCycles as (SelectPayrollCycle & { paystubs: SelectPaystub[] })[];
	console.log(data);
</script>

<svelte:head>
	<title>Stacks</title>
</svelte:head>

<div class="flex flex-col">
	{#if user}
		<h4>Welcome, {profile?.firstName} {profile?.lastName}.</h4>
	{/if}
	{#if user && ['org_admin', 'super_admin', 'admin'].includes(user.profile.role)}
		<div
			class="flex flex-col gap-2 mt-4 px-1 py-6 bg-secondary-100 border-secondary-100
		dark:bg-background-300 border dark:border-background-300 rounded-md shadow-md"
		>
			<div class="px-4 mb-4 text-2xl font-medium">Latest Payroll</div>
			<div class="flex flex-col md:flex-row md:justify-around">
				{#if user && ['org_admin', 'super_admin'].includes(user.profile.role)}
					{#if cycle !== null && cycle.paystubs?.length > 0}
					<Card size="sm">
						<h5 class="mb-4 text-2xl font-medium text-gray-600 dark:text-gray-50">
							{toHumanDate(cycle?.paymentDate)}
						</h5>
						<div class="flex items-baseline text-gray-900 dark:text-white">
							<ul class="my-7 space-y-4">
								{#if cycle.paystubs?.length > 0}
								<li class="flex space-x-2 rtl:space-x-reverse">
									<CheckCircleSolid class="w-4 h-4 text-primary-600 dark:text-primary-500" />
									<span class="text-xl font-extrabold tracking-tight"
										>{cycle.paystubs?.length} paystubs</span
									>
								</li>
								{/if}
								{#if cycle.paystubs?.length > 0}
								<li class="flex space-x-2 rtl:space-x-reverse">
									<CheckCircleSolid class="w-4 h-4 text-primary-600 dark:text-primary-500" />
									<span class="text-xl font-extrabold tracking-tight"
										>${cycle.paystubs?.reduce((acc, curr) => acc + Number(curr.netPay), 0)}</span
									> total net
								</li>
								{/if}
							</ul>
						</div>
						<div class="flex flex-col w-full md:flex-row md:justify-end md:w-auto">
							<Button href={'/app/payroll-cycles/' + cycle?.id}>View Details</Button>
						</div>
					</Card>
					{/if}
					<Card size="sm">
						<div class="mb-4 text-xl font-medium text-gray-400 dark:text-gray-500">
							Top Performers
						</div>
						<div class="flex items-baseline text-gray-900 dark:text-white">
							{#if cycle?.paystubs?.length > 0}
							{#each cycle?.paystubs as paystub (paystub.id)}
								<div class="flex flex-col md:flex-row justify-between gap-2 w-full">
									<span class="text-xl font-extrabold tracking-tight"
										>{paystub.employee.firstName} {paystub.employee.lastName}</span
									>
									<span class="text-lg font-bold tracking-tight"
										>{formatCurrency(paystub.netPay)}</span
									>
								</div>
							{/each}
							{:else}
							<span class="text-xl font-extrabold tracking-tight">No paystubs</span>
							{/if}
						</div>
					</Card>
				{:else}
					<h5 class="dark:text-text-600">What is Stacks?</h5>
					<p class="leading-9">Please log in to get started.</p>
				{/if}
			</div>
		</div>
		<div
			class="flex flex-col gap-2 mt-4 px-1 py-6 bg-secondary-100 border-secondary-100 dark:bg-background-300 border dark:border-background-300 rounded-md shadow-md"
		>
			<div class="px-4 mb-4 text-2xl font-medium">Payroll Cycles</div>
			<div class="flex flex-col md:flex-row md:justify-start px-12">
				<Table striped={true} shadow={true}>
					<TableHead theadClass="bg-primary-100">
						<TableHeadCell>&nbsp;</TableHeadCell>
						<TableHeadCell>Paid Date</TableHeadCell>
						<TableHeadCell>Started</TableHeadCell>
						<TableHeadCell>End</TableHeadCell>
						<TableHeadCell>No of Paystubs</TableHeadCell>
						<TableHeadCell>Closed</TableHeadCell>
					</TableHead>
					<TableBody>
						{#if cycles.length > 0}
						{#each cycles as cycle (cycle.id)}
							<TableBodyRow>
								<TableBodyCell>
									<a href={`/app/payroll-cycles/${cycle.id}`} class="w-4 h-4">
										<Icon src={ArrowUpRight} class="w-4 h-4" />
									</a>
								</TableBodyCell>
								<TableBodyCell>{toHumanDate(cycle.paymentDate)}</TableBodyCell>
								<TableBodyCell>{toHumanDate(cycle.startDate)}</TableBodyCell>
								<TableBodyCell>{toHumanDate(cycle.endDate)}</TableBodyCell>
								<TableBodyCell tdClass="text-center">{cycle.paystubs?.length}</TableBodyCell>
								<TableBodyCell>
									<Checkbox checked={cycle.isClosed} disabled="true" />
								</TableBodyCell>
							</TableBodyRow>
						{/each}
						{:else}
							<TableBodyRow>
								<TableBodyCell colSpan={6} class="text-center">
									No payroll cycles found
								</TableBodyCell>
							</TableBodyRow>
						{/if}
					</TableBody>
				</Table>
			</div>
		</div>
	{/if}
</div>
