import { z } from 'zod';

export const formSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  address: z.string().min(1),
  address2: z.string().nullable(),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().min(1),
  phone: z.string().min(1),
  phone2: z.string().nullable(),
  email: z.string().email().nonempty(),
});

export type FormSchema = typeof formSchema;