import { connection } from '$lib/drizzle/postgres/client';
import {
	adapterOptions,
	generateUserAttributes,
	type DatabaseUserAttributes
} from '$lib/lucia/utils';
import { Lucia } from 'lucia';
import { PostgresJsAdapter } from '@lucia-auth/adapter-postgresql';
// import { github, google } from '@lucia-auth/oauth/providers';
import type { RequestEvent } from '@sveltejs/kit';

const adapter = new PostgresJsAdapter(connection, adapterOptions);

export const lucia = new Lucia(adapter, {
	getUserAttributes: (data) => {
		return generateUserAttributes(data);
	}
});

export const getSessionId = (event: RequestEvent<Partial<Record<string, string>>, string | null>) => event.cookies.get(lucia.sessionCookieName);

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		// DatabaseSessionAttributes: DatabaseSessionAttributes;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

// export const githubAuth = github(lucia, githubAuthOptions);
// export const googleAuth = google(lucia, googleAuthOptions);

export type Auth = typeof lucia;
