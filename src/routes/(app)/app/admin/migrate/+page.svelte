<script lang="ts">
	import { enhance } from '$app/forms';
	import { Breadcrumb, BreadcrumbItem, Button } from 'flowbite-svelte';

  
</script>

<div class="px-4 mx-auto container">
  <div class="pb-4">
		<Breadcrumb aria-label="Breadcrumb">
			<BreadcrumbItem href="/" home>Home</BreadcrumbItem>
			<BreadcrumbItem>Admin</BreadcrumbItem>
      <BreadcrumbItem>Migrate</BreadcrumbItem>
		</Breadcrumb>
	</div>
  
  <div class="grid grid-cols-1">
    <h4>ADMIN MIGRATE</h4>
  </div>
  
  <form class="grid grid-cols-4" method="post" action="?/migrateEmployees" use:enhance={() => {
    return ({result}) => {
      console.log(result);
    };
  }}>
    <Button type="submit">
      Migrate Employees
    </Button>
  </form>
</div>