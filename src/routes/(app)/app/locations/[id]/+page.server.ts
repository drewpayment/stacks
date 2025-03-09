import { db } from '$lib/drizzle/postgres/client.js';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { validateFormData } from '../validate.js';
import { location } from '$lib/drizzle/postgres/schema.js';
import { eq } from 'drizzle-orm';


export const load = async ({ params }) => {
  const id = params.id;
  
  if (!id) redirect(301, '/app/locations');
  
  const getLocation = async () => await db.query.location
    .findFirst({
      where: (location, { eq }) => eq(location.id, id),
    });
  
  return {
    location: await getLocation(),
  };
};

export const actions: Actions = {
  update: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { message: 'Unauthorized.' });
    if (!locals.user.profile.clientId) return fail(500, { message: 'Server error.' });
    
    try {
      const formValidation = await validateFormData(await request.formData(), locals.user.profile.clientId);
      if (!formValidation.success || !formValidation.data) 
        return fail(400, formValidation.errors);
      const formData = formValidation.data!;
      
      await db.update(location)
        .set(formData)
        .where(eq(location.id, formData.id));
        
      return formData;
    } catch (error) {
      return fail(500, { message: 'Server error.' });
    }
  }
};