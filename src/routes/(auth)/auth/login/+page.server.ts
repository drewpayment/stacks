import { getFeedbackObjects } from '$lib/utils/utils';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import type { Actions } from './$types';
import { getUserByEmail } from '$lib/drizzle/postgres/models/users';
import { Argon2id } from "oslo/password";
import { db } from '$lib/drizzle/postgres/client';
import { LegacyScrypt } from 'lucia';
import { lucia } from '$lib/lucia/postgres';
import { createSession, generateSessionToken, invalidateSession } from '$lib/server/auth/auth';
import { setSessionTokenCookie } from '$lib/server/auth/cookies';
import dayjs from 'dayjs';

const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const actions: Actions = {
  loginUser: async ({ locals, request, cookies }) => {
    const formData = Object.fromEntries(await request.formData());
    const loginUser = loginUserSchema.safeParse(formData);

    if (!loginUser.success) {
      const feedbacks = getFeedbackObjects(
        loginUser.error.issues.map((issue) => {
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

    const { email, password: inputPassword } = loginUser.data;

    try {
      const user = await getUserByEmail(email);
      const userId = user?.id as string;
      
      const userKey = await db.query.userKey
        .findFirst({
          where: (uk, { eq }) => eq(uk.userId, userId),
          columns: {
            hashedPassword: true,
          },
        });
        
      if (!userKey) {
        return fail(400, {
          message: "Incorrect username or password"
        });
      }
      
      const hashedPassword = userKey?.hashedPassword as string;
      
      const validPassword = hashedPassword.startsWith('s2') 
        ? await new LegacyScrypt().verify(hashedPassword, inputPassword)
        : await new Argon2id().verify(hashedPassword, inputPassword);
      
      if (!validPassword) {
        return fail(400, {
          message: "Incorrect username or password"
        });
      }
      
      const token = generateSessionToken();
      await createSession(token, userId);
      
      setSessionTokenCookie(cookies, token, dayjs().add(60, 'minutes').toDate());
    } catch (e) {
      console.error(e);
      const feedbacks = getFeedbackObjects([
        {
          type: 'error',
          title: 'Login failed',
          message: 'An unknown error occurred. Please try again later.'
        }
      ]);

      return fail(500, {
        feedbacks
      });
    }

    redirect(302, '/');
  },

  logout: async ({ cookies, locals }) => {
    if (!locals.user) return fail(401);
    
    await invalidateSession(locals.session!.id);
    
    const sessionToken = generateSessionToken();
    await createSession(sessionToken, locals.user.id);
    setSessionTokenCookie(cookies, sessionToken, dayjs().add(60, 'minutes').toDate());
    
		redirect(302, "/auth/login");
  }
};
