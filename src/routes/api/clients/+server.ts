import { getUserProfileData, updateSelectedClient, updateUserProfileData } from '$lib/drizzle/postgres/models/users';
import type { userProfile } from '$lib/drizzle/postgres/schema';
import { fail, json } from '@sveltejs/kit';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
	// do something
  const { id: clientId } = await request.json() as { id: string };
  
  if (!locals.user) fail(401, { message: 'Unauthorized' });
	const profile = await getUserProfileData(locals.user?.id);
  
  if (!profile) return json({ error: 'No profile found' }, { status: 400 });
  
  const updatedProfile = {...profile, clientId };
  
  try {
    await updateSelectedClient(updatedProfile.userId, clientId);
  } catch (e) {
    return json({ error: e }, { status: 500 });
  }
  
  return json(updatedProfile);
}