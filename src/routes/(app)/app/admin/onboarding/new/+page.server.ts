import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './form-schema';
import { fail, type Actions } from "@sveltejs/kit";
import type { InsertEmployee, InsertEmployeeProfile } from '$lib/drizzle/postgres/db.model';
import { nanoid } from 'nanoid';
import { createEmployee } from '$lib/drizzle/postgres/models/employees';

export const load = async () => {
  
  return {
    form: await superValidate(zod(formSchema)),
  }
};

export const actions: Actions = {
  default: async (event) => {
    const user = event.locals.user;
    
    if (!user) return fail(401, {
      message: 'Unauthorized',
    });
    
    if (user.profile.role !== 'admin' && user.profile.role !== 'org_admin' &&
      user.profile.role !== 'super_admin') 
      return fail(403, {
        message: 'Forbidden',
      });
    
    const form = await superValidate(event, zod(formSchema));
    
    if (!form.valid) {
      return fail(400, { form });
    }
    
    const insertEmployee = {
      id: nanoid(),
      clientId: user.profile.clientId,
      firstName: form.data.firstName,
      lastName: form.data.lastName,
      status: 'onboarding',
      isCommissionable: true,
    } as InsertEmployee;
    
    const insertEmployeeProfile = {
      id: nanoid(),
      employeeId: insertEmployee.id,
      address: form.data.address,
      address2: form.data.address2,
      city: form.data.city,
      state: form.data.state,
      zip: form.data.zip,
      phone: form.data.phone,
      email: form.data.email,
    } as InsertEmployeeProfile;
    
    const result = await createEmployee(insertEmployee, insertEmployeeProfile);
    
    if (!result.success) {
      return fail(500, { message: 'Error creating employee', });
    }
    
    return {
      ...insertEmployee,
      profile: insertEmployeeProfile,
    };
  },
};