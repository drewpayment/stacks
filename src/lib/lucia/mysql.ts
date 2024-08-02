import {
	lucia
} from '$lib/lucia/utils';
import 'dotenv/config'





// export const auth = lucia({
// 	env: dev ? 'DEV' : 'PROD',
// 	middleware: sveltekit(),
// 	adapter: planetscale(connection, adapterOptions),

// 	getUserAttributes: (data) => {
// 		return generateUserAttributes(data);
// 	},
// });

export const auth = lucia;

// export const githubAuth = github(auth, githubAuthOptions);
// export const googleAuth = google(auth, googleAuthOptions);

export type Auth = typeof auth;
