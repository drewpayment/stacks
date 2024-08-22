<script lang="ts">
	import type { ExpenseReportResult } from '$lib/drizzle/postgres/types/expenses.model';
	import {
		Card,
		Button,
		Table,
		TableHead,
		TableHeadCell,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		Select,
		type SelectOptionType
	} from 'flowbite-svelte';
	import { Icon, ChevronRight } from 'svelte-hero-icons';

	export let data;
	const { reports: allReports, employees, payPeriods } = data;
	let expenseReports = allReports;

	const statuses: SelectOptionType<string>[] = [
		{ name: 'All', value: '' },
		{ name: 'Approved', value: 'approved' },
		{ name: 'Pending', value: 'pending' },
		{ name: 'Rejected', value: 'rejected' }
	];

	let selectedEmployee = '';
	let selectedPayPeriod = '';
	let selectedStatus = '';

	$: {
		let reports: ExpenseReportResult[] = allReports;

		if (selectedEmployee)
			reports = reports.filter((report) => report.employeeId === selectedEmployee);
		// need expenseReports only have paystubs attached and need to get paystubs associated with the payroll cycle....
		// this filter might just not work
		// if (selectedPayPeriod) reports = reports.filter(report => report.)
		if (selectedStatus)
			reports = reports.filter((report) => report.approvalStatus === selectedStatus);

		expenseReports = [...reports];
	}
</script>

<div class="container max-w-5xl">
	<h1 class="text-3xl font-bold mb-6">Expense Reports</h1>

	<Card class="w-full mb-4 max-w-5xl">
		<div class="flex justify-between items-center mb-4">
			<h2 class="text-xl font-semibold">Existing Reports</h2>
			<Button color="blue" href="/app/expenses/add">Create New Report</Button>
		</div>
		<div class="flex gap-4 mb-4">
			<Select
				class="w-1/2"
				bind:value={selectedEmployee}
				items={employees}
				placeholder="Select employee"
			/>
			<!-- <Select
				class="w-1/3"
				bind:value={selectedPayPeriod}
				items={payPeriods}
				placeholder="Select pay period"
			/> -->
			<Select
				class="w-1/2"
				bind:value={selectedStatus}
				items={statuses}
				placeholder="Select status"
			/>
		</div>
		<Table hoverable={true}>
			<TableHead>
				<TableHeadCell>Employee Name</TableHeadCell>
				<TableHeadCell>Pay Period</TableHeadCell>
				<TableHeadCell>Total Amount</TableHeadCell>
				<TableHeadCell>Status</TableHeadCell>
				<TableHeadCell>Actions</TableHeadCell>
			</TableHead>
			<TableBody tableBodyClass="divide-y">
				{#each expenseReports as report (report.id)}
					<TableBodyRow>
						<TableBodyCell class="font-medium"
							>{report.employee.firstName} {report.employee.lastName}</TableBodyCell
						>
						<TableBodyCell>
							{#if report.paystub?.payrollCycle != null}
								{report.paystub?.payrollCycle.startDate?.toLocaleDateString()} - {report.paystub?.payrollCycle.endDate?.toLocaleDateString()}
							{:else}
								Not assigned
							{/if}
						</TableBodyCell>
						<TableBodyCell>${Number(report.totalAmount).toFixed(2)}</TableBodyCell>
						<TableBodyCell>
							<span
								class={`px-2 py-1 rounded-full text-xs font-semibold capitalize
                ${
									report.approvalStatus === 'approved'
										? 'bg-green-100 text-green-800'
										: report.approvalStatus === 'pending'
											? 'bg-yellow-100 text-yellow-800'
											: 'bg-red-100 text-red-800'
								}`}
							>
								{report.approvalStatus}
							</span>
						</TableBodyCell>
						<TableBodyCell>
							<Button size="xs" color="light" href={`/app/expenses/${report.id}`}>
								View <Icon src={ChevronRight} class="w-4 h-4 ml-1" />
							</Button>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</Card>

	<div class="mt-4 text-sm text-gray-600">
		<p>Note: Expense reports are associated with the corresponding pay period's paystub.</p>
		<p>
			To view detailed information or make changes, click the "View" button next to each report.
		</p>
	</div>
</div>
