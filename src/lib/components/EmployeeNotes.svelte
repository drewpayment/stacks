<script lang="ts">
	import type { SelectEmployeeNotes } from '$lib/types/db.model';
	import { createLabel, melt, createSeparator } from '@melt-ui/svelte';
  import dayjs from 'dayjs';
	import SubmitButton from './SubmitButton.svelte';
	import { enhance } from '$app/forms';
	import { createToast } from './Toast.svelte';
	import { Card, Textarea, Timeline, TimelineItem, Toolbar, ToolbarButton } from 'flowbite-svelte';
	import { formatDate } from '$lib/utils/utils';
	import { ImageOutline, MapPinAltSolid, PaperClipOutline } from 'flowbite-svelte-icons';
  
  export let employeeId: string;
  export let notes: SelectEmployeeNotes[];

	const {
		elements: { root }
	} = createLabel();

	const {
    elements: { root: horizontal },
  } = createSeparator({
    orientation: 'horizontal',
    decorative: true,
  });
</script>

<form action="?/add-note" method="post"
  use:enhance={({ formElement, formData, action, cancel, submitter }) => {
    formData.append('employee_id', employeeId);
    
    return async ({ result, update }) => {
      console.log(result);
      
      if (!result.data) return;
      
      const newNote = {
        id: '',
        employeeId: result.data.employee_id,
        note: result.data.notes,
        created: Date.now(),
      };
      
      notes = [newNote, ...notes];
      
      update();
      createToast({
        type: 'success',
        title: 'Note added',
        description: 'The note has been added successfully.'
      });
    }
  }}
>
  <p class="text-xl text-gray-500 dark:text-white">Notes</p>
  <Card class="pt-4 px-4 max-h-60 overflow-y-auto w-full max-w-full">
    <Timeline>
      {#each notes as note (note.id)}
        <TimelineItem date={formatDate(note.created, 'MMMM D, YYYY H:m')}>
          <p class="mb-4 text-base text-gray-500 dark:text-gray-400">
            {note.note}
          </p>
        </TimelineItem>
      {/each}
      {#if !notes?.length}
        <TimelineItem date="No notes">
          <p class="mb-4 text-base text-gray-500 dark:text-gray-400">
            There are no notes for this employee. Add one belong to get started.
          </p>
        </TimelineItem>
      {/if}
    </Timeline>
  </Card>
  <Textarea class="mb-4" placeholder="Write a comment" name="notes" id="notes">
    <div slot="footer" class="flex items-center justify-between">
      <SubmitButton text="Add Note" />
      <!-- todo: add support for toolbar buttons -->
      <!-- <Toolbar embedded>
        <ToolbarButton name="Attach file"><PaperClipOutline class="w-6 h-6" /></ToolbarButton>
        <ToolbarButton name="Set location"><MapPinAltSolid class="w-6 h-6" /></ToolbarButton>
        <ToolbarButton name="Upload image"><ImageOutline class="w-6 h-6" /></ToolbarButton>
      </Toolbar> -->
    </div>
  </Textarea>
</form>

<style lang="postcss">
  .item {
    padding: theme('spacing.1');
    border-radius: theme('borderRadius.md');
 
    /* &:hover {
      background-color: theme('colors.primary.100');
    }
 
    &[data-state='on'] {
      background-color: theme('colors.primary.200');
      color: theme('colors.primary.900');
    } */
 
    &:focus {
      @apply ring-2 ring-inherit;
    }
  }
 
  .separator {
    width: 1px;
    background-color: theme('colors.neutral.300');
    align-self: stretch;
  }
</style>