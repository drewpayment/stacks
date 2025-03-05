<!-- src/lib/components/FilePreview.svelte -->
<script lang="ts">
  interface Props {
    signedUrl: string;
    fileType: string;
  }
  
  let { signedUrl, fileType }: Props = $props();

  let previewContent = $state('');

  // Determine how to render the file based on its type
  $effect(() => {
    if (fileType.startsWith('image/')) {
      previewContent = 'image';
    } else if (fileType === 'application/pdf') {
      previewContent = 'pdf';
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      previewContent = 'word';
    } else {
      previewContent = 'unsupported';
    }
  });
</script>

<div class="w-full h-full">
  {#if previewContent === 'image'}
    <img src={signedUrl} alt="File Preview" class="w-full h-full object-contain" />
  {:else if previewContent === 'pdf'}
    <iframe src={signedUrl} class="w-full h-full border-none" title="File Preview"></iframe>
  {:else if previewContent === 'word'}
    <div class="flex justify-center items-center h-full">
      <p class="text-gray-500">Word documents cannot be previewed directly. <a href={signedUrl} target="_blank" class="text-blue-500">Download</a></p>
    </div>
  {:else}
    <div class="flex justify-center items-center h-full">
      <p class="text-gray-500">File type not supported for preview.</p>
    </div>
  {/if}
</div>