<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { formSchema, type FormSchema } from './form-schema.js';
  import { Button, Input, Card, Heading, P } from 'flowbite-svelte';
  import { UserCircle, Mail, Phone, MapPin, Building, MapPinned } from 'lucide-svelte';
  
  interface Props {
    data: SuperValidated<Infer<FormSchema>>;
  }
  
  const { data }: Props = $props();
  
  const form = superForm(data, {
    validators: zodClient(formSchema),
  });
  
  const { form: formData, enhance } = form;
</script>

<Card class="max-w-4xl mx-auto shadow-lg border-0">
  <div class="mb-6">
    <Heading tag="h2" class="text-2xl font-bold text-primary-700">New Employee Onboarding</Heading>
    <P class="text-gray-600 mt-1">Please fill out all required information below</P>
  </div>

  <form method="POST" class="space-y-8"
    use:enhance={{
      onUpdated(event) {
        console.log(event);
      },
    }}
  >
    <!-- Personal Information Section -->
    <div>
      <p class="text-sm font-medium text-primary-600 uppercase mb-4 flex items-center">
        <UserCircle class="w-4 h-4 mr-2" />
        Personal Information
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form.Field {form} name="firstName">
          <Form.Control let:attrs>
            <Form.Label class="font-medium text-gray-700">First Name</Form.Label>
            <Input {...attrs} bind:value={$formData.firstName} class="mt-1 focus:ring-primary-500 focus:border-primary-500" placeholder="John" />
            <Form.FieldErrors class="text-sm text-red-500 mt-1" />
          </Form.Control>
        </Form.Field>
        
        <Form.Field {form} name="lastName">
          <Form.Control let:attrs>
            <Form.Label class="font-medium text-gray-700">Last Name</Form.Label>
            <Input {...attrs} bind:value={$formData.lastName} class="mt-1 focus:ring-primary-500 focus:border-primary-500" placeholder="Doe" />
            <Form.FieldErrors class="text-sm text-red-500 mt-1" />
          </Form.Control>
        </Form.Field>
      </div>
    </div>
    
    <!-- Contact Information Section -->
    <div>
      <p class="text-sm font-medium text-primary-600 uppercase mb-4 flex items-center">
        <Mail class="w-4 h-4 mr-2" />
        Contact Information
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form.Field {form} name="email">
          <Form.Control let:attrs>
            <Form.Label class="font-medium text-gray-700">Email</Form.Label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail class="h-4 w-4 text-gray-400" />
              </div>
              <Input {...attrs} bind:value={$formData.email} class="pl-10 mt-1 focus:ring-primary-500 focus:border-primary-500" placeholder="john.doe@example.com" />
            </div>
            <Form.FieldErrors class="text-sm text-red-500 mt-1" />
          </Form.Control>
        </Form.Field>
        
        <Form.Field {form} name="phone">
          <Form.Control let:attrs>
            <Form.Label class="font-medium text-gray-700">Phone</Form.Label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone class="h-4 w-4 text-gray-400" />
              </div>
              <Input {...attrs} bind:value={$formData.phone} class="pl-10 mt-1 focus:ring-primary-500 focus:border-primary-500" placeholder="(555) 123-4567" />
            </div>
            <Form.FieldErrors class="text-sm text-red-500 mt-1" />
          </Form.Control>
        </Form.Field>
      </div>
    </div>
    
    <!-- Address Section -->
    <div>
      <p class="text-sm font-medium text-primary-600 uppercase mb-4 flex items-center">
        <MapPin class="w-4 h-4 mr-2" />
        Address
      </p>
      
      <Form.Field {form} name="address">
        <Form.Control let:attrs>
          <Form.Label class="font-medium text-gray-700">Street Address</Form.Label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPinned class="h-4 w-4 text-gray-400" />
            </div>
            <Input {...attrs} bind:value={$formData.address} class="pl-10 mt-1 focus:ring-primary-500 focus:border-primary-500" placeholder="123 Main St" />
          </div>
          <Form.FieldErrors class="text-sm text-red-500 mt-1" />
        </Form.Control>
      </Form.Field>
      
      <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form.Field {form} name="address2">
          <Form.Control let:attrs>
            <Form.Label class="font-medium text-gray-700">Apt / Unit</Form.Label>
            <Input {...attrs} bind:value={$formData.address2} class="mt-1 focus:ring-primary-500 focus:border-primary-500" placeholder="Apt 4B" />
            <Form.FieldErrors class="text-sm text-red-500 mt-1" />
          </Form.Control>
        </Form.Field>
        
        <Form.Field {form} name="city">
          <Form.Control let:attrs>
            <Form.Label class="font-medium text-gray-700">City</Form.Label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building class="h-4 w-4 text-gray-400" />
              </div>
              <Input {...attrs} bind:value={$formData.city} class="pl-10 mt-1 focus:ring-primary-500 focus:border-primary-500" placeholder="San Francisco" />
            </div>
            <Form.FieldErrors class="text-sm text-red-500 mt-1" />
          </Form.Control>
        </Form.Field>
      </div>
      
      <div class="mt-4 grid grid-cols-2 md:grid-cols-3 gap-6">
        <Form.Field {form} name="state" class="col-span-1">
          <Form.Control let:attrs>
            <Form.Label class="font-medium text-gray-700">State</Form.Label>
            <Input {...attrs} bind:value={$formData.state} class="mt-1 focus:ring-primary-500 focus:border-primary-500" placeholder="CA" />
            <Form.FieldErrors class="text-sm text-red-500 mt-1" />
          </Form.Control>
        </Form.Field>
        
        <Form.Field {form} name="zip" class="col-span-1">
          <Form.Control let:attrs>
            <Form.Label class="font-medium text-gray-700">Zip</Form.Label>
            <Input {...attrs} bind:value={$formData.zip} class="mt-1 focus:ring-primary-500 focus:border-primary-500" placeholder="94103" />
            <Form.FieldErrors class="text-sm text-red-500 mt-1" />
          </Form.Control>
        </Form.Field>
      </div>
    </div>
    
    <div class="pt-4 flex justify-end space-x-4 border-t border-gray-200">
      <Button color="light" class="px-6">Cancel</Button>
      <Form.Button type="submit" class="px-6 bg-primary-600 hover:bg-primary-700">Create Employee</Form.Button>
    </div>
  </form>
</Card>