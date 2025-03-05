import type { CurrentUser } from '$lib/drizzle/postgres/db.model';
import type { Session } from '$lib/server/auth/types';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: CurrentUser;
			session: Session;
		}
		// interface PageData {}
		// interface Platform {}
		interface Client {
			id: string;
			name: string;
			contactUserId: string | null;
			created: bigint;
			updated: bigint;
			deleted: bigint | null;
		}
	}
	
	interface Window {
		webkitRequestAnimationFrame: any;
		mozRequestAnimationFrame: any;
	}
}

export { };

