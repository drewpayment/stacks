<script lang="ts">
	import type {
		InsertExpenseReport,
		SelectEmployee,
		SelectPayrollCycle,
		SelectPaystub
	} from '$lib/drizzle/postgres/db.model';
	import {
		Card,
		Button,
		Table,
		TableHead,
		TableHeadCell,
		TableBody,
		TableBodyCell,
		TableBodyRow
	} from 'flowbite-svelte';
	import { Icon, ChevronRight } from 'svelte-hero-icons';

	// Mock data for expense reports
	let expenseReports = [
		{
			id: '1',
			clientId: 'cmp',
			employeeId: '398sdlfjsd',
			paystubId: '123456',
			submissionDate: new Date('2024-08-10'),
			approvalStatus: 'pending',
			approvalDate: '',
			totalAmount: '450.75',
			created: new Date('2024-08-09T12:00:00Z'),
			updated: new Date('2024-08-09T12:00:00Z'),
			employee: {
				id: 'sdofaijsd',
				clientId: 'cmp',
				firstName: 'John',
				lastName: 'Doe',
				isCommissionable: true,
				userId: '9sdaifsa'
			},
			paystub: {
				id: 'dsafjdas;',
				cycle: {
					startDate: new Date('2024-08-10'),
					endDate: new Date('2024-08-20')
				}
			},
		},
		{
			id: '2',
			clientId: 'cmp',
			employeeId: '398sdlfjsd',
			paystubId: '123456',
			submissionDate: new Date('2024-08-10'),
			approvalStatus: 'approved',
			approvalDate: new Date('2024-08-12'),
			totalAmount: '45.75',
			created: new Date('2024-08-09T12:00:00Z'),
			updated: new Date('2024-08-09T12:00:00Z'),
			employee: {
				id: 'sdofaijsd',
				clientId: 'cmp',
				firstName: 'John',
				lastName: 'Doe',
				isCommissionable: true,
				userId: '9sdaifsa'
			},
      paystub: {
				id: 'dsafjdas;',
				cycle: {
					startDate: new Date('2024-08-10'),
					endDate: new Date('2024-08-20')
				}
			},
		}
	] as (InsertExpenseReport & {
		employee: Partial<SelectEmployee>;
		paystub: Partial<SelectPaystub> & {
			cycle: Partial<SelectPayrollCycle>;
		};
	})[];

	function viewReport(id: string) {
		// In a real application, this would navigate to the individual report page
		console.log(`Viewing report ${id}`);
	}
</script>

<div class="container max-w-5xl">
	<h1 class="text-3xl font-bold mb-6">Expense Reports</h1>

	<Card class="w-full mb-4 max-w-5xl">
		<div class="flex justify-between items-center mb-4">
			<h2 class="text-xl font-semibold">Existing Reports</h2>
			<Button color="blue">Create New Report</Button>
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
						<TableBodyCell>{report.paystub.cycle.startDate?.toLocaleDateString()} - {report.paystub.cycle.endDate?.toLocaleDateString()}</TableBodyCell>
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
							<Button size="xs" color="light" on:click={() => viewReport(report.id)}>
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
