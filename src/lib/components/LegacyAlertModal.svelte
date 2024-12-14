<script lang="ts">
	import { Button, Modal } from 'flowbite-svelte';
	import { ExclamationCircleOutline } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';

	export let messageText = 'Are you sure?';
	export let btnConfirmDesc = 'Yes';
	export let btnCancelDesc = 'No';

	export let showModal = false;
	
	export let onConfirm = () => {};
	export let onCancel = () => {};
	
	let hideBtn = false;
	
	onMount(() => {
		messageText = messageText || 'Are you sure?';
		
		if (showModal) hideBtn = true;
	});
	
	const buttonHandler = (fn: () => void) => {
		showModal = false;
		fn();
	};
</script>

{#if !hideBtn}
<Button on:click={() => showModal = true}>{messageText}</Button>
{/if}

<Modal bind:open={showModal} size="xs" autoclose>
	<div class="text-center">
		<ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">{messageText}</h3>
    <Button color="red" class="me-2" on:click={() => buttonHandler(onConfirm)}>{btnConfirmDesc}</Button>
    <Button color="alternative" on:click={() => buttonHandler(onCancel)}>{btnCancelDesc}</Button>
	</div>
</Modal>
