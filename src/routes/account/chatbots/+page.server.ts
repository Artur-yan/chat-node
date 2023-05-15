import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { prismaClient } from '$lib/server/prisma';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();

	if (!session) {
		throw redirect(302, '/');
	}

	const bots = await prismaClient.bots.findMany({
		where: {
			user_id: {
				equals: session.userId
			}
		},
		orderBy: {
			created: 'desc'
		}
	});

	const subscription = await prismaClient.subscriptions.findUnique({
		where: {
			user_id: session.userId
		}
	});

	return { bots, subscription };
};
