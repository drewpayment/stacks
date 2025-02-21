import type { CurrentUser, UserProfile } from '$lib/drizzle/postgres/db.model';
import { getUserProfileData } from '$lib/drizzle/postgres/models/users';
import { AUTH_COOKIE, validateSessionCookie } from '$lib/server/auth/auth';
import { deleteSessionTokenCookie, setSessionTokenCookie } from '$lib/server/auth/cookies';
import type { Session } from '$lib/server/auth/types';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import dayjs from 'dayjs';

const protectedRoutesBase = '/app';
const emailVerificationPath = '/app/email-verification';
const superAdminRoutesBase = '/app/client';

const authRoutesBase = ['/auth', '/oauth'];

const authHandler: Handle = async ({ event, resolve }) => {
	const sessionCookie = event.cookies.get(AUTH_COOKIE)?.split(';')[0];
	
	if (!sessionCookie) {
		// If the user is not logged in and is trying to access a protected route,
		// redirect them to the login page
		if (event.url.pathname.startsWith(protectedRoutesBase) ||
			event.url.pathname.startsWith(superAdminRoutesBase)) {
			redirect(302, '/auth/login');
		}
		
		event.locals.user = null as unknown as CurrentUser;
		event.locals.session = null as unknown as Session;
		return resolve(event);
	}
	
	const { session, user } = await validateSessionCookie(sessionCookie);
	
	// parse the sessionCookie and use only the sessionToken
	const sessionToken = sessionCookie?.split(';')[0];
	if (session) {
		setSessionTokenCookie(event.cookies, sessionToken, dayjs(session.expiresAt, 'YYYY-MM-DD').toDate());
		event.locals.session = session as Session;
	}
	if (!session) {
		deleteSessionTokenCookie(event.cookies);
		
		// If the user is not logged in and is trying to access a protected route,
		// redirect them to the login page
		if (event.url.pathname.startsWith(protectedRoutesBase) ||
			event.url.pathname.startsWith(superAdminRoutesBase)) {
			redirect(302, '/auth/login');
		}
	}
	
	if (user && user.id) {
		const profile = await getUserProfileData(user.id) as unknown as UserProfile;
		
		event.locals.user = {
			...user as CurrentUser,
			profile,
		};
	} else {
		event.locals.user = null as unknown as CurrentUser;
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
