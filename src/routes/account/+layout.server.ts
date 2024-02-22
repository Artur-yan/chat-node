import { redirect } from '@sveltejs/kit';
import { prismaClient } from '$lib/server/prisma';

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) {
		const [subscription, bots] = await prismaClient.$transaction([
			prismaClient.subscriptions.findUnique({
				where: {
					user_id: session.user.userId
				}
			}),
			prismaClient.bots.findMany({
				where: {
					user_id: {
						equals: session.user.userId
					}
				},
				orderBy: {
					name: 'asc'
				}
			})
		]);

		return { user: session.user, subscription, bots, scripts: '', session: session };
	} else {
		throw redirect(303, '/login');
	}
};
