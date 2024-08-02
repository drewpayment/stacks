import { generateEmailVerificationToken } from '$lib/drizzle/postgres/models/tokens';
import { createUser } from '$lib/drizzle/postgres/models/users';
import { sendEmail } from '$lib/emails/send';
import { getFeedbackObjects } from '$lib/utils/utils';
import { fail, redirect } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import type { Actions } from './$types';
import { Argon2id } from 'oslo/password';
import type { InsertUser, InsertUserKey, InsertUserProfile } from '$lib/drizzle/postgres/db.model';
import { lucia } from '$lib/lucia/postgres';


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
      const insertUser = {
        id: nanoid(),
        email,
      } as InsertUser;
        
      const hashedPassword = await new Argon2id().hash(inputPassword);
      
      const insertUserKey = {
        id: nanoid(),
        userId: insertUser.id,
        hashedPassword,
      } as InsertUserKey;
      
      const insertUserProfile = {
        id: nanoid(),
        userId: insertUser.id,
        firstName,
        lastName,
        clientId: 'default',
        role: 'user',
      } as InsertUserProfile;
        
      const result = await createUser(insertUser, insertUserKey, insertUserProfile);
      
      if (!result.success) {
        return fail(500, {
          feedbacks: [
            {
              type: 'error',
              title: 'Error creating user',
              message: 'An error occurred while creating your account. Please try again.'
            }
          ]
        });
      }
      
      const session = await lucia.createSession(insertUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      // Set session cookie
      cookies.set(sessionCookie.name, sessionCookie.value, {
        path: '.',
        ...sessionCookie.attributes,
      });

      // Send verification email
      const verificationToken = await generateEmailVerificationToken(insertUser.id);

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
