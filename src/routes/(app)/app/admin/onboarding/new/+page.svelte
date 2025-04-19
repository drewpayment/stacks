<script lang="ts">
	import { Button, Heading } from 'flowbite-svelte';
	import { ArrowLeftOutline } from 'flowbite-svelte-icons';
	import OnboardingForm from './OnboardingForm.svelte';
	
	const { data } = $props();
</script>

<div class="container mx-auto p-4 space-y-6">
	<Heading tag="h3" class="mb-4">New Employee Onboarding</Heading>

	<div class="flex justify-start mb-4">
		<Button href="/app/admin/onboarding">
			<ArrowLeftOutline class="w-3 h-3 me-2" />
			Back
		</Button>
	</div>

	<OnboardingForm data={data.form} />
</div>
