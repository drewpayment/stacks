import type { CurrentUser } from '$lib/drizzle/postgres/db.model.js';
import { updatePassword } from '$lib/drizzle/postgres/models/passwords.js';
import { validatePasswordResetToken } from '$lib/drizzle/postgres/models/tokens';
import { getUserById, getUserProfileData, updateUserAttributes } from '$lib/drizzle/postgres/models/users.js';
import { AUTH_COOKIE, createSession, generateSessionToken, getSessionIdFromSessionCookie, invalidateSession } from '$lib/server/auth/auth';
import { getFeedbackObjects } from '$lib/utils/utils';
import { fail, redirect } from '@sveltejs/kit';
import type { User } from 'lucia';
import { z } from 'zod';

const newPasswordSchema = z.object({
	password: z.string().nonempty(),
	token: z.string().nonempty(),
});

export const load = async ({ params }) => {
	const token = params.token;
	return { token };
};

export const actions = {
	resetPassword: async ({ locals, params, request, cookies }) => {
		const formData = Object.fromEntries(await request.formData());
		const newPassword = newPasswordSchema.safeParse(formData);

		if (!newPassword.success) {
			const feedbacks = getFeedbackObjects(
				newPassword.error.issues.map((issue) => {
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

		const { password } = newPassword.data;

		try {
			const { token } = params;
			const userId = await validatePasswordResetToken(token);
			
			const user = (await getUserById(userId)) as User;

			if (!user) {
				const feedbacks = getFeedbackObjects([
					{
						type: 'error',
						title: 'Invalid or expired password reset link',
						message: 'Please try again'
					}
				]);

				return fail(400, {
					feedbacks
				});
			}
			const userProfile = await getUserProfileData(user.id);

			const sessionCookie = cookies.get(AUTH_COOKIE)?.split(';')[0];
			
			if (sessionCookie) {
				// Invalidate all sessions and update the password
				const sessionId = await getSessionIdFromSessionCookie(sessionCookie);
				
				if (sessionId) {
					await invalidateSession(sessionId);
				}
			}
			
			await updatePassword(user.id, password);

			// If the user has not verified their email, verify it now
			if (!user.emailVerified) {
				const updated = await updateUserAttributes(user.id, {
					emailVerified: true,
				});
				
				if (updated) user.emailVerified = true;
			}
			
			const sessionToken = generateSessionToken();
			const session = await createSession(sessionToken, user.id);
			
			locals.user = {...user, profile: userProfile } as CurrentUser;
			locals.session = session;
		} catch (e) {
			const feedbacks = getFeedbackObjects([
				{
					type: 'error',
					title: 'Invalid reset link',
					message: 'Your password reset link is invalid or has expired. Please try again.'
				}
			]);

			return fail(400, {
				feedbacks
			});
		}

		redirect(302, '/');
	}
};
