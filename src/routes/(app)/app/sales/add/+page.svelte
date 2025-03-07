<script lang="ts">
	import { browser } from '$app/environment';
  import { enhance } from '$app/forms';
	import Autocomplete from '$lib/components/Autocomplete.svelte';
	import CurrencyInput from '$lib/components/CurrencyInput.svelte';
	import EmployeeAutocomplete from '$lib/components/EmployeeAutocomplete.svelte';
	import { createToast } from '$lib/components/Toast.svelte';
	import dayjs from 'dayjs';
	import { Breadcrumb, BreadcrumbItem, Button, Input, Label, Select } from 'flowbite-svelte';

  const { data } = $props();
  const { campaigns, employees, employeeId } = data;
  let selectedEmployee = $state(null) as { name: string; value: string } | null;  
  let selectedEmployeeId = $derived(selectedEmployee != null ? selectedEmployee.value : '');
  let addMore = $state(false);
</script>

<div class="container max-w-3xl p-4">
  <div class="pb-8">
    <h4>New Sale</h4>
    <p>
      Add a new sale for an employee. Head over to 
      <Button href="/app/sales/import" pill color="light" size="sm">Import Sales</Button>
      if you have numerous sales to import.
    </p>
  </div>
  
  <div class="pb-4">
    <Breadcrumb>
      <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
      <BreadcrumbItem href="/app/sales">Sales</BreadcrumbItem>
      <BreadcrumbItem>New Sale</BreadcrumbItem>
    </Breadcrumb>
  </div>
  
  <form method="post" class="grid grid-cols-2 gap-4"
    use:enhance={({ formElement, formData, action, cancel, submitter }) => {    
      return async ({ result, update }) => {
        if (result.status != 200) return;
        
        createToast({
          title: 'Success!',
          description: 'Sale saved successfully!',
          type: 'success',
        });
        
        if (!employeeId) return;
        
        if (addMore) {
          update();
        } else {
          if (browser) window.history.back();
        }
      }
    }}
  >
    <div class="mb-6">
      <Label class="block mb-2">Employee</Label>
      <input type="hidden" name="employee_id" id="employee_id" value={selectedEmployeeId} >
      <Autocomplete
        items={employees!}
        bind:value={selectedEmployee}
        name="employee"
      />
    </div>
    
    <div class="mb-6">&nbsp;</div>
    
    <div class="mb-6">
      <Label class="block mb-2">Sale Date</Label>
      <Input let:props>
        <input type="date" name="sale_date" id="sale_date" {...props} value={dayjs().format('YYYY-MM-DD')} required />
      </Input>
    </div>
    
    <div class="mb-6">
      <Label class="block mb-2">Campaign</Label>
      <Select name="campaign_id" id="campaign_id" items={campaigns} />
    </div>
    
    <div class="mb-6">
      <Label class="block mb-2">Customer First Name</Label>
      <Input type="text" name="customer_first_name" id="customer_first_name" required />
    </div>
    
    <div class="mb-6">
      <Label class="block mb-2">Customer Last Name</Label>
      <Input type="text" name="customer_last_name" id="customer_last_name" required />
    </div>
    
    <div class="mb-6 col-span-2">
      <Label class="block mb-2">Customer Address</Label>
      <Input type="text" name="customer_address" id="customer_address" required />
    </div>
    
    <div class="mb-6">
      <Label class="block mb-2">Sale Amount</Label>
      <Input let:props>
        <CurrencyInput size={3} showMask
          id="sale_amount" name="sale_amount" type="text"
          {...props}
          required
        />
      </Input>
    </div>
    
    <div class="mb-6">
      <Label class="block mb-2">Status</Label>
      <Select name="status_description" id="status_description" required>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </Select>
    </div>
    
    <div class="flex justify-end col-span-2 gap-2">
      <Button type="button" color="none" on:click={() => window?.history.back()}>Cancel</Button>
      <Button type="submit" color={employeeId ? 'primary' : 'green'} on:click={() => addMore = false}>Save</Button>
      {#if !!employeeId}
        <Button type="submit" color="green" on:click={() => addMore = true}>Save & Add More</Button>
      {/if}
    </div>
  </form>
</div>

<style>
  ::-webkit-calendar-picker-indicator {
    filter: invert(1);
  }
</style>