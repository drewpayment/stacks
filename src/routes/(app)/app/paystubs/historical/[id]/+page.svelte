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
		Hr,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	export let data: {
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
	};
	const totals = data.statement.totals;

	console.log(data);

	const paystub = data.statement.paystub;
	const [firstName, ...lastNameParts] = paystub?.agentName.split(' ');
	const lastName = lastNameParts.join(' ');
	const employee = data.statement.tableData.employees[0];
	const totalSales = totals && totals.sales;
	const totalOverrides = totals && totals.overrides;
	const totalExpenses = totals && totals.expenses;
	const issueDateView = toHumanDate(dayjs(paystub.issueDate, 'YYYY-MM-DD').toDate());
	const weekendDateView = toHumanDate(dayjs(paystub.weekendDate, 'YYYY-MM-DD').toDate());
</script>

<div class="container max-w-5xl">
	<div class="flex">
		<div>
			<h1 class="text-2xl font-bold">Earnings Statement</h1>
			<p class="text-gray-500">
				Payment Date: {issueDateView}
			</p>
		</div>
	</div>

	<div class="pb-4">
		<Breadcrumb>
			<BreadcrumbItem href="/" home>Home</BreadcrumbItem>
			<BreadcrumbItem href="/app/paystubs/historical">Historical Paystubs</BreadcrumbItem>
			<BreadcrumbItem>Legacy Paystub</BreadcrumbItem>
		</Breadcrumb>
	</div>

	<div class="w-full p-2">
		<div class="flex py-3">
			<h5 class="mb-2 text-xl font-bold tracking-tight">
				{paystub.vendorName}
			</h5>
		</div>

		<div class="flex py-4 justify-between items-end">
			<div>
				<h5 class="mb-2 text-xl font-bold tracking-tight">
					{firstName}
					{lastName}
				</h5>
				<div>
					<div class="text-gray-500 italic">
						<div>{employee.address}</div>
						<div>
							{#if employee.address2}
								{employee.address2}
							{/if}
						</div>
						{#if employee.city && employee.state && employee.zip}
							<div>
								{employee.city}, {employee.state}
								{employee.zip}
							</div>
						{/if}
					</div>
				</div>
			</div>

			<div>
				<p class="mb-2 tracking-tight">
					<span class="font-bold">Pay Date:</span>
					{issueDateView}
				</p>
				<p class="mb-2 tracking-tight">
					<span class="font-bold">Weekending:</span>
					{weekendDateView}
				</p>
			</div>
		</div>

		<div class="p-4 border-slate-300 border rounded-lg">
			<div class="flex justify-around gap-6 mt-4">
				<div>
					<h5 class="mb-2 text-lg font-bold tracking-tight">Gross Pay</h5>
					<p>
						{formatCurrency(parseFloat(paystub.amount))}
					</p>
				</div>
				<div>
					<h5 class="mb-2 text-lg font-bold tracking-tight">Total Deductions</h5>
					<p>
						{formatCurrency(0)}
					</p>
				</div>
				<div>
					<h5 class="mb-2 text-lg font-bold tracking-tight">Net Pay</h5>
					<p>
						{formatCurrency(parseFloat(paystub.amount))}
					</p>
				</div>
			</div>

			<Hr classHr="w-48 h-1 mx-auto my-4 rounded md:my-10" />

			<div class="flex justify-around gap-6 mb-8">
				<div>
					<h6 class="mb-2 text-md font-bold tracking-tight">Vendor</h6>
					<p class="text-center">
						{paystub.vendorName}
					</p>
				</div>
				<div>
					<h6 class="mb-2 text-md font-bold tracking-tight">Sales</h6>
					<p class="text-center">
						{totalSales}
					</p>
				</div>
				<div>
					<h6 class="mb-2 text-md font-bold tracking-tight">Overrides</h6>
					<p class="text-center">
						{formatCurrency(totalOverrides)}
					</p>
				</div>
				<div>
					<h6 class="mb-2 text-md font-bold tracking-tight">Expenses</h6>
					<p class="text-center">
						{formatCurrency(totalExpenses)}
					</p>
				</div>
			</div>

			{#if data.statement.tableData.sales.length > 0}
				<LegacySalesTable data={data.statement.tableData} viewOnly={true} />
			{/if}

			{#if data.statement.overrides.length > 0}
				<div class="my-8">
					<h3 class="text-xl font-bold mb-4">Overrides</h3>
					<Table>
						<TableHead class="text-sm text-background-800 font-semibold">
							<TableHeadCell>ID</TableHeadCell>
							<TableHeadCell>Name</TableHeadCell>
							<TableHeadCell>Issue Date</TableHeadCell>
							<TableHeadCell>Sales</TableHeadCell>
							<TableHeadCell>Commission</TableHeadCell>
							<TableHeadCell>Total</TableHeadCell>
						</TableHead>
						<TableBody tableBodyClass="divide-y">
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
							<TableBodyRow class="bg-gray-50 font-semibold">
								<TableBodyCell colspan="5" class="text-right">Total Overrides:</TableBodyCell>
								<TableBodyCell>{formatCurrency(totalOverrides)}</TableBodyCell>
							</TableBodyRow>
						</TableBody>
					</Table>
				</div>
			{/if}

			{#if data.statement.expenses.length > 0}
				<div class="my-8">
					<h3 class="text-xl font-bold mb-4">Expenses</h3>
					<Table>
						<TableHead class="text-sm text-background-800 font-semibold">
							<TableHeadCell>ID</TableHeadCell>
							<TableHeadCell>Type</TableHeadCell>
							<TableHeadCell>Issue Date</TableHeadCell>
							<TableHeadCell>Amount</TableHeadCell>
							<TableHeadCell>Notes</TableHeadCell>
						</TableHead>
						<TableBody tableBodyClass="divide-y">
							{#each data.statement.expenses as expense (expense.expid)}
								<TableBodyRow>
									<TableBodyCell>{expense.expid}</TableBodyCell>
									<TableBodyCell>{expense.type}</TableBodyCell>
									<TableBodyCell>{formatDate(expense.issueDate)}</TableBodyCell>
									<TableBodyCell>{formatCurrency(parseFloat(expense.amount))}</TableBodyCell>
									<TableBodyCell>{expense.notes}</TableBodyCell>
								</TableBodyRow>
							{/each}
							<TableBodyRow class="bg-gray-50 font-semibold">
								<TableBodyCell colspan="3" class="text-right">Total Expenses:</TableBodyCell>
								<TableBodyCell>{formatCurrency(totalExpenses)}</TableBodyCell>
								<TableBodyCell></TableBodyCell>
							</TableBodyRow>
						</TableBody>
					</Table>
				</div>
			{/if}
		</div>
	</div>
</div>
