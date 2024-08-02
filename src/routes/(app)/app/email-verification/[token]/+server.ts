import { validateEmailVerificationToken } from '$lib/drizzle/postgres/models/tokens';
import { getUserById, updateUser } from '$lib/drizzle/postgres/models/users';
import { lucia } from '$lib/lucia/postgres.js';
import { fail } from '@sveltejs/kit';
import { type User } from 'lucia';

export const GET = async ({ params, locals, cookies }) => {
	const { token } = params;

	try {
		const userId = await validateEmailVerificationToken(token);
		
		const user = await getUserById(userId);

		await lucia.invalidateUserSessions(userId);
		
		const updateResult = await updateUser({
			id: userId, 
			email: user.email,
			emailVerified: true,
		});
		
		if (!updateResult) fail(400, { message: 'Invalid email verification link' });

		const session = await lucia.createSession(user.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
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
