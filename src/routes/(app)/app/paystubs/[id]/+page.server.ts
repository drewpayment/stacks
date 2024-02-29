import { getCampaigns } from '$lib/drizzle/mysql/models/campaigns';
import { getEmployeeByUserId } from '$lib/drizzle/mysql/models/employees';
import { getPaystubById } from '$lib/drizzle/mysql/models/paystubs.js';
import { getUserProfileData } from '$lib/drizzle/mysql/models/users';
import type { SelectPaystub, SelectUserProfile } from '$lib/types/db.model.js';
import { error } from '@sveltejs/kit';
import type { Session } from 'lucia';

const canLoad = async (session: Session, profile: SelectUserProfile, payroll: SelectPaystub): Promise<boolean> => {
  if (!['super_admin', 'org_admin'].includes(profile.role)) {
    const ee = await getEmployeeByUserId(session?.user.userId);
    
    if (payroll?.employeeId !== ee?.id) {
      return false;
    }
  }
  
  return true;
}

export const load = async ({ locals, params }) => {
  const session = await locals.auth.validate();
  if (!session) error(401, 'Unauthorized');
  
  const profile = await getUserProfileData(session?.user.userId);
  const payrollId = params.id;
  const payroll = await getPaystubById(profile?.clientId as string, payrollId);
  
  if (await canLoad(session, profile, payroll)) {
    return {
      paystub: payroll,
      campaigns: await getCampaigns(profile?.clientId as string),
    };
  }
  
  error(403, 'Forbidden');
};

