import { generateEmailVerificationToken } from '$lib/drizzle/mysql/models/tokens';
import { insertUserProfileData } from '$lib/drizzle/mysql/models/users';
import { sendEmail } from '$lib/emails/send';
import { auth } from '$lib/lucia/mysql';
import { getFeedbackObjects } from '$lib/utils';
import { fail, redirect } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import type { Actions } from './$types';
import { drizzleClient } from '$lib/drizzle/mysql/client';
import { password, user } from '$lib/drizzle/mysql/schema';
import { Argon2id } from 'oslo/password';
import type { SelectUser } from '$lib/types/db.model';
import { lucia } from '$lib/lucia/utils';

const signupUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(1)
});

export const actions: Actions = {
  signupUser: async ({ locals, request, url, cookies }) => {
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

    const { firstName, lastName, email, password: inputPassword } = signupUser.data;

    try {
      const createdUser = await drizzleClient.transaction<SelectUser>(async tx => {
        const userId = nanoid();
        
        const dto: SelectUser = {
          id: userId, 
          email,
          emailVerified: false,
          githubUsername: null,
        };
        
        await drizzleClient.insert(user)
          .values(dto);
          
        const hashedPassword = await new Argon2id().hash(inputPassword);
          
        await drizzleClient.insert(password).values({ id: nanoid(), userId, hashedPassword, });
        
        await insertUserProfileData({
          id: nanoid(),
          userId,
          firstName, 
          lastName, 
          clientId: 'default',
          role: 'user',
        });
        
        return dto;
      });
      
      const session = await lucia.createSession(createdUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      // Set session cookie
      cookies.set(sessionCookie.name, sessionCookie.value, {
        path: '.',
        ...sessionCookie.attributes,
      });

      // Send verification email
      const verificationToken = await generateEmailVerificationToken(createdUser.id);

      const sender = 'Stacks <drew@verostack.dev>';
      const recipient = firstName ? `${firstName}` : email;
      const emailHtml = `Hello ${recipient},
			<br><br>
			Thank you for signing up to Stacks! Please click the link below to verify your email address:
			<br><br>
			<a href="${url.origin}/app/email-verification/${verificationToken}">Verify Email Address</a>
			<br>
			You can also copy directly into your browser:
			<br><br>
			<code>${url.origin}/app/email-verification/${verificationToken}</code>
			<br><br>
			Thanks,
			<br>
			Drew from Stacks`;

      const signupEmail = await sendEmail({
        from: sender,
        to: email,
        subject: 'Verify Your Email Address',
        html: emailHtml
      });

      if (signupEmail[0].type === 'error') {
        return fail(500, {
          feedbacks: signupEmail
        });
      }
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

    redirect(302, '/app/email-verification');
  }
};
