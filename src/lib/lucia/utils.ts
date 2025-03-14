import {
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET,
	GOOGLE_OAUTH_CLIENT_ID,
	GOOGLE_OAUTH_CLIENT_SECRET,
	GOOGLE_OAUTH_REDIRECT_URI
} from '$env/static/private';
import 'dotenv/config'

const adapterOptions = {
	user: 'auth_user',
	session: 'user_session'
};


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
