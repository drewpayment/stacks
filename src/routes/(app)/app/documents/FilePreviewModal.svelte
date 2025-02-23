<script lang="ts">
	import { type Documents } from '$lib/client/instantdb';
	import FilePreview from '$lib/components/FilePreview.svelte';
  import { Modal } from 'flowbite-svelte';
  
  interface Props {
    document: Documents;
    isPreviewOpen: boolean;
  }

  let { document, isPreviewOpen = $bindable() }: Props = $props();
  let previewUrl = $state<string>('');
  let fileType = $state<string>('');

  async function openPreview(doc: Documents) {
    const resp = await fetch(`/api/upload/preview?filepath=${doc.filePath}`);
    if (!resp.ok) {
      console.error('Failed to preview document: ', resp.statusText);
      return;
    }
    
    const { url, fileType: previewFileType, } = (await resp.json());
    previewUrl = url;
    fileType = previewFileType;
    isPreviewOpen = true;
  }
  
  $effect(() => {
    if (document) openPreview(document);
  });

  function closePreview() {
    isPreviewOpen = false;
  }
</script>

<Modal bind:open={isPreviewOpen} size={'xl'} onclose={closePreview}>
  <div class="w-full h-[80vh] p-3">
    {#if previewUrl}
      <FilePreview signedUrl={previewUrl} {fileType} />
    {/if}
  </div>
</Modal>