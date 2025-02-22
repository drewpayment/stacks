<script lang="ts">
  import { db, type Documents } from '$lib/client/instantdb';
  import { Button, Card, Spinner } from 'flowbite-svelte';
  import { FolderSolid, ListSolid, GridSolid, FileSolid } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';

  let viewMode: 'list' | 'grid' = $state('list');
  let selectedPath = 'All Files';
  let documents = $state<Documents[]>([]);
  let loading = $state(true);
  
  onMount(() => {
    if (!db) return;
    db.subscribeQuery({ documents: {} }, (resp) => {
      if (!resp.data) return;
      documents = resp.data.documents;
      loading = false;
    });
  })
  
  let activeDocuments = $derived(documents.filter(d => d.status == 'active'));

  function formatFileSize(bytes: number) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function formatDate(date: string | number) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function handleUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    uploadFile(file);
  }

  async function uploadFile(file: File) {
    try {
      console.log(file)
      // Create initial document record
      const formData = new FormData();
      
      formData.set('file', file);
      formData.set('documentType', file.type);
      
      // send to API route: /api/upload
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

    } catch (error) {
      console.error('Upload failed:', error);
      // TODO: Add error toast notification
    }
  }
</script>

<div class="flex h-screen bg-white dark:bg-gray-800">
  <!-- Left Sidebar -->
  <div class="w-56 border-r border-gray-200 dark:border-gray-700 p-4">
    <div class="space-y-4">
      <Button class="w-full justify-start gap-2" color="light">
        <FolderSolid class="h-4 w-4" />
        <span>All Files</span>
      </Button>

      <Button color="blue" class="w-full">
        <label class="w-full cursor-pointer flex items-center justify-center">
          <input
            type="file"
            class="hidden"
            on:change={handleUpload}
            accept="application/pdf,image/*"
          />
          Upload File
        </label>
      </Button>
    </div>
  </div>

  <!-- Main Content -->
  <div class="flex-1 p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-2">
        <FolderSolid class="h-5 w-5 text-blue-500" />
        <h1 class="text-xl font-semibold dark:text-white">{selectedPath}</h1>
      </div>
      
      <div class="flex items-center space-x-4">
        <Button
          size="sm"
          color={viewMode === 'list' ? 'blue' : 'light'}
          on:click={() => viewMode = 'list'}
        >
          <ListSolid class="h-5 w-5" />
        </Button>
        <Button
          size="sm"
          color={viewMode === 'grid' ? 'blue' : 'light'}
          on:click={() => viewMode = 'grid'}
        >
          <GridSolid class="h-5 w-5" />
        </Button>
      </div>
    </div>

    {#if loading}
      <div class="flex justify-center items-center h-64">
        <Spinner size="8" />
      </div>
    {:else}
      <!-- File Grid/List -->
      <div class={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'}>
        {#each activeDocuments as doc (doc.id)}
          <Card padding="sm" class="hover:bg-gray-50 dark:hover:bg-gray-700">
            <div class={viewMode === 'grid' 
              ? 'flex flex-col items-center text-center space-y-2'
              : 'flex items-center justify-between p-2'
            }>
              <div class="flex items-center space-x-3">
                <FileSolid class="h-10 w-10 text-blue-500" />
                <div class="flex flex-col">
                  <h3 class="font-medium dark:text-white text-sm">{doc.filename}</h3>
                  <div class="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{formatFileSize(doc.fileSize)}</span>
                    <span>•</span>
                    <span>{formatDate(doc.uploadDate)}</span>
                  </div>
                </div>
              </div>
              
              <div class="flex items-center space-x-2">
                <span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {doc.documentType}
                </span>
              </div>
            </div>
          </Card>
        {/each}

        {#if activeDocuments.length === 0}
          <div class="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
            No documents found. Upload a file to get started.
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>
