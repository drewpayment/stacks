import type { SelectPaystub } from '$lib/drizzle/postgres/db.model';
import { detachPayrollCycleFromPaystub } from '$lib/drizzle/postgres/models/paystubs';
import { getUserProfileData } from '$lib/drizzle/postgres/models/users';


/**
 * Used to detach a payroll cycle from a paystub.
**/
export async function POST({ request, locals }) {
  const paystub = await request.json() as SelectPaystub;
  
  if (!locals.session) return new Response('Unauthorized', { status: 401 });
  
  const profile = await getUserProfileData(locals.user.id);
  
  if (!profile || profile.clientId != paystub.clientId) 
    return new Response('Unauthorized', { status: 401 });
  
  try {
    const result = await detachPayrollCycleFromPaystub(paystub.id);
    
    console.log(`Detached payroll cycle from paystub: ${result}`)
  } catch (ex) {
    console.error(ex);
    return new Response('Error detaching payroll cycle from paystub', {
      status: 500,
    });
  }
  
  return new Response(null, {
    status: 200,
    statusText: 'OK',
  });
}