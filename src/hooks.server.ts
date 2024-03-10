import { getUserProfileData } from '$lib/drizzle/mysql/models/users';
import { getSessionId, lucia } from '$lib/lucia/utils';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const protectedRoutesBase = '/app';
const emailVerificationPath = '/app/email-verification';
const superAdminRoutesBase = '/app/client';

const authRoutesBase = ['/auth', '/oauth'];

const authHandler: Handle = async ({ event, resolve }) => {
	const sessionId = getSessionId(event);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}
	
	const { session, user } = await lucia.validateSession(sessionId);
	
	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});
	}
	event.locals.user = user;
	event.locals.session = session;
	// return resolve(event);
	// const session = await event.locals.auth.validate();

	if (!session) {
		// If the user is not logged in and is trying to access a protected route,
		// redirect them to the login page
		if (event.url.pathname.startsWith(protectedRoutesBase) ||
			event.url.pathname.startsWith(superAdminRoutesBase)) {
			redirect(302, '/auth/login');
		}
	}

	if (session) {
		// If the user is logged in and is trying to access an auth route,
		// redirect them to the profile page
		// except if they are trying to logout
		if (
			authRoutesBase.some((route) => event.url.pathname.startsWith(route)) &&
			event.url.search !== '?/logout'
		) {
			redirect(302, '/');
		}

		// If the user is logged in, but their email is not verified
		// and they are trying to access a protected route,
		// redirect them to the email verification page
		if (
			!user.emailVerified &&
			(event.url.pathname.startsWith(superAdminRoutesBase) ||
			event.url.pathname.startsWith(protectedRoutesBase)) &&
			!event.url.pathname.startsWith(emailVerificationPath)
		) {
			redirect(302, '/app/email-verification');
		}
		
		if (event.url.pathname.startsWith(superAdminRoutesBase)) {
			const referer = event.request.headers.get('referer') || '/';
			const profile = await getUserProfileData(user?.id);
			
			if (profile?.role !== 'super_admin') {
				redirect(302, referer);
			}
		}
	}

	return await resolve(event);
};

export const handle = sequence(authHandler);
