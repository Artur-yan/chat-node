import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { prismaClient } from '$lib/server/prisma';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();

	if (!session) {
		throw redirect(302, '/');
	}
};
