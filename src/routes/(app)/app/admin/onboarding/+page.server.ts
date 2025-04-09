// src/routes/(app)/app/admin/onboarding/+page.server.ts

import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/drizzle/postgres/client';
import { employee, userProfile, user } from '$lib/drizzle/postgres/schema';
import { eq, and, isNotNull, isNull } from 'drizzle-orm';

// Define what an "onboarding employee" looks like in the DB
// Assumption: An employee is onboarding if they have an associated user account,
// but that user's email is not yet verified. Adjust the query logic if your
// definition of "onboarding" is different (e.g., a specific status field).
async function getOnboardingEmployees(clientId: string) {
    try {
        // Find employees linked to users whose email isn't verified yet
        // Or perhaps employees who don't have a user linked yet (if that's part of onboarding)
        // This example focuses on unverified emails for linked users.
        const results = await db.select({
            id: employee.id,
            firstName: employee.firstName,
            lastName: employee.lastName,
            created: employee.created,
            email: user.email, // Get email from the user table
            emailVerified: user.emailVerified,
            userId: user.id,
        })
        .from(employee)
        // Left join in case an employee record exists but the user/profile link isn't fully established yet
        .leftJoin(userProfile, eq(employee.id, userProfile.id))
        .leftJoin(user, eq(userProfile.userId, user.id))
        .where(and(
            eq(employee.clientId, clientId),
            isNull(employee.deleted), // Ensure employee is not deleted
            isNotNull(user.id), // Ensure there is a linked user
            eq(user.emailVerified, false) // The core "onboarding" condition in this example
        ))
        .orderBy(employee.created); // Order by creation date, for example

        // We use structuredClone to safely pass Date objects
        return structuredClone(results);
    } catch (err) {
        console.error("Error fetching onboarding employees:", err);
        // Depending on requirements, you might want to return an empty array or throw
        return [];
    }
}


export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || !locals.user.profile) {
        redirect(302, '/auth/login');
    }

    const profile = locals.user.profile;

    // Authorization check: Ensure only specific roles can access this admin page
    if (!['super_admin', 'org_admin'].includes(profile.role)) {
        error(403, { message: 'Forbidden: You do not have permission to access this page.' });
    }

    if (!profile.clientId) {
         error(500, { message: 'Server Error: Client ID not found for user.' });
    }

    const clientId = profile.clientId;

    try {
        const onboardingEmployees = await getOnboardingEmployees(clientId);

        return {
            employees: onboardingEmployees,
        };
    } catch (err) {
        console.error("Failed to load onboarding page data:", err);
        error(500, { message: 'Failed to load onboarding employee data.' });
    }
};

