<script lang="ts">
	import { Button, Label, Input, Heading } from 'flowbite-svelte';
	import { ArrowLeftOutline } from 'flowbite-svelte-icons';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	let firstName = '';
	let lastName = '';
	let email = '';

	const submit: SubmitFunction = () => {
		return async ({ result }) => {
			if (result.type === 'success') {
				firstName = '';
				lastName = '';
				email = '';
			}
		};
	};
</script>

<div class="container mx-auto p-4 space-y-6">
	<Heading tag="h3" class="mb-4">New Employee Onboarding</Heading>

	<div class="flex justify-start mb-4">
		<Button href="/app/admin/onboarding">
			<ArrowLeftOutline class="w-3 h-3 me-2" />
			Back
		</Button>
	</div>

	<form method="POST" use:enhance={submit} class="space-y-6">
		<div>
			<Label for="firstName" class="mb-2">First Name</Label>
			<Input type="text" id="firstName" name="firstName" bind:value={firstName} required />
		</div>
		<div>
			<Label for="lastName" class="mb-2">Last Name</Label>
			<Input type="text" id="lastName" name="lastName" bind:value={lastName} required />
		</div>
		<div>
			<Label for="email" class="mb-2">Email</Label>
			<Input type="email" id="email" name="email" bind:value={email} required />
		</div>
		<Button type="submit">Create Employee</Button>
	</form>
</div>
