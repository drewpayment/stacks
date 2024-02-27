<script lang="ts">
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';

  
  export let data;
  
  console.dir(data.paystubs);
</script>

<div class="container max-w-5xl">
  <div class="flex">
    <div>
      <h4 class="mb-2">My Pay</h4>
      <p class="mb-4">
        View my pay information.
      </p>
    </div>
  </div>
  
  <div class="pb-4">
    <Breadcrumb>
      <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
      <BreadcrumbItem>My Paystubs</BreadcrumbItem>
    </Breadcrumb>
  </div>
  
  {JSON.stringify(data.paystubs)}
</div>