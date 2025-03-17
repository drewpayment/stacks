import { eq } from 'drizzle-orm'
import { db } from '../client'
import { userKey } from '../schema'
import { Argon2id } from 'oslo/password';
import { fail } from '@sveltejs/kit';


export const updatePassword = async (userId: string, newPassword: string): Promise<void> => {
  try {
    const hashedPassword = await new Argon2id().hash(newPassword);
    
    await db.update(userKey)
      .set({
        hashedPassword, 
      })
      .where(eq(userKey.userId, userId));
  } catch (err) {
    fail(500, { message: 'Failed to update password' });
  }
}