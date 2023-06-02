import { prismaClient } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();
	const user = await locals.auth.validateUser();

	if (!session) {
		throw redirect(302, '/login');
	} else if (user.user?.status !== 'active') {
		throw redirect(302, '/account/chatbots');
	}

	const subscription = await prismaClient.subscriptions.findUnique({
		where: {
			user_id: session.userId
		}
	});

	if (subscription?.bot_count >= subscription?.max_bot) {
		throw redirect(302, '/account/chatbots');
	}
	return {
		subscription
	};
};
