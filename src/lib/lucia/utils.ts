import {
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET,
	GOOGLE_OAUTH_CLIENT_ID,
	GOOGLE_OAUTH_CLIENT_SECRET,
	GOOGLE_OAUTH_REDIRECT_URI
} from '$env/static/private';
import { PlanetScaleAdapter } from '@lucia-auth/adapter-mysql';
import { connect } from '@planetscale/database';
import { Lucia } from 'lucia';
import 'dotenv/config'
import type { RequestEvent } from '@sveltejs/kit';

export const connection = connect({
	host: process.env.MYSQL_DB_HOST,
	username: process.env.MYSQL_DB_USER,
	password: process.env.MYSQL_DB_PASSWORD,
});

const adapterOptions = {
	user: 'auth_user',
	session: 'user_session'
};

const adapter = new PlanetScaleAdapter(connection, {
	user: 'auth_user',
	session: 'user_session',
});

export const lucia = new Lucia(adapter, {
	getUserAttributes: (data) => {
		return generateUserAttributes(data);
	},
})

export const getSessionId = (event: RequestEvent<Partial<Record<string, string>>, string | null>) => event.cookies.get(lucia.sessionCookieName);

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseSessionAttributes: DatabaseSessionAttributes;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

export interface DatabaseSessionAttributes {
	
}
export interface DatabaseUserAttributes {
	email: string;
	email_verified: boolean;
	github_username?: string;
}

const generateUserAttributes = (data: DatabaseUserAttributes) => {
	return {
		email: data.email,
		emailVerified: data.email_verified,
		githubUsername: data.github_username,
	};
};

const googleAuthOptions = {
	clientId: GOOGLE_OAUTH_CLIENT_ID,
	clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
	redirectUri: GOOGLE_OAUTH_REDIRECT_URI,
	scope: [
		'openid',
		'https://www.googleapis.com/auth/userinfo.profile',
		'https://www.googleapis.com/auth/userinfo.email'
	],
	accessType: 'offline' as 'offline' | 'online' | undefined
};

const githubAuthOptions = {
	clientId: GITHUB_CLIENT_ID,
	clientSecret: GITHUB_CLIENT_SECRET
};

export { adapterOptions, generateUserAttributes, githubAuthOptions, googleAuthOptions };
