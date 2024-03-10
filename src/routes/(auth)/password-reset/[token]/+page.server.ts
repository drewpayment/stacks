import { updatePassword } from '$lib/drizzle/mysql/models/passwords.js';
import { validatePasswordResetToken } from '$lib/drizzle/mysql/models/tokens';
import { getUserById, updateUserAttributes } from '$lib/drizzle/mysql/models/users.js';
import { auth } from '$lib/lucia/mysql';
import { lucia } from '$lib/lucia/utils';
import { getFeedbackObjects } from '$lib/utils';
import { fail, redirect } from '@sveltejs/kit';
import type { User } from 'lucia';
import { z } from 'zod';

const newPasswordSchema = z.object({
	password: z.string().nonempty()
});

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

			// Invalidate all sessions and update the password
			await lucia.invalidateUserSessions(user.id);
			await updatePassword(user.id, password);

			// If the user has not verified their email, verify it now
			if (!user.emailVerified) {
				const updated = await updateUserAttributes(user.id, {
					emailVerified: true,
				});
				
				if (updated) user.emailVerified = true;
			}

			const session = await lucia.createSession(user.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes,
			});
			
			locals.user = user;
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
