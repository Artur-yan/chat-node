import { prismaClient } from '$lib/server/prisma';
import { fail } from '@sveltejs/kit';
import tiersMap from '$lib/data/tiers.js';

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) return;

	console.log('session', session);

	try {
		return { session };
	} catch (err) {
		console.error(err);
	}
};