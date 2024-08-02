import { createUser, getUsers, updateUserAndProfile } from '$lib/drizzle/postgres/models/users';
import type { InsertUser, InsertUserKey, InsertUserProfile, RoleTypes, SelectClient, User } from '$lib/drizzle/postgres/db.model';
import { fail } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import { Argon2id } from 'oslo/password';
import { z } from 'zod';
import { AuthUtils } from '$lib/utils/auth.js';

const passwordResetSchema = z.object({
	email: z.string().email()
});

export const load = async ({locals}) => {
  if (!locals.user) fail(401, { message: 'Unauthorized' });
  
  if (!locals.user.profile) {
    return fail(401, { message: 'Unauthorized' });
  }
  
  const users = async (): Promise<User[]> => {
    const users = await getUsers(locals.user.profile?.clientId as string);
    return users;
  }
  
  return {
    users: await users(),
    client: locals.user.profile?.client as SelectClient,
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
    };
    
    // generate a random password string for the temporary password
    const randomPasswordCharacters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomPassword = Array(10).fill('').map(() =>  { 
      return randomPasswordCharacters[Math.floor(Math.random() * randomPasswordCharacters.length)]; 
    }).join('');
    const hashedPassword = await new Argon2id().hash(randomPassword);
    
    const insertUserKey: InsertUserKey = {
      id: `email:${data.email}`,
      userId: insertUser.id,
      hashedPassword,
    }
    
    const insertUserProfile: InsertUserProfile = {
      id: nanoid(),
      userId: insertUser.id,
      firstName: data.first_name,
      lastName: data.last_name,
      clientId: data.client_id,
      role: data.role as RoleTypes,
    };
    
    try {
      await createUser(insertUser, insertUserKey, insertUserProfile);
    } catch (err) {
      return fail(500, { message: 'Error creating user', error: err });
    }
    
    return randomPassword;
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
  },
  sendPasswordResetLink: async ({ request, url }) => {
		const formData = Object.fromEntries(await request.formData());

		const { userId, email } = formData as any;
		
    return AuthUtils.sendPasswordResetLink(url.origin, email, userId);
	}
}