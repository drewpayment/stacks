<script lang="ts">
	export let data;
</script>

<svelte:head>
	<title>Stacks</title>
</svelte:head>

<div class="flex flex-col gap-2">
	{#if data.user}
		<h4>Welcome, {data?.profile?.firstName} {data?.profile?.lastName}.</h4>
	{/if}

	<div
		class="flex flex-col gap-2 mt-4 px-4 py-6 bg-secondary-100 border-secondary-100
		dark:bg-background-300 border dark:border-background-300 rounded-md shadow-md"
	>
		<h5 class="dark:text-text-600">What is Stacks?</h5>
		{#if data.user}
			<p class="leading-9">Choose an option at the top to get started.</p>
		{:else}
			<p class="leading-9">Please log in to get started.</p>
		{/if}
	</div>
</div>
