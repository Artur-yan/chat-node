import type { LayoutServerLoad } from './settings/plan/$typesypes';
import { redirect } from '@sveltejs/kit';
import { prismaClient } from '$lib/server/prisma';

export const load: LayoutServerLoad = async ({ locals }) => {
	const user = await locals.auth.validateUser();

	if (user.session) {
		const subscription = await prismaClient.subscriptions.findUnique({
			where: {
				user_id: user.user.userId
			}
		});

		const bots = await prismaClient.bots.findMany({
			where: {
				user_id: {
					equals: user.session.userId
				}
			},
			orderBy: {
				created: 'desc'
			}
		});
		return { user, subscription, bots, scripts: '' };
	} else {
		throw redirect(303, '/login');
	}
};
