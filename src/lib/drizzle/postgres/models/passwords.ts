import { eq } from 'drizzle-orm'
import { db } from '../client'
import { password, passwordResetToken } from '../schema'
import dayjs from 'dayjs';
import { Scrypt } from 'oslo/password';
import { fail } from '@sveltejs/kit';


// export const createPasswordResetToken = async (userId: string) => {
//   await db.delete(passwordResetToken).where(eq(passwordResetToken.userId, userId));
    
//   const tokenId = generateId(40);
  
//   await db.insert(passwordResetToken).values({
//     id: tokenId,
//     userId,
//     expires: dayjs().add(2, 'hours').toDate(),
//   });
  
//   return tokenId;
// }

export const updatePassword = async (userId: string, newPassword: string): Promise<void> => {
  try {
    const hashedPassword = await (new Scrypt()).hash(newPassword);
    
    await db.update(password)
      .set({
        hashedPassword, 
      })
      .where(eq(password.userId, userId));
  } catch (err) {
    fail(500, { message: 'Failed to update password' });
  }
}