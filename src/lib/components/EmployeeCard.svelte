<script lang="ts">
	import type { Employee } from '$lib/drizzle/postgres/db.model';
	import { createAvatar, melt } from '@melt-ui/svelte';
	import { AppWindow } from 'lucide-svelte';
  import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { SelectLegacyEmployee } from '$lib/drizzle/mysql/db.model';

	// A blank source to demonstrate the fallback
	const {
		elements: { image, fallback }
	} = createAvatar({
		src: ''
	});

	export let employee: Employee | SelectLegacyEmployee;
	const keys = Object.keys(employee);
	const isLegacy = keys.includes('name');
	let initials = '';
	
	if (isLegacy) {
		initials = (employee as SelectLegacyEmployee).name.split(' ').map((n) => n[0]).join('');
	} else {
		initials = `${(employee as Employee).firstName[0]}${(employee as Employee).lastName[0]}`;
	}
	
	const firstName = isLegacy ? (employee as SelectLegacyEmployee).name.split(' ')[0] : (employee as Employee).firstName;
	const lastName = isLegacy ? (employee as SelectLegacyEmployee).name.split(' ')[1] : (employee as Employee).lastName;
	const email = !isLegacy ? (employee as Employee)?.employeeProfile?.email || '' : (employee as SelectLegacyEmployee)?.email;
	
  let employeeDetailUrl = '';
  onMount(() => {
		employeeDetailUrl = isLegacy
			? `${window.location.href}/${employee?.id}?mode=legacy`
			: `${window.location.href}/${employee?.id}`;
	});
</script>

<div
	class="flex flex-col items-start rounded-[10px] border border-background-100 min-w-40 max-w-[300px] p-1 bg-background-100 dark:bg-primary-200 dark:border-primary-200 bg-clip-border shadow-md text-text-200 dark:shadow-none"
>
	<div class="relative flex h-32 w-full justify-center rounded-xl bg-cover">
		<img
			src="https://horizon-tailwind-react-git-tailwind-components-horizon-ui.vercel.app/static/media/banner.ef572d78f29b0fee0a09.png"
			class="absolute flex h-32 w-full justify-center rounded-xl bg-cover"
      alt=""
		/>
		<div
			class="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-primary-500 dark:!border-navy-700"
		>
			<img
				use:melt={$image}
				class="h-full w-full rounded-full"
				src="https://horizon-tailwind-react-git-tailwind-components-horizon-ui.vercel.app/static/media/avatar11.1060b63041fdffa5f8ef.png"
				alt=""
			/>
			<span use:melt={$fallback} class="text-3xl font-medium dark:text-text-900">{initials}</span>
		</div>
	</div>
	<div class="w-[100%] mt-16 flex flex-col justify-center items-center">
		<h4 class="text-xl font-bold text-text-800 dark:text-text-900">
			{firstName}
			{lastName}
		</h4>
		<p class="text-sm font-normal text-text-800 dark:text-text-900 break-all">{email}</p>
	</div>
	<div class="w-[100%] px-2 mt-6 mb-3 flex justify-end gap-14 md:!gap-14">
    <a href={employeeDetailUrl} class="text-accent-700 dark:text-text-800">
      <AppWindow />
    </a>
		<!-- <div class="flex flex-col items-center justify-center">
			<p class="text-2xl font-bold text-navy-700 dark:text-white">17</p>
			<p class="text-sm font-normal text-gray-600">Posts</p>
		</div>
		<div class="flex flex-col items-center justify-center">
			<p class="text-2xl font-bold text-navy-700 dark:text-white">9.7K</p>
			<p class="text-sm font-normal text-gray-600">Followers</p>
		</div>
		<div class="flex flex-col items-center justify-center">
			<p class="text-2xl font-bold text-navy-700 dark:text-white">434</p>
			<p class="text-sm font-normal text-gray-600">Following</p>
		</div> -->
	</div>
</div>
