<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { formSchema, type FormSchema } from './form-schema.js';
	import { Input } from 'flowbite-svelte';
  
  interface Props {
		data: SuperValidated<Infer<FormSchema>>;
	}
  
  const { data }: Props = $props();
  
  const form = superForm(data, {
    validators: zodClient(formSchema),
  });
  
  const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance class="space-y-6">
  <Form.Field {form} name="firstName">
    <Form.Control let:attrs>
      <Form.Label>First Name</Form.Label>
      <Input {...attrs} bind:value={$formData.firstName} />
    </Form.Control>
  </Form.Field>
  
  <Form.Field {form} name="lastName">
    <Form.Control let:attrs>
      <Form.Label>Last Name</Form.Label>
      <Input {...attrs} bind:value={$formData.lastName} />
    </Form.Control>
  </Form.Field>
  
  <Form.Field {form} name="address">
    <Form.Control let:attrs>
      <Form.Label>Address</Form.Label>
      <Input {...attrs} bind:value={$formData.address} />
    </Form.Control>
  </Form.Field>
  
  <Form.Field {form} name="address2">
    <Form.Control let:attrs>
      <Form.Label>Apt / Unit</Form.Label>
      <Input {...attrs} bind:value={$formData.address2} />
    </Form.Control>
  </Form.Field>
  
  <Form.Field {form} name="city">
    <Form.Control let:attrs>
      <Form.Label>City</Form.Label>
      <Input {...attrs} bind:value={$formData.city} />
    </Form.Control>
  </Form.Field>
  
  <Form.Field {form} name="state">
    <Form.Control let:attrs>
      <Form.Label>State</Form.Label>
      <Input {...attrs} bind:value={$formData.state} />
    </Form.Control>
  </Form.Field>
  
  <Form.Field {form} name="zip">
    <Form.Control let:attrs>
      <Form.Label>Zip</Form.Label>
      <Input {...attrs} bind:value={$formData.zip} />
    </Form.Control>
  </Form.Field>
  
  <Form.Field {form} name="phone">
    <Form.Control let:attrs>
      <Form.Label>Phone</Form.Label>
      <Input {...attrs} bind:value={$formData.phone} />
    </Form.Control>
  </Form.Field>
  
  <!-- <div>
    <Label for="firstName" class="mb-2">First Name</Label>
    <Input type="text" id="firstName" name="firstName" bind:value={newForm.firstName} required />
  </div>
  <div>
    <Label for="lastName" class="mb-2">Last Name</Label>
    <Input type="text" id="lastName" name="lastName" bind:value={newForm.lastName} required />
  </div>
  <div>
    <Label for="email" class="mb-2">Email</Label>
    <Input type="email" id="email" name="email" bind:value={newForm.email} required />
  </div>
  <div>
    <Label for="address" class="mb-2">Address</Label>
    <Input type="text" id="address" name="address" bind:value={newForm.address}></Input>
  </div> -->
  <!-- <Button type="submit">Create Employee</Button> -->
   
  <Form.Button>Create Employee</Form.Button>
</form>