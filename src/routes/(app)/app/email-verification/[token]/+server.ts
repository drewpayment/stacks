import { validateEmailVerificationToken } from '$lib/drizzle/mysql/models/tokens';
import { getUserById, updateUser } from '$lib/drizzle/mysql/models/users';
import { auth } from '$lib/lucia/mysql';
import { fail } from '@sveltejs/kit';
import type { User } from 'lucia';

export const GET = async ({ params, locals, cookies }) => {
	const { token } = params;

	try {
		const userId = await validateEmailVerificationToken(token);
		
		const user = await getUserById(userId);

		await auth.invalidateUserSessions(userId);
		
		const updateResult = await updateUser({
			id: userId, 
			email: user.email,
			emailVerified: true,
		});
		
		if (!updateResult?.status) fail(400, { message: 'Invalid email verification link' });

		const session = await auth.createSession(user.id, {});
		const sessionCookie = auth.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes,
		});
		
		locals.user = user as User;
		locals.session = session;

		return new Response(null, {
			status: 302,
			headers: {
				Location: '/app/profile'
			}
		});
	} catch (error) {
		return new Response('Invalid email verification link', {
			status: 400
		});
	}
};
