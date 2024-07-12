import { getFeedbackObjects } from '$lib/utils/utils';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import type { Actions } from './$types';
import { getUserByEmail } from '$lib/drizzle/postgres/models/users';
import { Argon2id } from "oslo/password";
import { drizzleClient } from '$lib/drizzle/postgres/client';
import { LegacyScrypt } from 'lucia';
import { lucia } from '$lib/lucia/postgres';

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
      
      const userKey = await drizzleClient.query.userKey
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
      
      const session = await lucia.createSession(userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      
      cookies.set(sessionCookie.name, sessionCookie.value, {
        path: ".",
        ...sessionCookie.attributes
      });
      
    } catch (e) {
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
    
    await lucia.invalidateSession(locals.session!.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});
		redirect(302, "/auth/login");
  }
};
