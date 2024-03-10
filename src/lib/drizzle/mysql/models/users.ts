import { drizzleClient } from '$lib/drizzle/mysql/client';
import { user, userKey, userProfile } from '$lib/drizzle/mysql/schema';
import type { InsertUser, InsertUserKey, InsertUserProfile, SelectUser, User, UserProfile } from '$lib/types/db.model';
import { fail } from '@sveltejs/kit';
import { eq, ne, and } from 'drizzle-orm';

const getUserByEmail = async (email: string | undefined) => {
	if (!email) {
		return undefined;
	}

	const data = await drizzleClient.select().from(user).where(eq(user.email, email));

	return data[0];
};

export const getUserById = async (userId: string): Promise<SelectUser> => {
	if (!userId) return null as unknown as SelectUser;
	
	const user = await drizzleClient.query.user
		.findFirst({
			where: (user, { eq }) => eq(user.id, userId),
		});
		
	return user as SelectUser;
}

/**
 * Insert user profile data
 * 
 * @param profileData 
 * @returns Promise<void>
 */
const insertUserProfileData = async (profileData: InsertUserProfile) => {
	await drizzleClient
		.insert(userProfile)
		.values(profileData)
		.onDuplicateKeyUpdate({
			set: Object.fromEntries(
				Object.entries(profileData).filter(([key]) => !['id', 'userId'].includes(key))
			)
		});
};

/**
 * Update user profile data
 * 
 * @param profileData 
 * @returns Promise<void>
 */
export const updateUserProfileData = async (profileData: InsertUserProfile) => {
	await drizzleClient
		.update(userProfile)
		.set(profileData)
		.where(eq(userProfile.id, profileData.id));
}

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
const getUserProfileData = async (userId: string | undefined): Promise<UserProfile> => {
	if (!userId) {
		return null as unknown as UserProfile;
	}

	const data = await drizzleClient.select().from(userProfile).where(eq(userProfile.userId, userId));

	return data[0];
};

/**
 * Gets list of users' auth and profile data.
 * 
 * @param clientId 
 * @returns Promise<User[]>
 */
const getUsers = async (clientId: string): Promise<User[]> => {
	const data = (await drizzleClient.select()
		.from(userProfile)
		.innerJoin(user, eq(userProfile.userId, user.id))
		.where(and(eq(userProfile.clientId, clientId), ne(userProfile.role, 'super_admin')))
		.orderBy(userProfile.firstName)) as unknown as User[];

	return data;
}

const getUserDetail = async (userId: string): Promise<User> => {
	const data = (await drizzleClient.select()
		.from(userProfile)
		.innerJoin(user, eq(userProfile.userId, user.id))
		.where(eq(userProfile.userId, userId))) as unknown as User[];

	return data[0];
}

const createUser = async (userData: InsertUser, userKeyData: InsertUserKey, profileData: InsertUserProfile) => {
	
	if (!userData.id) return { success: false, error: 'User ID is required.' };
	if (!userProfile.id) return { success: false, error: 'User Profile ID is required.' };
	if (!userProfile.userId) profileData.userId = userData.id;
	
	try {
		await drizzleClient.transaction(async (tx) => {
			await tx.insert(user).values(userData);
			await tx.insert(userKey).values(userKeyData);
			await tx.insert(userProfile).values(profileData);
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

const updateUserAndProfile = async (userData: InsertUser, profileData: InsertUserProfile) => {
	
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

export const updateUser = async (userData: InsertUser) => {
	try {
		await drizzleClient.update(user).set(userData).where(eq(user.id, userData.id));
	} catch (err) {
		return fail(500, {
			success: false,
			error: err,
		});
	}
}

export { 
	getUserByEmail, 
	getUserProfileData, 
	insertUserProfileData, 
	getUsers, 
	getUserDetail,
	createUser,
	updateUserAndProfile,
};
