import { db } from '$lib/drizzle/postgres/client.js';
import { getEmployees } from '$lib/drizzle/postgres/models/employees.js';
import type { Team } from '$lib/drizzle/types/team.model.js';
import { redirect, type Actions } from '@sveltejs/kit';


export const load = async ({ params, locals }) => {
  const id = params.id;
  const clientId = locals.user.profile.clientId;
  
  if (!id) redirect(301, '/app/teams');
  if (!clientId) redirect(305, '/');
  
  const getTeam = async () => {
    return await db.transaction(async (tx) => {
      const t = await tx.query.team
        .findFirst({
          where: (team, { eq }) => eq(team.id, id),
        });
        
      if (!t) return {} as Team;
      
      const gm = t.generalManager ? await tx.query.employee.findFirst({
        where: (employee, { eq }) => eq(employee.id, t.generalManager?.employeeId as string),
      }) : null;
      
      const rm = t.regionalManager ? await tx.query.employee.findFirst({
        where: (employee, { eq }) => eq(employee.id, t.regionalManager?.employeeId as string),
      }) : null;
      
      const tms = t.teamMemberEmployeeIds?.length 
        ? (await tx.query.employee.findMany({
            where: (ee, { inArray }) => inArray(ee.id, t.teamMemberEmployeeIds as string[]),
          }))?.map(tm => ({ name: `${tm.firstName} ${tm.lastName}`, value: tm.id }))
        : [];
      
      return {
        ...t,
        generalManager: gm,
        regionalManager: rm,
        teamMembers: tms,
      } as Team;
    })
  }
  
  return {
    team: await getTeam(),
    employees: await getEmployees(clientId),
  };
};

export const actions: Actions = {
  // update: async ({ request, locals }) => {
  //   if (!locals.user) return fail(401, { message: 'Unauthorized.' });
  //   if (!locals.user.profile.clientId) return fail(500, { message: 'Server error.' });
    
  //   try {
  //     const formValidation = await validateFormData(await request.formData(), locals.user.profile.clientId);
  //     if (!formValidation.success || !formValidation.data) 
  //       return fail(400, formValidation.errors);
  //     const formData = formValidation.data!;
      
  //     await db.update(location)
  //       .set(formData)
  //       .where(eq(location.id, formData.id));
        
  //     return formData;
  //   } catch (error) {
  //     return fail(500, { message: 'Server error.' });
  //   }
  // }
};