import { prismaClient } from '$lib/server/prisma';

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) return;

	try {
		const subscription = await prismaClient.subscriptions.findUnique({
			where: {
				user_id: session.userId
			}
		});

		return { session, subscription };
	} catch (err) {
		console.error(err);
	}
};
