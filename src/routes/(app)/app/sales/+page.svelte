<script lang="ts">
	import {
		Breadcrumb,
		BreadcrumbItem,
		Button,
		Label,
		Select,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { PenIcon, PlusIcon } from 'lucide-svelte';
	import { toDateString } from '$lib/utils/utils';
	import dayjs from 'dayjs';
	import { CloseSolid } from 'flowbite-svelte-icons';
	import { enhance } from '$app/forms';

	export let data;

	let { campaigns, employees, startDate, endDate, sales: allSales } = data;

	const usd = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	});

	$: employeeItems = employees.map((employee) => {
		return {
			name: `${employee.firstName} ${employee.lastName}`,
			value: employee.id
		};
	});

	$: campaignItems = campaigns.map((campaign) => {
		return {
			name: campaign.name,
			value: campaign.id
		};
	});

	const saleStatusItems = [
		{
			name: 'All',
			value: null
		},
		{
			name: 'Pending',
			value: 'pending'
		},
		{
			name: 'Approved',
			value: 'approved'
		},
		{
			name: 'Declined',
			value: 'declined'
		}
	];

	let selectedEmployeeItem: string;
	let selectedCampaignItem: string;
	let selectedSaleStatusItem: string;

	$: sales =
		selectedEmployeeItem || selectedCampaignItem || selectedSaleStatusItem
			? allSales.filter((sale) => {
					if (selectedCampaignItem && selectedEmployeeItem && selectedSaleStatusItem) {
						return (
							sale.employee.id == selectedEmployeeItem &&
							sale.campaign.id == selectedCampaignItem &&
							sale.statusDescription == selectedSaleStatusItem
						);
					} else if (selectedCampaignItem && selectedEmployeeItem) {
						return (
							sale.employee.id == selectedEmployeeItem && sale.campaign.id == selectedCampaignItem
						);
					} else if (selectedCampaignItem && selectedSaleStatusItem) {
						return (
							sale.campaign.id == selectedCampaignItem &&
							sale.statusDescription == selectedSaleStatusItem
						);
					} else if (selectedEmployeeItem && selectedSaleStatusItem) {
						return (
							sale.employee.id == selectedEmployeeItem &&
							sale.statusDescription == selectedSaleStatusItem
						);
					} else if (selectedCampaignItem) {
						return sale.campaign.id == selectedCampaignItem;
					} else if (selectedEmployeeItem) {
						return sale.employee.id == selectedEmployeeItem;
					} else if (selectedSaleStatusItem) {
						return sale.statusDescription == selectedSaleStatusItem;
					}
				})
			: allSales;

	const clearFilter = (filter: string) => {
		if (filter === 'employee') {
			selectedEmployeeItem = '';
		}

		if (filter === 'campaign') {
			selectedCampaignItem = '';
		}

		if (filter === 'saleStatus') {
			selectedSaleStatusItem = '';
		}
	};

	const inputClass =
		'bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500';

	let submitBtn: HTMLButtonElement;
</script>

