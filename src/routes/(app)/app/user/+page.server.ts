import { createUser, getUserProfileData, getUsers, updateUserAndProfile } from '$lib/drizzle/mysql/models/users';
import type { InsertUser, InsertUserKey, InsertUserProfile, RoleTypes, User } from '$lib/types/db.model';
import { fail } from '@sveltejs/kit';
import { nanoid } from 'nanoid';


export const load = async ({locals}) => {
  if (!locals.user) fail(401, { message: 'Unauthorized' });
  
  const users = async (): Promise<User[]> => {
    const profile = await getUserProfileData(locals.user?.id);
    
    if (!profile) {
      return [];
    }
    
    const users = await getUsers(profile?.clientId as string);
    
    return users;
  }
  
  return {
    users: await users(),
  };
}

export const actions = {
  add: async ({ locals, request }) => {
    if (!locals.user) fail(401, { message: 'Unauthorized' });
    
    const payload = await request.formData();
    const data = Object.fromEntries(payload.entries()) as { 
      first_name: string;
      last_name: string;
      email: string;
      role: string;
      client_id: string;
    };
    
    const insertUser: InsertUser = {
      id: nanoid(),
      email: data.email,
      emailVerified: false,
    };
    
    const insertUserKey: InsertUserKey = {
      id: `email:${data.email}`,
      userId: insertUser.id,
    }
    
    const insertUserProfile: InsertUserProfile = {
      id: nanoid(),
      userId: insertUser.id,
      firstName: data.first_name,
      lastName: data.last_name,
      clientId: data.client_id,
      role: data.role as RoleTypes,
    };
    
    return await createUser(insertUser, insertUserKey, insertUserProfile);
  },
  update: async ({ locals, request }) => {
    if (!locals.user) fail(401, { message: 'Unauthorized' });
    
    const payload = await request.formData();
    const data = Object.fromEntries(payload.entries()) as { 
      user_id: string;
      user_profile_id: string;
      first_name: string;
      last_name: string;
      email: string;
      role: string;
      client_id: string;
    };
    
    const insertUser: InsertUser = {
      id: data.user_id,
      email: data.email,
      emailVerified: false,
    };
    
    const insertUserProfile: InsertUserProfile = {
      id: data.user_profile_id,
      userId: data.user_id,
      firstName: data.first_name,
      lastName: data.last_name,
      clientId: data.client_id,
      role: data.role as RoleTypes,
    };
    
    return await updateUserAndProfile(insertUser, insertUserProfile);
  }
}