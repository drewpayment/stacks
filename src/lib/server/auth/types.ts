

export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };

export interface Session {
	id: string;
	userId: string;
	expiresAt: string;
}

export interface User {
	id: string;
	emailVerified: boolean;
}