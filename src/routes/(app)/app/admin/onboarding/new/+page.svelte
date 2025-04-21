<script lang="ts">
	import { Button, Heading } from 'flowbite-svelte';
	import { ArrowLeftOutline } from 'flowbite-svelte-icons';
	import OnboardingForm from './OnboardingForm.svelte';
	
	const { data } = $props();
</script>

<div class="container mx-auto p-4 space-y-6">
	<OnboardingForm data={data.form} />
</div>
