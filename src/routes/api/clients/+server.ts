import { getUserProfileData, insertUserProfileData } from '$lib/drizzle/mysql/models/users';
import type { userProfile } from '$lib/drizzle/mysql/schema';
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
    await insertUserProfileData(updatedProfile as typeof userProfile.$inferInsert);
  } catch (e) {
    return json({ error: e }, { status: 500 });
  }
  
  return json(updatedProfile);
}