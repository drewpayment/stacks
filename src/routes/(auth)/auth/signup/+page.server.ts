import { generateEmailVerificationToken } from '$lib/drizzle/mysql/models/tokens';
import { updateUserProfileData } from '$lib/drizzle/mysql/models/users';
import { sendEmail } from '$lib/emails/send';
import { auth } from '$lib/lucia/mysql';
import { getFeedbackObjects } from '$lib/utils';
import { fail, redirect } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import type { Actions } from './$types';

const signupUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(1)
});

export const actions: Actions = {
  signupUser: async ({ locals, request, url }) => {
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

    const { firstName, lastName, email, password } = signupUser.data;

    try {
      const user = await auth.createUser({
        key: {
          providerId: 'email',
          providerUserId: email,
          password // this is hashed by Lucia
        },
        attributes: {
          email,
          email_verified: false,
        }
      });

      // Update user profile data
      await updateUserProfileData({
        id: nanoid(),
        userId: user.userId,
        firstName,
        lastName,
        clientId: 'default',
        role: 'user',
      });

      const session = await auth.createSession({
        userId: user.userId,
        attributes: {},
      });

      // Set session cookie
      locals.auth.setSession(session);

      // Send verification email
      const verificationToken = await generateEmailVerificationToken(user.userId);

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
