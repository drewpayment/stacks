<script lang="ts">
	import stacks_logo from '$lib/assets/stacks_logo.png';
	import { enhance } from '$app/forms';
	import SelectClient from '$lib/components/SelectClient.svelte';
	import SelectedClientStore from '$lib/stores/client';
	import { ChevronDown, Moon, Plus, Sun } from 'lucide-svelte';
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		Dropdown,
		DropdownItem,
		DropdownDivider,
		Button
	} from 'flowbite-svelte';
	import { page } from '$app/stores';
	import { ChevronRightSolid, PlusSolid } from 'flowbite-svelte-icons';
	import {
		setEmployeeOptions,
		setManualOverrides,
		setSelectedCampaign,
		setSelectedEmployee
	} from '$lib/components/context.js';
	$: activeUrl = $page.url.pathname;
	export let data;

	setSelectedCampaign('');
	setSelectedEmployee('');
	setEmployeeOptions([]);
	setManualOverrides([]);

	if (data.profile && data.profile.clientId) {
		SelectedClientStore.set(data?.profile?.clientId);
	}
	const isDarkMode = writable((browser && localStorage.getItem('theme') === 'dark') || false);

	const toggleTheme = () => {
		const isDark = document.documentElement.classList.contains('dark');
		isDarkMode.set(!isDark);

		if (isDark) {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		} else {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		}
	};

	onMount(() => {
		const isDark = browser && localStorage.getItem('theme') === 'dark';
		if (isDark) document.documentElement.classList.add('dark');
		isDarkMode.set(isDark);
	});
</script>

<Navbar>
	<NavBrand href="/" class="gap-4">
		<img
			src={stacks_logo}
			class="object-contain h-24"
			alt="Stacks logo, looks like overlapping triangles."
		/>
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Stacks</span>
	</NavBrand>

	<div class="flex gap-2 md:order-2">
		{#if data.user && ['super_admin'].includes(data.profile?.role)}
			<SelectClient clients={data.clients} selectedClientId={data.profile.clientId || ''} />
		{/if}
		<button type="button" on:click={toggleTheme}>
			{#if $isDarkMode}
				<span transition:fade><Moon /></span>
			{:else}
				<span transition:fade><Sun /></span>
			{/if}
		</button>
		<NavHamburger />
	</div>

	<NavUl
		{activeUrl}
		class="order-1"
		ulClass={'flex flex-col p-4 mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:text-md'}
	>
		<NavLi href="/">Home</NavLi>
		{#if data.user}
			{#if ['super_admin', 'org_admin'].includes(data.profile?.role)}
				<NavLi class="cursor-pointer">
					Manage<ChevronDown class="w-3 h-3 ml-2 text-primary-800 dark:text-white inline" />
				</NavLi>
				<Dropdown class="w-44 z-20">
					{#if ['super_admin'].includes(data.profile?.role)}
						<DropdownItem href="/app/client">Clients</DropdownItem>
					{/if}
					<DropdownItem href="/app/campaigns">Campaigns</DropdownItem>
					<DropdownDivider />
					<DropdownItem href="/app/user">Users</DropdownItem>
				</Dropdown>
			{/if}

			{#if ['super_admin', 'org_admin'].includes(data.profile?.role)}
				<NavLi class="cursor-pointer">
					Payroll<ChevronDown class="w-3 h-3 ml-2 text-primary-800 dark:text-white inline" />
				</NavLi>
				<Dropdown class="w-44 z-20">
					<DropdownItem href="/app/payroll-cycles?closed=true">Payroll Cycles</DropdownItem>
					<DropdownItem href="/app/payroll/search">Paychecks</DropdownItem>
					<DropdownItem href="/app/paystubs/historical">Historical</DropdownItem>
				</Dropdown>
				<NavLi class="cursor-pointer">
					Employee<ChevronDown class="w-3 h-3 ml-2 text-primary-800 dark:text-white inline" />
				</NavLi>
				<Dropdown class="w-44 z-20">
					<DropdownItem href="/app/employee">Employees</DropdownItem>
					<DropdownItem href="/app/sales">Sales</DropdownItem>
					<DropdownItem href="/app/expenses">Expense Reports</DropdownItem>
				</Dropdown>
			{/if}

			<NavLi href="/app/paystubs">My Pay</NavLi>
			<NavLi href="/app/profile">Profile</NavLi>

			<form method="post" action="/auth/login?/logout" use:enhance>
				<button type="submit">Log Out</button>
			</form>
		{:else}
			<!-- <NavLi href="/auth/signup">Sign Up</NavLi> -->
			<NavLi href="/auth/login">Login</NavLi>
		{/if}
	</NavUl>
</Navbar>

<main class="py-16 container-base">
	<slot />
</main>
