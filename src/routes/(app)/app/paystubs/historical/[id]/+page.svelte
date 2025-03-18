<script lang="ts">
	import LegacySalesTable from '$lib/components/LegacySalesTable.svelte';
	import type {
		SelectLegacyExpense,
		SelectLegacyInvoice,
		SelectLegacyOverride,
		SelectLegacyPaystub
	} from '$lib/drizzle/mysql/db.model';
	import { formatCurrency, formatDate, toHumanDate } from '$lib/utils/utils';
	import dayjs from 'dayjs';
	import {
		Breadcrumb,
		BreadcrumbItem,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	// Convert to Svelte 5 props
	const { data } = $props<{
		statement: {
			paystub: SelectLegacyPaystub;
			sales: SelectLegacyInvoice[];
			overrides: SelectLegacyOverride[];
			expenses: SelectLegacyExpense[];
			totals: {
				sales: number;
				overrides: number;
				expenses: number;
			};
			tableData: any;
		};
	}>();

	// Use derived values in Svelte 5
	const totals = $derived(data.statement.totals);
	const paystub = $derived(data.statement.paystub);
	
	// Use derived to compute values that depend on other values
	const nameParts = $derived(paystub?.agentName.split(' '));
	const firstName = $derived(nameParts[0] || '');
	const lastName = $derived(nameParts.slice(1).join(' '));
	
	const employee = $derived(data.statement.tableData.employees[0]);
	const totalSales = $derived(totals && totals.sales);
	const totalOverrides = $derived(totals && totals.overrides);
	const totalExpenses = $derived(totals && totals.expenses);
	
	const issueDateView = $derived(toHumanDate(dayjs(paystub.issueDate, 'YYYY-MM-DD').toDate()));
	const weekendDateView = $derived(toHumanDate(dayjs(paystub.weekendDate, 'YYYY-MM-DD').toDate()));
	
	// Print functionality
	let isPrintMode = $state(false);
	
	const togglePrintMode = () => {
		isPrintMode = !isPrintMode;
		if (isPrintMode) {
			setTimeout(() => {
				window.print();
				isPrintMode = false;
			}, 300);
		}
	};
</script>

<div class="container mx-auto px-4 py-6">
	<!-- Header with print button -->
	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 print:hidden">
		<div>
			<h1 class="text-3xl font-bold text-white">Earnings Statement</h1>
			<p class="text-gray-400">
				Payment Date: {issueDateView}
			</p>
		</div>
		
		<button 
			on:click={togglePrintMode}
			class="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
			</svg>
			Print Statement
		</button>
	</div>

	<!-- Breadcrumb navigation -->
	<div class="mb-6 print:hidden">
		<Breadcrumb>
			<BreadcrumbItem href="/" home>Home</BreadcrumbItem>
			<BreadcrumbItem href="/app/paystubs/historical">Historical Paystubs</BreadcrumbItem>
			<BreadcrumbItem>Legacy Paystub</BreadcrumbItem>
		</Breadcrumb>
	</div>

	<!-- Main content container -->
	<div class="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-lg">
		<!-- Company header -->
		<div class="bg-gray-900 p-4 border-b border-gray-700">
			<h2 class="text-xl font-bold text-white">
				{paystub.vendorName}
			</h2>
		</div>

		<!-- Employee and payment details -->
		<div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
			<div>
				<h3 class="text-xl font-bold text-white mb-3">
					{firstName} {lastName}
				</h3>
				<div class="text-gray-400 space-y-1">
					<div>{employee.address}</div>
					{#if employee.address2}
						<div>{employee.address2}</div>
					{/if}
					{#if employee.city && employee.state && employee.zip}
						<div>
							{employee.city}, {employee.state} {employee.zip}
						</div>
					{/if}
				</div>
			</div>

			<div class="bg-gray-750 rounded-lg p-4 h-min">
				<table class="w-full text-left">
					<tbody>
						<tr>
							<td class="font-semibold text-gray-400 pb-2">Pay Date:</td>
							<td class="text-white text-right pb-2">{issueDateView}</td>
						</tr>
						<tr>
							<td class="font-semibold text-gray-400">Weekending:</td>
							<td class="text-white text-right">{weekendDateView}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- Payment summary -->
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 pt-2 pb-6">
			<div class="bg-gray-750 rounded-lg p-4 text-center">
				<h4 class="text-lg font-semibold text-gray-400 mb-2">Gross Pay</h4>
				<p class="text-xl font-bold text-white">
					{formatCurrency(parseFloat(paystub.amount))}
				</p>
			</div>
			
			<div class="bg-gray-750 rounded-lg p-4 text-center">
				<h4 class="text-lg font-semibold text-gray-400 mb-2">Total Deductions</h4>
				<p class="text-xl font-bold text-white">
					{formatCurrency(0)}
				</p>
			</div>
			
			<div class="bg-gray-750 rounded-lg p-4 text-center">
				<h4 class="text-lg font-semibold text-gray-400 mb-2">Net Pay</h4>
				<p class="text-xl font-bold text-blue-400">
					{formatCurrency(parseFloat(paystub.amount))}
				</p>
			</div>
		</div>

		<!-- Payment details -->
		<div class="border-t border-gray-700 px-6 py-6">
			<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
				<div class="bg-gray-750 rounded-lg p-3 text-center">
					<h5 class="text-sm font-semibold text-gray-400 mb-1">Vendor</h5>
					<p class="font-medium text-white">
						{paystub.vendorName}
					</p>
				</div>
				
				<div class="bg-gray-750 rounded-lg p-3 text-center">
					<h5 class="text-sm font-semibold text-gray-400 mb-1">Sales</h5>
					<p class="font-medium text-white">
						{totalSales}
					</p>
				</div>
				
				<div class="bg-gray-750 rounded-lg p-3 text-center">
					<h5 class="text-sm font-semibold text-gray-400 mb-1">Overrides</h5>
					<p class="font-medium text-white">
						{formatCurrency(totalOverrides)}
					</p>
				</div>
				
				<div class="bg-gray-750 rounded-lg p-3 text-center">
					<h5 class="text-sm font-semibold text-gray-400 mb-1">Expenses</h5>
					<p class="font-medium text-white">
						{formatCurrency(totalExpenses)}
					</p>
				</div>
			</div>

			<!-- Sales table -->
			{#if data.statement.tableData.sales.length > 0}
				<div class="overflow-x-auto mb-8">
					<LegacySalesTable data={data.statement.tableData} viewOnly={true} />
				</div>
			{/if}

			<!-- Overrides table -->
			{#if data.statement.overrides.length > 0}
				<div class="my-8">
					<h3 class="text-xl font-bold text-white mb-4">Overrides</h3>
					<div class="overflow-x-auto">
						<Table color="dark" striped={true}>
							<TableHead class="text-sm text-gray-400 uppercase">
								<TableHeadCell>ID</TableHeadCell>
								<TableHeadCell>Name</TableHeadCell>
								<TableHeadCell>Issue Date</TableHeadCell>
								<TableHeadCell>Sales</TableHeadCell>
								<TableHeadCell>Commission</TableHeadCell>
								<TableHeadCell>Total</TableHeadCell>
							</TableHead>
							<TableBody>
								{#each data.statement.overrides as override (override.ovrid)}
									<TableBodyRow>
										<TableBodyCell>{override.ovrid}</TableBodyCell>
										<TableBodyCell>{override.name}</TableBodyCell>
										<TableBodyCell>{formatDate(override.issueDate)}</TableBodyCell>
										<TableBodyCell>{override.sales}</TableBodyCell>
										<TableBodyCell>{formatCurrency(parseFloat(override.commission))}</TableBodyCell>
										<TableBodyCell>{formatCurrency(parseFloat(override.total))}</TableBodyCell>
									</TableBodyRow>
								{/each}
								<TableBodyRow class="bg-blue-900/40 font-semibold">
									<TableBodyCell colspan="5" class="text-right">Total Overrides:</TableBodyCell>
									<TableBodyCell>{formatCurrency(totalOverrides)}</TableBodyCell>
								</TableBodyRow>
							</TableBody>
						</Table>
					</div>
				</div>
			{/if}

			<!-- Expenses table -->
			{#if data.statement.expenses.length > 0}
				<div class="my-8">
					<h3 class="text-xl font-bold text-white mb-4">Expenses</h3>
					<div class="overflow-x-auto">
						<Table color="dark" striped={true}>
							<TableHead class="text-sm text-gray-400 uppercase">
								<TableHeadCell>ID</TableHeadCell>
								<TableHeadCell>Type</TableHeadCell>
								<TableHeadCell>Issue Date</TableHeadCell>
								<TableHeadCell>Amount</TableHeadCell>
								<TableHeadCell>Notes</TableHeadCell>
							</TableHead>
							<TableBody>
								{#each data.statement.expenses as expense (expense.expid)}
									<TableBodyRow>
										<TableBodyCell>{expense.expid}</TableBodyCell>
										<TableBodyCell>{expense.type}</TableBodyCell>
										<TableBodyCell>{formatDate(expense.issueDate)}</TableBodyCell>
										<TableBodyCell>{formatCurrency(parseFloat(expense.amount))}</TableBodyCell>
										<TableBodyCell>{expense.notes}</TableBodyCell>
									</TableBodyRow>
								{/each}
								<TableBodyRow class="bg-blue-900/40 font-semibold">
									<TableBodyCell colspan="3" class="text-right">Total Expenses:</TableBodyCell>
									<TableBodyCell>{formatCurrency(totalExpenses)}</TableBodyCell>
									<TableBodyCell></TableBodyCell>
								</TableBodyRow>
							</TableBody>
						</Table>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	/* Print styles */
	@media print {
		:global(body) {
			background-color: white !important;
			color: black !important;
		}
		
		:global(.bg-gray-800),
		:global(.bg-gray-900),
		:global(.bg-gray-750) {
			background-color: white !important;
			border: 1px solid #eee !important;
		}
		
		:global(.text-white),
		:global(.text-gray-400),
		:global(.text-blue-400) {
			color: black !important;
		}
		
		:global(h1),
		:global(h2),
		:global(h3),
		:global(h4) {
			color: black !important;
		}
		
		:global(table) {
			border-color: #ddd !important;
		}
		
		:global(td),
		:global(th) {
			border-color: #ddd !important;
			color: black !important;
		}
	}
</style>