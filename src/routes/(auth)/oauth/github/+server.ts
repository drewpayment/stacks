import { dev } from '$app/environment';
import { redirect } from '@sveltejs/kit';

export const GET = async ({ cookies }) => {
	// const [url, state] = await githubAuth.getAuthorizationUrl();

	// // Store state
	// cookies.set('github_oauth_state', state, {
	// 	httpOnly: true,
	// 	secure: !dev,
	// 	path: '/',
	// 	maxAge: 60 * 60
	// });

	redirect(302, '/');
};
