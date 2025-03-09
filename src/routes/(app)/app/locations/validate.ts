import { z } from 'zod';
import { nanoid } from 'nanoid';

// Define the validation schema
const AddressFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string()
    .regex(/^\d{5}(-\d{4})?$/, "ZIP code must be in format 12345 or 12345-6789"),
  country: z.string(),
});

// Type inference from the schema
type AddressForm = z.infer<typeof AddressFormSchema>;

// Function to validate form data
export async function validateFormData(form: FormData, clientId: string) {
  try {
    const id = form.get('id') as string ?? nanoid();
    
    // Parse and validate the form data
    const validatedData = AddressFormSchema.parse({
      name: form.get('name'),
      address: form.get('address'),
      city: form.get('city'),
      state: form.get('state'),
      zip: form.get('zip'),
      country: form.get('country'),
    });
    
    // Return the validated DTO with additional fields
    return {
      success: true,
      data: {
        id,
        clientId,
        ...validatedData
      }
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Format the Zod validation errors
      const formattedErrors = error.errors.reduce((acc, curr) => {
        const field = curr.path[0];
        acc[field] = curr.message;
        return acc;
      }, {} as Record<string, string>);
      
      return {
        success: false,
        errors: formattedErrors
      };
    }
    
    // Handle unexpected errors
    return {
      success: false,
      errors: { _form: 'Something went wrong. Please try again.' }
    };
  }
}