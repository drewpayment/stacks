
import { db } from '$lib/drizzle/postgres/client';
import type { InsertTeam, SelectTeam } from '$lib/drizzle/postgres/db.model';
import { getEmployees } from '$lib/drizzle/postgres/models/employees';
import { team } from '$lib/drizzle/postgres/schema';
import type { TeamManager } from '$lib/drizzle/types/team.model.js';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { nanoid } from 'nanoid';


export const load = async ({ locals }) => {
  const clientId = locals.user.profile.clientId;
  
  if (!clientId) return redirect(305, '/');
  
  const getTeams = async () => db.query.team
    .findMany({
      where: (team, { isNull, eq, and }) => and(
        isNull(team.deleted),
        eq(team.clientId, clientId),
      ),
    });
  
  return {
    teams: await getTeams(),
    employees: await getEmployees(clientId),
  }
};

export const actions: Actions = {
  add: async ({ request, locals }) => {
    if (!locals.user || !locals.user.profile.clientId) return fail(401, { message: 'Unauthenticated' });
    const clientId = locals.user.profile.clientId;
    
    const form = await request.formData();
    const { name, team_members, general_manager, regional_manager, is_broker } = Object.fromEntries(form.entries());
    const teamMembers = (team_members as string).split(',');
    const isBroker = is_broker === 'on';
    
    // get general_manager 
    const generalManager = {
      positionDescription: 'general_manager',
      employeeId: general_manager as string,
    } as TeamManager;
    
    const regionalManager = {
      positionDescription: 'regional_manager',
      employeeId: regional_manager as string,
    } as TeamManager;
    
    const data = {
      id: nanoid(),
      name,
      clientId,
      isBroker,
      generalManager,
      regionalManager,
      teamMemberEmployeeIds: teamMembers,
    } as InsertTeam;
    
    try {
      await db.insert(team)
        .values(data);
    } catch (error) {
      console.error(error);
      return fail(500, { message: 'failed to create team' });
    }
    
    return data;
  },
};