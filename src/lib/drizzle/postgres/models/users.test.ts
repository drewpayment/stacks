import { expect, test, describe, afterAll, vi } from 'vitest';
import {
  getUserByEmail,
} from './users';
import { db } from '$lib/drizzle/postgres/client';

// Mock data
const mockUser = { id: '1', email: 'test@test.com' };
const mockUserProfile = { id: '1', userId: '1', firstName: 'Test', lastName: 'User' };

vi.mock('$lib/drizzle/postgres/client');

vi.spyOn(db.query.user, 'findFirst')
  .mockResolvedValueOnce(mockUser as {
    id: string;
    email: string;
    emailVerified: boolean;
  })
  

// Tests
describe('User functions', () => {
  afterAll(() => {
    vi.restoreAllMocks();
  });
  
  test('getUserByEmail returns user when email exists', async () => {
    const result = await getUserByEmail(mockUser.email);
    expect(result).toEqual(mockUser);
  });

  test('getUserByEmail returns undefined when email does not exist', async () => {
    const result = await getUserByEmail('nonexistent@test.com');
    expect(result).toBeUndefined();
  });

  // test('updateUserProfileData updates user profile data', async () => {
  //   const newProfileData = { ...mockUserProfile, firstName: 'Updated' };
  //   await updateUserProfileData(newProfileData);
  //   const result = await drizzleClient.query.userProfile.findFirst({ where: eq(userProfile.userId, mockUser.id) });
  //   expect(result).toEqual(newProfileData);
  // });

  // Add more tests for other functions...
});
