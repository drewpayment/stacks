<script lang="ts">
	import { enhance } from '$app/forms';
	import InlineFormNotice from '$lib/components/InlineFormNotice.svelte';
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	import { createToast } from '$lib/components/Toast.svelte';
	import { getFeedbackObjectByPath } from '$lib/utils/utils';
	import type { SubmitFunction } from '@sveltejs/kit';

	const { form, data } = $props();
	const { token } = data;
	
	let running = $state(false);
	let showPassword = $state(false);
	let passwordsMatch = $state(true);
	let password = $state('');
	let confirmPassword = $state('');

	const submitResetPassword: SubmitFunction = ({ formData }) => {
		// Check if passwords match before submission
		const pass = formData.get('password') as string;
		const confirm = formData.get('confirmPassword') as string;
		
		if (pass !== confirm) {
			passwordsMatch = false;
			return;
		}
		
		passwordsMatch = true;
		running = true;

		return async ({ update }) => {
			running = false;
			await update();
		};
	};

	const togglePasswordVisibility = () => {
		showPassword = !showPassword;
	};
	
	const updatePassword = (e: Event) => {
		password = (e.target as HTMLInputElement).value;
		passwordsMatch = password === confirmPassword || confirmPassword === '';
	};
	
	const updateConfirmPassword = (e: Event) => {
		confirmPassword = (e.target as HTMLInputElement).value;
		passwordsMatch = password === confirmPassword;
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
	<title>Reset Your Password</title>
</svelte:head>

<div class="max-w-md mx-auto mt-8 px-4">
	<div class="text-center mb-6">
		<h1 class="text-3xl font-bold text-gray-800 dark:text-white">Reset your password</h1>
		<p class="mt-2 text-gray-600 dark:text-gray-300">Create a new password for your account</p>
	</div>

	<div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
		<form method="post" action="?/resetPassword" use:enhance={submitResetPassword} class="space-y-6">
			<div class="space-y-4">
				<div>
					<label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Password</label>
					<div class="relative">
						<input 
							type={showPassword ? "text" : "password"}
							id="password" 
							name="password" 
							class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
							placeholder="••••••••" 
							required
							value={password}
							on:input={updatePassword}
						/>
						<button 
							type="button"
							class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 focus:outline-none"
							on:click={togglePasswordVisibility}
						>
							{#if showPassword}
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
									<path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
									<path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
								</svg>
							{:else}
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
									<path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
								</svg>
							{/if}
						</button>
					</div>
					<div class="mt-1">
						<InlineFormNotice feedback={getFeedbackObjectByPath(form?.feedbacks, 'password')} />
					</div>
					<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Password should be at least 8 characters and include a mix of letters, numbers, and symbols.</p>
				</div>
				
				<div>
					<label for="confirmPassword" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
					<div class="relative">
						<input 
							type={showPassword ? "text" : "password"}
							id="confirmPassword" 
							name="confirmPassword" 
							class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
							placeholder="••••••••" 
							required
							value={confirmPassword}
							on:input={updateConfirmPassword}
						/>
						<button 
							type="button"
							class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 focus:outline-none"
							on:click={togglePasswordVisibility}
						>
							{#if showPassword}
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
									<path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
									<path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
								</svg>
							{:else}
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
									<path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
								</svg>
							{/if}
						</button>
					</div>
					{#if !passwordsMatch}
						<p class="mt-1 text-sm text-red-600 dark:text-red-500">Passwords do not match</p>
					{/if}
				</div>
				
				<input type="hidden" name="token" value={token} />
			</div>

			<SubmitButton running={running} text="Reset your password" />
		</form>
	</div>

	<div class="mt-4 text-center">
		<p class="text-sm text-gray-600 dark:text-gray-400">
			Already have an account? <a href="/auth/login" class="font-medium text-blue-600 hover:underline dark:text-blue-500">Login instead</a>
		</p>
	</div>
</div>