<div class="container max-w-5xl p-4">
	<div class="pb-8">
		<h4>Sales</h4>
		<p>
			Search for sales here by agent, campaign, dates, etc. You can also add a new sale
			<Button href="/app/sales/add" pill color="light" size="sm">Add Sale</Button>
			or import numerous sales
			<Button href="/app/sales/import" pill color="light" size="sm">Import Sales</Button>.
		</p>
	</div>

	<div class="pb-4">
		<Breadcrumb>
			<BreadcrumbItem href="/" home>Home</BreadcrumbItem>
			<BreadcrumbItem>Sales</BreadcrumbItem>
		</Breadcrumb>
	</div>

	<div class="flex flex-col pt-4">
		<div class="py-6 px-1">
			<Table striped={true} shadow={true} divClass="bg-background-100 dark:bg-background-300">
				<caption class="p-5 text-left bg-background-100 dark:bg-background-300">
					<div class="flex pb-3 text-lg">
						Filters
					</div>
					<div class="flex flex-row text-sm justify-between">
						<form
							method="post"
							action="?/search"
							class="flex flex-row gap-5 items-center"
							use:enhance={({ cancel }) => {
								return ({ result, update }) => {
									if (result.status !== 200) return;

									const { startDate, endDate, sales } = result.data;

									allSales = [...sales];
								};
							}}
						>
							<div class="mb-2 font-semibold leading-none text-neutral-900 dark:text-neutral-200">
								<Label class="block mb-2">Start Date</Label>
								<input
									type="date"
									name="startDate"
									id="startDate"
									bind:value={startDate}
									class={inputClass}
									on:change={() => submitBtn.click()}
								/>
							</div>

							<p>to</p>

							<div class="mb-2 font-semibold leading-none text-neutral-900 dark:text-neutral-200">
								<Label class="block mb-2">End Date</Label>
								<input
									type="date"
									name="endDate"
									id="endDate"
									bind:value={endDate}
									on:change={() => submitBtn.click()}
									class={inputClass}
								/>
							</div>
							<button type="submit" bind:this={submitBtn} class="hidden"></button>
						</form>
						
						<div class="flex flex-row gap-5 text-sm">
							<div class="mb-2 font-semibold leading-none text-neutral-900 dark:text-neutral-200">
								<Label class="block mb-2">
									<span>
										Employee
										{#if selectedEmployeeItem}
											<Button
												color="alternative"
												pill={true}
												class="!p-2"
												size="xs"
												on:click={() => clearFilter('employee')}
											>
												<CloseSolid class="w-2 h-2" />
											</Button>
										{/if}
									</span>
								</Label>
								<Select items={employeeItems} bind:value={selectedEmployeeItem} placeholder="All Employees" />
							</div>
	
							<div class="mb-2 font-semibold leading-none text-neutral-900 dark:text-neutral-200">
								<Label class="block mb-2">
									Campaign
									{#if selectedCampaignItem}
										<Button
											color="alternative"
											pill={true}
											class="!p-2"
											size="xs"
											on:click={() => clearFilter('campaign')}
										>
											<CloseSolid class="w-2 h-2" />
										</Button>
									{/if}
								</Label>
								<Select items={campaignItems} bind:value={selectedCampaignItem} placeholder="All Campaigns" />
							</div>
	
							<div class="mb-2 font-semibold leading-none text-neutral-900 dark:text-neutral-200">
								<Label class="block mb-2">
									Status
									{#if selectedSaleStatusItem}
										<Button
											color="alternative"
											pill={true}
											class="!p-2"
											size="xs"
											on:click={() => clearFilter('saleStatus')}
										>
											<CloseSolid class="w-2 h-2" />
										</Button>
									{/if}
								</Label>
								<Select items={saleStatusItems} bind:value={selectedSaleStatusItem} placeholder="All Statuses" />
							</div>
						</div>
					</div>
				</caption>
				<TableHead class="text-sm text-background-800 font-semibold">
					<TableHeadCell>Sale Date</TableHeadCell>
					<TableHeadCell>Employee</TableHeadCell>
					<TableHeadCell>Campaign</TableHeadCell>
					<TableHeadCell>Customer</TableHeadCell>
					<TableHeadCell>Address</TableHeadCell>
					<TableHeadCell>Status</TableHeadCell>
					<TableHeadCell>Amount</TableHeadCell>
					<TableHeadCell>
						<span class="sr-only">Edit</span>
					</TableHeadCell>
				</TableHead>

				<TableBody tableBodyClass="divide-y">
					{#if sales && sales.length > 0}
						{#each sales as sale (sale.id)}
							<TableBodyRow>
								<TableBodyCell>{toDateString(sale.saleDate)}</TableBodyCell>
								<TableBodyCell>{sale.employee?.firstName} {sale.employee?.lastName}</TableBodyCell>
								<TableBodyCell>{sale.campaign.name}</TableBodyCell>
								<TableBodyCell>{sale.customerFirstName} {sale.customerLastName}</TableBodyCell>
								<TableBodyCell>{sale.customerAddress}</TableBodyCell>
								<TableBodyCell tdClass="capitalize">{sale.statusDescription}</TableBodyCell>
								<TableBodyCell>{usd.format(Number(sale.saleAmount))}</TableBodyCell>
								<TableBodyCell>
									<Button href={`/app/sales/${sale.id}`} class="!p-2">
										<span class="sr-only">Edit</span>
										<PenIcon class="w-3 h-3" />
									</Button>
								</TableBodyCell>
							</TableBodyRow>
						{/each}
					{:else}
						<TableBodyRow>
							<TableBodyCell colspan="8" tdClass="text-center italic p-4">
								<span class="text-lg">No sales were found for the specified filters.</span>
							</TableBodyCell>
						</TableBodyRow>
					{/if}
				</TableBody>
			</Table>
		</div>
	</div>
</div>
