import { drizzleClient } from '$lib/drizzle/postgres/client';
import { emailVerification, passwordResetToken } from '$lib/drizzle/postgres/schema';
import dayjs from 'dayjs';
import { eq } from 'drizzle-orm';
import { generateRandomString, alphabet } from 'oslo/crypto';

const EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours

const isWithinExpiration = (expires: number) => {
	// create expiration date with dayjs from the expires value
	const expiryDate = dayjs(expires).subtract(EXPIRES_IN / 2, 'milliseconds');
	
	// const expiryDate = createDate(new TimeSpan(Number(expires) - EXPIRES_IN / 2, 'h'));
	return dayjs().isBefore(expiryDate);
}

const randString = () => generateRandomString(63, alphabet('a-z', 'A-Z', '0-9'));

const generateEmailVerificationToken = async (userId: string | undefined) => {
	if (!userId) {
		throw new Error('Invalid user ID');
	}

	const storedUserTokens = await drizzleClient
		.select()
		.from(emailVerification)
		.where(eq(emailVerification.userId, userId));

	if (storedUserTokens.length > 0) {
		const reusableStoredToken = storedUserTokens.find((token) => {
			// check if expiration is within 1 hour
			// and reuse the token if true
			return isWithinExpiration(Number(token.expires));
		});

		if (reusableStoredToken) {
			return reusableStoredToken.id;
		}
	}

	const token = randString();

	await drizzleClient.insert(emailVerification).values({
		id: token,
		userId: userId,
		expires: dayjs().add(EXPIRES_IN, 'milliseconds').toDate(),
	});

	return token;
};

const generatePasswordResetToken = async (userId: string) => {
	const storedUserTokens = await drizzleClient
		.select()
		.from(passwordResetToken)
		.where(eq(passwordResetToken.userId, userId));

	if (storedUserTokens.length > 0) {
		const reusableStoredToken = storedUserTokens.find((token) => {
			// check if expiration is within 1 hour
			// and reuse the token if true
			return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
		});

		if (reusableStoredToken) {
			return reusableStoredToken.id;
		}
	}

	const token = randString();

	await drizzleClient.insert(passwordResetToken).values({
		id: token,
		userId,
		expires: dayjs().add(EXPIRES_IN, 'milliseconds').toDate(),
	});

	return token;
};

const validateEmailVerificationToken = async (token: string) => {
	const storedToken = await drizzleClient.query.emailVerification.findFirst({
		where: (emailVerification, { eq, }) => eq(emailVerification.id, token),
	});

	if (!storedToken) {
		throw new Error('Invalid token');
	}

	// Delete all tokens for the user
	await drizzleClient
		.delete(emailVerification)
		.where(eq(emailVerification.userId, storedToken.userId));

	const tokenExpires = Number(storedToken.expires);

	if (!isWithinExpiration(tokenExpires)) {
		throw new Error('Expired token');
	}

	return storedToken.userId;
};

const validatePasswordResetToken = async (token: string) => {
	const storedToken = (
		await drizzleClient.select().from(passwordResetToken).where(eq(passwordResetToken.id, token))
	)[0];

	if (!storedToken) {
		throw new Error('Invalid token');
	}

	// Delete all tokens for the user
	await drizzleClient
		.delete(passwordResetToken)
		.where(eq(passwordResetToken.userId, storedToken.userId));

	const tokenExpires = Number(storedToken.expires);

	if (!isWithinExpiration(tokenExpires)) {
		throw new Error('Expired token');
	}

	return storedToken.userId;
};

export {
    generateEmailVerificationToken,
    generatePasswordResetToken,
    validateEmailVerificationToken,
    validatePasswordResetToken
};

