<script lang="ts">
	import { enhance } from '$app/forms';
	import InlineFormNotice from '$lib/components/InlineFormNotice.svelte';
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	import { createToast } from '$lib/components/Toast.svelte';
	import { getFeedbackObjectByPath } from '$lib/utils/utils';
	import type { SubmitFunction } from './$types';

	export let form;
	let running = false;

	const submitSignupUser: SubmitFunction = () => {
		running = true;

		return async ({ update }) => {
			running = false;
			await update();
		};
	};

	$: {
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
	}
</script>

<svelte:head>
	<title>Get Started</title>
</svelte:head>

<div class="container max-w-xl">
	<div class="text-center mb-4">
		<h1 class="text-3xl font-bold">Get Started</h1>
		<p class="text-gray-600">Enter your email to get started</p>
	</div>
	
	<div class="p-8 border bg-gray-300 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-xl shadow-sm">
		<form method="post" action="?/signupUser" use:enhance={submitSignupUser}>
			<div class="mb-4">
				<label for="email" class="mb-0.5 text-text-900">Email</label>
				<input
					type="email"
					name="email"
					placeholder="Your email address"
					required
					class="h-10 w-[100%] rounded-md px-3 py-2 text-neutral-700 dark:bg-gray-400 dark:text-neutral-50"
				/>
				<InlineFormNotice feedback={getFeedbackObjectByPath(form?.feedbacks, 'email')} />
			</div>
	
			<SubmitButton {running} text="Continue" />
		</form>
		
		<div class="flex flex-col mt-6 space-y-4 social-logins">
			<div class="text-center">
				<p class="text-sm text-gray-600">
					Already have an account? <a href="/auth/login" class="font-medium text-blue-600 underline"
						>Login instead</a
					>
				</p>
			</div>		
		</div>
	</div>
</div>

