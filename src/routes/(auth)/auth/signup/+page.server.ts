import { createUser, getUserByEmail } from '$lib/drizzle/postgres/models/users';
import { getFeedbackObjects } from '$lib/utils/utils';
import { fail } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import type { Actions } from './$types';
import { Argon2id } from 'oslo/password';
import type { InsertUser, InsertUserKey, InsertUserProfile, SelectEmployee } from '$lib/drizzle/postgres/db.model';
import { AuthUtils } from '$lib/utils/auth';
import { dev } from '$app/environment';
import { getEmployeeByEmail } from '$lib/drizzle/postgres/models/employees';

const signupUserSchema = z.object({
  email: z.string().email()
});

export const actions: Actions = {
  signupUser: async ({ request, url }) => {
    const formData = Object.fromEntries(await request.formData());
    const signupUser = signupUserSchema.safeParse(formData);

    if (!signupUser.success) {
      const feedbacks = getFeedbackObjects(
        signupUser.error.issues.map((issue) => {
          return {
            type: 'error',
            path: String(issue.path[0]),
            title: 'Invalid ' + issue.path[0],
            message: issue.message
          };
        })
      );

      return fail(500, {
        feedbacks
      });
    }

    const { email } = signupUser.data;
    
    try {
      // Check if user exists
      const existingEmployee = await getEmployeeByEmail(email);
      
      if (existingEmployee) {
        let userId: string;
        const user = await getUserByEmail(email);
        
        if (!user) {
          userId = await createNewUserFromEmployee(email, existingEmployee);
        } else {
          userId = user.id;
        }
        
        // User exists, send password reset
        const failure = await AuthUtils.sendPasswordResetLink(url.origin, email, userId);
        
        if (failure) {
          throw new Error(failure.data.feedbacks[0].message);
        }
        
        return {
          feedbacks: getFeedbackObjects([
            {
              type: 'success',
              title: 'Password Reset Link Sent',
              message: 'If an account exists with this email, you will receive a password reset link.'
            }
          ])
        };
      }
      
      if (dev) {
        console.log('User does not exist, sending email verification link');
      }

      // If user doesn't exist, return same message to avoid email enumeration
      return {
        feedbacks: getFeedbackObjects([
          {
            type: 'success',
            title: 'Password Reset Link Sent',
            message: 'If an account exists with this email, you will receive a password reset link.'
          }
        ])
      };
    } catch (e) {
      const feedbacks = getFeedbackObjects([
        {
          type: 'error',
          title: 'Unknown error',
          message: 'An unknown error occurred. Please try again.'
        }
      ]);

      return fail(500, {
        feedbacks
      });
    }
  }
};

const createNewUserFromEmployee = async (email: string, existingEmployee: SelectEmployee) => {
  // Create user record for existing employee
  const userId = nanoid();
  const newUser: InsertUser = {
    id: userId,
    email: email,
    emailVerified: false
  };

  const newUserKey: InsertUserKey = {
    id: `email:${email}`,
    userId: userId,
    hashedPassword: await new Argon2id().hash(nanoid())
  };

  const newUserProfile: InsertUserProfile = {
    id: nanoid(),
    userId: userId,
    clientId: existingEmployee.clientId,
    role: 'user',
    firstName: existingEmployee.firstName,
    lastName: existingEmployee.lastName
  };

  await createUser(newUser, newUserKey, newUserProfile);
  
  return userId;
}
