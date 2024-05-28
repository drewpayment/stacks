import { drizzleClient } from '$lib/drizzle/postgres/client';
import { user, userClient, userKey, userProfile } from '$lib/drizzle/postgres/schema';
import type { InsertUser, InsertUserKey, InsertUserProfile, SelectUser, User, UserProfile } from '$lib/drizzle/mysql/db.model';
import { and, eq, ne } from 'drizzle-orm';
import type { SelectClient } from '../db.model';
import { nanoid } from 'nanoid';

export const getUserByEmail = async (email: string | undefined) => {
	if (!email) {
		return undefined;
	}

	const data = await drizzleClient.select().from(user).where(eq(user.email, email));

	return data[0];
};

export const updateUserProfileData = async (profileData: typeof userProfile.$inferInsert) => {
	await drizzleClient
		.insert(userProfile)
		.values(profileData)
		.onConflictDoUpdate({
			target: userProfile.userId,
			set: Object.fromEntries(
				Object.entries(profileData).filter(([key]) => !['id', 'userId'].includes(key))
			)
		});
};

export const updateUserAttributes = async (userId: string, attributes: Partial<SelectUser>) => {
	try {
		await drizzleClient.update(user).set(attributes).where(eq(user.id, userId));
		return true;
	} catch (err) {
		return false;
	}
}

/**
 * 
 * 
 * @param userId 
 * @returns Promise<UserProfile>
 */
export const getUserProfileData = async (userId: string | undefined): Promise<UserProfile & { client: SelectClient }> => {
	if (!userId) {
		return null as unknown as UserProfile & { client: SelectClient };
	}

	const data = await drizzleClient.query.userProfile
		.findFirst({
			where: eq(userProfile.userId, userId),
			with: {
				client: true,
			},
		}) as UserProfile & { client: SelectClient };
		
	return data;
	// const data = await drizzleClient.select().from(userProfile).where(eq(userProfile.userId, userId));

	// return data[0] as UserProfile;
};

/**
 * Gets list of users' auth and profile data.
 * 
 * @param clientId 
 * @returns Promise<User[]>
 */
export const getUsers = async (clientId: string): Promise<User[]> => {
	const data = (await drizzleClient.select()
		.from(userProfile)
		.innerJoin(user, eq(userProfile.userId, user.id))
		.where(and(eq(userProfile.clientId, clientId), ne(userProfile.role, 'super_admin')))
		.orderBy(userProfile.firstName)) as unknown as User[];

	return data;
}

export const getUserDetail = async (userId: string): Promise<User> => {
	const data = (await drizzleClient.select()
		.from(userProfile)
		.innerJoin(user, eq(userProfile.userId, user.id))
		.where(eq(userProfile.userId, userId))) as unknown as User[];

	return data[0];
}

export const getUserById = async (userId: string): Promise<SelectUser> => {
	if (!userId) return null as unknown as SelectUser;
	
	const user = await drizzleClient.query.user
		.findFirst({
			where: (user, { eq }) => eq(user.id, userId),
		});
		
	return user as SelectUser;
}

export const createUser = async (userData: InsertUser, userKeyData: InsertUserKey, profileData: InsertUserProfile) => {
	
	if (!userData.id) return { success: false, error: 'User ID is required.' };
	if (!profileData.id) return { success: false, error: 'User Profile ID is required.' };
	if (userData.id !== (profileData.userId as unknown as string)) profileData.userId = userData.id;
	
	try {
		await drizzleClient.transaction(async (tx) => {			
			await tx.insert(user).values(userData);
			await tx.insert(userKey).values(userKeyData);
			await tx.insert(userProfile).values(profileData);
			await tx.insert(userClient).values({
				id: nanoid(),
				userId: userData.id,
				clientId: profileData.clientId as string,
			});
		});
	} catch (err) {
		console.error(err);
		
		return {
			success: false,
			error: err,
		};
	}
	
	return { success: true, };
}

export const updateUserAndProfile = async (userData: InsertUser, profileData: InsertUserProfile) => {
	
	try {
		await drizzleClient.transaction(async (tx) => {
			await tx.update(user).set(userData).where(eq(user.id, userData.id));
			await tx.update(userProfile).set(profileData).where(eq(userProfile.id, profileData.id));
		});
	} catch (err) {
		console.error(err);
		
		return {
			success: false,
			error: err,
		};
	}
	
	return { success: true, };
}

export const updateUser = async (userData: InsertUser): Promise<SelectUser | null> => {
	try {
		await drizzleClient.update(user).set(userData).where(eq(user.id, userData.id));
		
		return userData as SelectUser;
	} catch (err) {
		fail(err);
		
		return null;
	}
}
