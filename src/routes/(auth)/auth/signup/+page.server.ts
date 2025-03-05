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
import { AUTH_INITIALIZE, CMP_CLIENT_ID } from '$env/static/private';
import { getClient, upsertClient } from '$lib/drizzle/postgres/models/clients';
import dayjs from 'dayjs';

const signupUserSchema = z.object({
  email: z.string().email()
});

const SETUP_AUTH_MODE = dev && Boolean(AUTH_INITIALIZE);

const FATAL_ERROR = {
  feedbacks: getFeedbackObjects([
    {
      type: 'error',
      title: 'FATAL ERROR',
      message: 'Your development mode authentication setup failed. You will need to debug it like a real dev.',
    },
  ]),
};

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
      
      if (SETUP_AUTH_MODE) {
        console.log('Authentication startup mode initiatied.');
        
        // check for base client 
        const cmpClient = await getClient(CMP_CLIENT_ID);
        
        if (!cmpClient) {
          try {
            const now = dayjs().toDate();
            await upsertClient({
              id: CMP_CLIENT_ID,
              name: 'Choice Marketing Partners',
              slug: 'cmp',
              billingEmail: 'drewpayment@choice-marketing-partners.com',
              billingAddress: JSON.stringify({
                street: '4038 Zion Ct SE',
                city: 'Kentwood',
                state: 'Michigan',
                country: 'USA',
                zip: 49512,
              }),
              isActive: true,
              legalName: 'Choice Marketing Partners LLP',
              primaryContactName: 'Terri Payment',
              primaryContactEmail: 'tpayment@choice-marketing-partners.com',
              primaryContactPhone: '2318879945',
              industry: 'Marketing',
              created: now,
              updated: now,
            });
          } catch (error) {
            console.error(error);
            return FATAL_ERROR;
          }
        }
        
        const { success } = await setupAuthModeNewUser(email);
        
        if (!success) {
          return FATAL_ERROR;
        } else {
          return {
            feedbacks: getFeedbackObjects([
              {
                type: 'success',
                title: 'Success',
                message: 'Your super user has been created.',
              },
            ]),
          };
        }
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
      console.error(e);
      return FATAL_ERROR;
    }
  }
};

const setupAuthModeNewUser = async (email: string) => {
  const userId = nanoid();
  const newUser = {
    id: userId,
    email,
    emailVerified: true,
  } as InsertUser;
  
  const newUserKey = {
    id: `email:${email}`,
    userId,
    hashedPassword: await new Argon2id().hash(`N1MDAP@SSWD`),
  } as InsertUserKey;
  
  const newUserProfile = {
    id: nanoid(),
    userId,
    clientId: CMP_CLIENT_ID,
    role: 'super_admin',
    firstName: 'Super',
    lastName: 'Admin',
  } as InsertUserProfile;
  
  try {
    const { success, error } = await createUser(newUser, newUserKey, newUserProfile);
    
    if (error) throw error;
    
    return {
      success,
      user: {
        user: newUser,
        profile: newUserProfile,
      },
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      user: null,
    };
  }
}

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
