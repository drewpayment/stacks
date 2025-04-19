import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './form-schema';
import { fail, type Actions } from "@sveltejs/kit";

export const load = async () => {
  
  return {
    form: await superValidate(zod(formSchema)),
  }
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(formSchema));
    
    if (!form.valid) {
      return fail(400, { form });
    }
    
    console.log(form.data);
    
    return { form };
  },
};