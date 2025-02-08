import { db } from '$lib/drizzle/postgres/client';
import { sha256 } from 'oslo/crypto';
import type { Session, SessionValidationResult, User } from './types';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { user as dbUser, userSession } from '$lib/drizzle/postgres/schema';
import type { InsertUserSession } from '$lib/drizzle/postgres/db.model';
import { and, eq } from 'drizzle-orm';
import dayjs from 'dayjs';

export const AUTH_COOKIE = "session";

export function generateSessionToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

export async function createSession(token: string, userId: string): Promise<Session> {
	const hash = await sha256(new TextEncoder().encode(token));
	const hashArray = new Uint8Array(hash);
	const sessionId = encodeHexLowerCase(hashArray);
	const session: InsertUserSession = {
		id: sessionId,
		userId: userId?.toString(),
		expiresAt: dayjs().add(30, 'days').format('YYYY-MM-DD')
	};
	
	try {
		await db.insert(userSession)
			.values(session);
			
		return session;
	} catch (error) {
		console.error(`Failed to insert! Error: ${error}`);
		return null as unknown as Session;
	}
}

export async function validateSessionToken(sessionCookie: string): Promise<SessionValidationResult> {
	const now = dayjs();
	const sessionCookieParts = sessionCookie.split(';');
	
	if (!sessionCookieParts || !sessionCookieParts.length) 
		return {
			session: null,
			user: null,
		};
		
	const token = sessionCookieParts[0];
	// const sessionId = encodeHexLowerCase(new TextEncoder().encode(token));
	const hashBuffer = await sha256(new TextEncoder().encode(token));
	const sessionId = encodeHexLowerCase(new Uint8Array(hashBuffer));
	
	const sessionData = await db.query.userSession
		.findFirst({
			where: (us, { eq }) => eq(us.id, sessionId),
		});
		
	if (!sessionData) {
		return {
			session: null,
			user: null,
		};
	}
	
	// const sessionResults = await db
	// 	.select({
	// 		id: userSession.id,
	// 		userSessionUserId: userSession.userId,
	// 		expiresAt: userSession.expiresAt,
	// 		userId: dbUser.id,
	// 	})
	// 	.from(userSession)
	// 	.innerJoin(dbUser, eq(dbUser.id, userSession.userId))
	// 	.where(eq(userSession.id, sessionId));
	// const sessionData = sessionResults[0];
		
	// if (!sessionData) {
	// 	return {
	// 		session: null,
	// 		user: null,
	// 	};
	// }
	
	const session = {
		id: sessionData.id,
		userId: sessionData.userId,
		expiresAt: sessionData.expiresAt,
	} as Session;
	
	const user = {
		id: sessionData.userId,
	} as User;
	
	if (now.isAfter(dayjs(session.expiresAt))) {
		await db.delete(userSession)
			.where(eq(userSession.id, session.id));
		return {
			session: null,
			user: null,
		};
	}
	
	if (now.isAfter(dayjs(session.expiresAt).subtract(15, 'day'))) {
		session.expiresAt = dayjs(session.expiresAt).add(30, 'day').format('YYYY-MM-DD');
		
		await db.update(userSession)
			.set({
				expiresAt: dayjs(session.expiresAt).format('YYYY-MM-DD'),
			})
			.where(and(
				eq(userSession.id, session.id),
				eq(userSession.userId, session.userId),
			));
	}
	
	return {
		session,
		user,
	};
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await db.delete(userSession)
		.where(eq(userSession.id, sessionId));
}

