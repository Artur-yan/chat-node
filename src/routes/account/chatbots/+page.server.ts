import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { prismaClient } from '$lib/server/prisma';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();

	if (!session) {
		throw redirect(302, '/');
	}

	const subscription = await prismaClient.subscriptions.findUnique({
		where: {
			user_id: session.user.userId
		}
	});

	if (subscription?.plan === -1) {
		throw redirect(302, '/account/settings/subscription');
	}
};
