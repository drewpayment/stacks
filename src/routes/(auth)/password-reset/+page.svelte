<script lang="ts">
	import { enhance } from '$app/forms';
	import InlineFormNotice from '$lib/components/InlineFormNotice.svelte';
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	import { createToast } from '$lib/components/Toast.svelte';
	import { getFeedbackObjectByPath } from '$lib/utils/utils';
	import type { SubmitFunction } from '@sveltejs/kit';

	const { data, form } = $props();
	
	let running = $state(false);
	
	const submitSendResetPasswordLink: SubmitFunction = () => {
		running = true;

		return async ({ update }) => {
			running = false;
			await update();
		};
	};

	$effect(() => {
		if (form?.feedbacks && form.feedbacks.length > 0) {
			form.feedbacks.forEach((feedback) => {
				if (!feedback.path) {
					createToast({
						type: feedback.type,
						title: feedback.title,
						description: feedback.message
					});
				}
			});
		}
	});
</script>

<svelte:head>
	<title>Reset Password</title>
</svelte:head>

<div class="max-w-md mx-auto mt-8 px-4">
	<div class="text-center mb-6">
		<h1 class="text-3xl font-bold text-gray-800 dark:text-white">Get a reset link</h1>
		<p class="mt-2 text-gray-600 dark:text-gray-300">We'll send you an email with a link to reset your password</p>
	</div>

	<div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
		<form method="post" action="?/sendPasswordResetLink" use:enhance={submitSendResetPasswordLink} class="space-y-6">
			<div>
				<label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
				<div class="relative">
					<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
						<svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
							<path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z"/>
							<path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z"/>
						</svg>
					</div>
					<input 
						type="email" 
						id="email" 
						name="email" 
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
						placeholder="name@example.com" 
						required
					/>
				</div>
				<InlineFormNotice feedback={getFeedbackObjectByPath(form?.feedbacks, 'email')} />
			</div>

			<SubmitButton running={running} text="Email password reset link" />
		</form>
	</div>

	{#if !data.user}
		<div class="mt-4 text-center">
			<p class="text-sm text-gray-600 dark:text-gray-400">
				Already have an account? <a href="/auth/login" class="font-medium text-blue-600 hover:underline dark:text-blue-500">Login instead</a>
			</p>
		</div>
	{/if}
</div>