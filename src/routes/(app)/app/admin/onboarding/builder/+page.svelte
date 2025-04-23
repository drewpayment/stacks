<script lang="ts">
	import LeftSidebar from './layout/LeftSidebar.svelte';
	import PropertyPanel from './layout/PropertyPanel.svelte';
	import TopNavbar from './layout/TopNavbar.svelte';
	import WorkflowCanvas from './layout/WorkflowCanvas.svelte';
	import { onboardingStore } from './store';

	// Use Svelte 5 runes for state management
	let { selectedStep } = onboardingStore;
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
	<TopNavbar />

	<div class="flex flex-row">
		<LeftSidebar />
		<WorkflowCanvas />
		<PropertyPanel />
	</div>
</div>
