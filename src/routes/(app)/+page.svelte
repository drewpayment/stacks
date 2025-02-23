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
		Heading
	} from 'flowbite-svelte';
	import { FileText, Users2, Clock, TrendingUp, Upload, Download, Calendar } from 'lucide-svelte';

	export let data;
	const { lastPayrollCycle, profile, user, cycles: historyCycles } = data;
	const cycle = (lastPayrollCycle || {}) as SelectPayrollCycle & {
		paystubs: (SelectPaystub & { employee: SelectEmployee })[];
	};
	const cycles = historyCycles as (SelectPayrollCycle & { paystubs: SelectPaystub[] })[];

	const quickActions = [
		{
			title: "Document Portal",
			description: "Upload and share company documents",
			icon: FileText,
			link: "/app/documents"
		},
		{
			title: "Team Directory",
			description: "Find and connect with colleagues",
			icon: Users2,
			link: "/app/employee"
		},
		{
			title: "Time & Attendance",
			description: "Manage schedules and time off",
			icon: Clock,
			link: "/app/time"
		},
		{
			title: "Reports",
			description: "Access business insights and analytics",
			icon: TrendingUp,
			link: "/app/reports"
		}
	];

	// Get recent activities
	const recentActivities = [
		{
			icon: Upload,
			text: "New document uploaded",
			timestamp: "2 hours ago"
		},
		{
			icon: Download,
			text: "Payroll report downloaded",
			timestamp: "5 hours ago"
		}
	];
</script>

<svelte:head>
	<title>Stacks</title>
</svelte:head>

<div class="flex flex-col space-y-6">
	{#if user}
		<!-- Welcome and Quick Actions Section -->
		<div class="flex flex-col space-y-6">
			<div class="flex justify-between items-center">
				<Heading tag="h1" class="text-3xl font-bold dark:text-white">
					Welcome, {profile?.firstName} {profile?.lastName}
				</Heading>
			</div>

			<!-- Quick Actions Grid -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{#each quickActions as action}
					<Card padding="lg" class="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
						<a href={action.link} class="block">
							<div class="flex items-start space-x-4">
								<div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
									<svelte:component this={action.icon} class="w-6 h-6 text-blue-700 dark:text-blue-300" />
								</div>
								<div>
									<h6 class="font-semibold dark:text-white">{action.title}</h6>
									<p class="text-sm text-gray-500 dark:text-gray-400">{action.description}</p>
								</div>
							</div>
						</a>
					</Card>
				{/each}
			</div>
		</div>

		<!-- Admin Dashboard Section -->
		{#if ['org_admin', 'super_admin', 'admin'].includes(user.profile.role)}
			<!-- Recent Activity and Payroll Summary -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
				<!-- Recent Activity -->
				<Card class="dark:bg-gray-800">
					<div class="p-4">
						<Heading tag="h6" class="mb-4 dark:text-white">Recent Activity</Heading>
						<div class="space-y-4">
							{#each recentActivities as activity}
								<div class="flex items-center space-x-3">
									<svelte:component this={activity.icon} class="w-5 h-5 text-blue-500" />
									<div>
										<p class="text-sm dark:text-white">{activity.text}</p>
										<p class="text-xs text-gray-500 dark:text-gray-400">{activity.timestamp}</p>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</Card>

				<!-- Latest Payroll -->
				<Card class="dark:bg-gray-800">
					<div class="p-4">
						<Heading tag="h6" class="mb-4 dark:text-white">Latest Payroll</Heading>
						<div class="space-y-4">
							<div class="flex items-center justify-between">
								<div>
									<p class="text-sm font-medium dark:text-white">Next Pay Date</p>
									<p class="text-xs text-gray-500 dark:text-gray-400">
										{cycle ? toHumanDate(cycle.paymentDate) : 'No upcoming payroll'}
									</p>
								</div>
								<Calendar class="w-5 h-5 text-gray-400" />
							</div>
							<div>
								<p class="text-sm font-medium dark:text-white">Top Performers</p>
								{#if cycle?.paystubs?.length > 0}
									{#each cycle.paystubs.slice(0, 3) as paystub}
										<div class="flex justify-between items-center mt-2">
											<p class="text-sm dark:text-gray-300">
												{paystub.employee.firstName} {paystub.employee.lastName}
											</p>
											<p class="text-sm font-medium dark:text-gray-300">
												{formatCurrency(paystub.netPay)}
											</p>
										</div>
									{/each}
									{#if cycle.paystubs.length > 3}
										<Button href={'/app/payroll-cycles/' + cycle?.id} class="mt-4">
											View All
										</Button>
									{/if}
								{:else}
									<p class="text-sm text-gray-500 dark:text-gray-400">No paystubs available</p>
								{/if}
							</div>
						</div>
					</div>
				</Card>
				
				<!-- Recent Payroll Cycles -->
				<Card class="dark:bg-gray-800">
					<div class="p-4">
						<div class="flex justify-between items-center mb-4">
							<Heading tag="h6" class="dark:text-white">Recent Payroll Cycles</Heading>
							<Button href="/app/payroll-cycles">View All</Button>
						</div>
						<div class="space-y-4">
							{#if cycles.length > 0}
								{#each cycles.slice(0, 5) as cycle}
									<div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
										<div class="flex flex-col">
											<p class="text-sm font-medium dark:text-white">
												{toHumanDate(cycle.paymentDate)}
											</p>
											<p class="text-xs text-gray-500 dark:text-gray-400">
												{cycle.paystubs?.length} paystubs
											</p>
										</div>
										<div class="flex items-center gap-4">
											<span class="text-sm text-gray-500 dark:text-gray-400">
												{cycle.isClosed ? 'Closed' : 'Open'}
											</span>
											<Button size="sm" href={`/app/payroll-cycles/${cycle.id}`}>
												Details
											</Button>
										</div>
									</div>
								{/each}
							{:else}
								<p class="text-center text-gray-500 dark:text-gray-400">No payroll cycles found</p>
							{/if}
						</div>
					</div>
				</Card>
			</div>

			
		{/if}
	{:else}
		<div class="text-center">
			<h5 class="dark:text-text-600">What is Stacks?</h5>
			<p class="leading-9">Please log in to get started.</p>
		</div>
	{/if}
</div>