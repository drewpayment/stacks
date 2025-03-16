

export const adapterOptions = {
	user: 'auth_user',
	session: 'user_session'
};


export interface DatabaseUserAttributes {
	email: string;
	email_verified: boolean;
	github_username?: string;
}

export const generateUserAttributes = (data: DatabaseUserAttributes) => {
	return {
		email: data.email,
		emailVerified: data.email_verified,
		githubUsername: data.github_username,
	};
};