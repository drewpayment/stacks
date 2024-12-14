<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { SelectCampaign } from '$lib/drizzle/postgres/db.model';
  import { createDropdownMenu, melt } from '@melt-ui/svelte';
	import { fly } from 'svelte/transition';
  
  const {
		elements: { menu, item, trigger, arrow },
		states: { open }
	} = createDropdownMenu();
  
  export let campaign: SelectCampaign;
  
  let disableCampaignBtn: HTMLButtonElement;
</script>

<button type="button" class="trigger" use:melt={$trigger}>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="w-6 h-6"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
    />
  </svg>
</button>
{#if $open}
  <div
    use:melt={$menu}
    class="menu cursor-pointer"
    transition:fly={{ duration: 150, y: -10 }}
  >
    <form action="?/disable" method="post" use:enhance>
      <div
        use:melt={$item}
        class="item"
        on:m-pointerdown={(e) => {
          e.preventDefault();
          goto(`/app/campaigns/${campaign.id}`);
        }}
      >
        Edit
      </div>
      <div
        class="item"
        use:melt={$item}
        on:m-pointerdown={(e) => {
          e.preventDefault();
          console.log(e);

          if (disableCampaignBtn) disableCampaignBtn.click();
        }}
      >
        {campaign.active ? 'Disable' : 'Enable'}
        <input type="hidden" name="campaign_id" value={campaign.id} required />
        <button type="submit" class="hidden" bind:this={disableCampaignBtn}
          >{campaign.active ? 'Disable' : 'Enable'}</button
        >
      </div>
    </form>
  </div>
{/if}

<style lang="postcss">
	.menu {
		@apply z-10 flex max-h-[300px] min-w-[220px] flex-col shadow-lg;
		@apply rounded-md bg-white p-1 shadow-neutral-900/30 lg:max-h-none dark:bg-neutral-800;
		@apply ring-0 !important;
	}
	.subMenu {
		@apply min-w-[220px] shadow-md shadow-neutral-900/30;
	}
	.item {
		@apply relative h-6 min-h-[24px] select-none rounded-sm pl-6 pr-1;
		@apply z-20 text-neutral-900 outline-none dark:text-neutral-50;
		@apply data-[highlighted]:bg-neutral-200 data-[highlighted]:text-neutral-900 dark:data-[highlighted]:bg-neutral-800 dark:data-[highlighted]:text-neutral-50;
		@apply data-[disabled]:text-neutral-300 dark:data-[disabled]:text-neutral-600;
		@apply flex items-center text-sm leading-none;
		@apply ring-0 !important;
	}
	.trigger {
		@apply inline-flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-neutral-800;
		@apply text-neutral-900 transition-colors hover:bg-white/90 dark:text-neutral-200 dark:hover:bg-neutral-700;
		@apply data-[highlighted]:ring-neutral-400 data-[highlighted]:ring-offset-2 dark:data-[highlighted]:ring-neutral-600 !important;
		@apply p-0 text-sm font-medium  data-[highlighted]:outline-none;
	}
	.check {
		@apply absolute left-2 top-1/2 text-neutral-500;
		translate: 0 calc(-50% + 1px);
	}

	.dot {
		@apply h-[4.75px] w-[4.75px] rounded-full bg-neutral-900;
	}

	.separator {
		@apply m-[5px] h-[1px] bg-neutral-200;
	}

	.rightSlot {
		@apply ml-auto pl-5;
	}

	.icon {
		@apply h-[13px] w-[13px];
	}
	.check {
		@apply absolute left-0 inline-flex w-6 items-center justify-center;
	}
	.text {
		@apply pl-6 text-xs leading-6 text-neutral-600;
	}
</style>
