<script lang="ts">
	import { enhance } from '$app/forms';
	import { ArrowLeft } from 'lucide-svelte';
	import {
		Card,
		Button,
		Label,
		Input,
		Badge,
		Tabs,
		TabItem,
		MultiSelect
	} from 'flowbite-svelte';
	import { BuildingSolid } from 'flowbite-svelte-icons';
	
	const { data } = $props();
  const { team } = data;
  
  let currentTeamName = $state(team.name);
  let teamMembers = $state(team.teamMembers.map(tm => tm.value));
	
	let activeTab = $state('overview');
	
	function setActiveTab(tab: string) {
		activeTab = tab;
	}
</script>

<svelte:head>
	<title>Team Information</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-2xl font-bold">Team Information</h1>
	</div>

	<div class="mb-6">
		<a href="/app/teams" class="inline-flex items-center text-gray-600 hover:text-gray-900">
			<ArrowLeft class="w-4 h-4 mr-2" />
			<span>All Teams</span>
		</a>
	</div>

	<form action="?/update" method="post" class="max-w-3xl" use:enhance={() => {
		return ({ result }) => {
			console.log(result);	
		}
	}}>
		<div>
			<Tabs style="underline">
				<TabItem open onclick={() => setActiveTab('overview')}>
					<div slot="title" class="flex items-center gap-2">
						<BuildingSolid size="md" />
						Overview
					</div>
					<div class="space-y-8">
						<div class="pt-4">
							<h3 class="text-lg font-medium mb-4">{currentTeamName ?? 'Team'} Overview</h3>
						</div>

						<!-- Team Name -->
						<div class="grid grid-cols-3 gap-4 items-center">
							<Label for="name" class="font-medium">Team name*</Label>
							<div class="col-span-2">
								<Input id="name" name="name" type="text" placeholder="Team name" value={team?.name} />
							</div>
						</div>
						
            <!-- General Manager -->
						<div class="grid grid-cols-3 gap-4 items-center">
							<Label for="general_manager" class="font-medium">General Manager</Label>
							<div class="col-span-2">
								<Input id="general_manager" name="general_manager" type="text" placeholder="Mr. GM" value={team?.generalManager} />
							</div>
						</div>
            
            <!-- Regional Manager -->
            <div class="grid grid-cols-3 gap-4 items-center">
              <Label for="regional_manager" class="font-medium">Regional Manager</Label>
              <div class="col-span-2">
                <Input id="regional_manager" name="regional_manager" type="text" placeholder="Mr. RM" value={team?.regionalManager} />
              </div>
            </div>
            
            <div class="grid grid-cols-3 gap-4 items-center">
              <Label for="team_members" class="font-medium">Team Members</Label>
              <div class="col-span-2">
                <MultiSelect id="team_members" name="team_members" items={team.teamMembers} bind:value={teamMembers}  />
              </div>
            </div>
            
            <!-- State -->
            <!-- <div class="grid grid-cols-3 gap-4 items-center">
              <Label for="state" class="font-medium">State</Label>
              <div class="col-span-2">
                <Input id="state" name="state" type="text" placeholder="WA" value={team?.state} />
              </div>
            </div> -->
            
            <!-- Postal Code -->
            <!-- <div class="grid grid-cols-3 gap-4 items-center">
              <Label for="zip" class="font-medium">Zip</Label>
              <div class="col-span-2">
                <Input id="zip" name="zip" type="text" placeholder="97865" value={team?.zip} />
              </div>
            </div> -->
            
            <!-- Country -->
            <!-- <div class="grid grid-cols-3 gap-4 items-center">
              <Label for="country" class="font-medium">Country</Label>
              <div class="col-span-2">
                <Input id="country" name="country" type="text" placeholder="US" value={team?.country} />
              </div>
            </div> -->
					</div>
				</TabItem>
			</Tabs>
		</div>
		
		<div class="mt-8">
			<input type="hidden" name="id" bind:value={team!.id} />
			<Button type="submit">Save changes</Button>
		</div>
	</form>

	<!-- Existing clients list - hidden by default, could be toggled -->
	<div class="hidden mt-12">
		<h2 class="text-2xl font-semibold text-gray-900 mb-4">Clients</h2>
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each data?.clients || [] as client}
				<Card>
					<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
						{client?.name}
					</h5>
					{#if client?.contactUserId}
						<Badge color="blue" class="mt-2">
							Contact User ID: {client?.contactUserId}
						</Badge>
					{/if}
					<Button href={`/clients/${client.id}`}>View Details</Button>
				</Card>
			{/each}
		</div>
	</div>
</div>