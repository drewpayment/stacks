<script lang="ts">
	import { formatCurrency, formatDate } from '$lib/utils/utils';
	import { Breadcrumb, BreadcrumbItem, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
	import SalesTable from '$lib/components/SalesTable.svelte';
	import type { SaleTableInputData } from '$lib/drizzle/postgres/types/sale-table-input-data.model';
	import dayjs from 'dayjs';
	import type { PaystubWith } from '$lib/drizzle/postgres/types/paystbus.model';
	import type { ExpenseReportResult } from '$lib/drizzle/postgres/types/expenses.model';

	export let data;

	const campaigns = data.campaigns as {
		id: string;
		name: string;
		created: Date;
		updated: Date;
		clientId: string;
		url: string | null;
		description: string | null;
		active: boolean;
	}[];
	const paystub = data.paystub as PaystubWith;
	const expenses = data.expenses as {
		reports: ExpenseReportResult[];
		total: number;
	};

	const inputData = {
		sales: paystub.sales as any,
		campaigns,
		employees: [paystub.employee],
		startDate: paystub.payrollCycle
			? dayjs(paystub.payrollCycle.startDate).format('YYYY-MM-DD')
			: null,
		endDate: paystub.payrollCycle ? dayjs(paystub.payrollCycle.endDate).format('YYYY-MM-DD') : null
	} as SaleTableInputData;

	let campaignName: string;
	const getCampaignName = (id: string) => {
		if (campaignName !== undefined) return campaignName;
		campaignName = campaigns.find((campaign) => campaign.id === id)?.name || '';
		return campaignName;
	};
	
	// Add print functionality
	let isPrintMode = false;
	
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
				{#if paystub?.payrollCycle}
					Payment Date: {formatDate(paystub?.payrollCycle?.paymentDate)}
				{:else}
					Payment Date: <span class="italic">Not Assigned to Pay Cycle</span>
				{/if}
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
			<BreadcrumbItem href="/app/payroll/search">Payrolls</BreadcrumbItem>
			<BreadcrumbItem>Paystub</BreadcrumbItem>
		</Breadcrumb>
	</div>

	<!-- Main content container -->
	<div class="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-lg">
		<!-- Company header -->
		<div class="bg-gray-900 p-4 border-b border-gray-700">
			<h2 class="text-xl font-bold text-white">
				{paystub.client.name}
			</h2>
		</div>

		<!-- Employee and payment details -->
		<div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
			<div>
				<h3 class="text-xl font-bold text-white mb-3">
					{paystub.employee.firstName} {paystub.employee.lastName}
				</h3>
				<div class="text-gray-400 space-y-1">
					<div>{paystub.employee?.employeeProfile.address}</div>
					{#if paystub.employee?.employeeProfile.address2}
						<div>{paystub.employee?.employeeProfile.address2}</div>
					{/if}
					<div>
						{paystub.employee?.employeeProfile.city}, {paystub.employee?.employeeProfile.state}
						{paystub.employee?.employeeProfile.zip}
					</div>
				</div>
			</div>

			<div class="bg-gray-750 rounded-lg p-4 h-min">
				<table class="w-full text-left">
					<tbody>
						<tr>
							<td class="font-semibold text-gray-400 pb-2">Pay Date:</td>
							<td class="text-white text-right pb-2">
								{#if paystub?.payrollCycle}
									{formatDate(paystub?.payrollCycle?.paymentDate)}
								{:else}
									<span class="text-gray-500 italic">Not Assigned to Pay Cycle</span>
								{/if}
							</td>
						</tr>
						<tr>
							<td class="font-semibold text-gray-400">Weekending:</td>
							<td class="text-white text-right">
								{#if paystub?.payrollCycle}
									{formatDate(paystub?.payrollCycle?.endDate)}
								{:else}
									<span class="text-gray-500 italic">Not Assigned to Pay Cycle</span>
								{/if}
							</td>
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
					{formatCurrency(paystub.grossPay)}
				</p>
			</div>
			
			<div class="bg-gray-750 rounded-lg p-4 text-center">
				<h4 class="text-lg font-semibold text-gray-400 mb-2">Total Deductions</h4>
				<p class="text-xl font-bold text-white">
					{formatCurrency(paystub.taxDeductions + paystub.otherDeductions)}
				</p>
			</div>
			
			<div class="bg-gray-750 rounded-lg p-4 text-center">
				<h4 class="text-lg font-semibold text-gray-400 mb-2">Net Pay</h4>
				<p class="text-xl font-bold text-blue-400">
					{formatCurrency(paystub.netPay)}
				</p>
			</div>
		</div>

		<!-- Payment details -->
		<div class="border-t border-gray-700 px-6 py-6">
			<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
				<div class="bg-gray-750 rounded-lg p-3 text-center">
					<h5 class="text-sm font-semibold text-gray-400 mb-1">Campaign</h5>
					<p class="font-medium text-white">
						{getCampaignName(paystub.campaignId)}
					</p>
				</div>
				
				<div class="bg-gray-750 rounded-lg p-3 text-center">
					<h5 class="text-sm font-semibold text-gray-400 mb-1">Sales</h5>
					<p class="font-medium text-white">
						{paystub.totalSales}
					</p>
				</div>
				
				<div class="bg-gray-750 rounded-lg p-3 text-center">
					<h5 class="text-sm font-semibold text-gray-400 mb-1">Overrides</h5>
					<p class="font-medium text-white">
						{paystub.totalOverrides}
					</p>
				</div>
				
				<div class="bg-gray-750 rounded-lg p-3 text-center">
					<h5 class="text-sm font-semibold text-gray-400 mb-1">Expenses</h5>
					<p class="font-medium text-white">
						{formatCurrency(expenses.total)}
					</p>
				</div>
			</div>

			<!-- Sales table -->
			<div class="overflow-x-auto mb-8">
				<SalesTable data={inputData} viewOnly={true}></SalesTable>
			</div>
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