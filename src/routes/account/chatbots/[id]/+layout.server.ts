import { redirect } from '@sveltejs/kit';
import { prismaClient } from '$lib/server/prisma';
import { currentBot } from '$lib/stores.js';

export const load = async ({ locals, params }) => {
	const session = await locals.auth.validate();


	const model = await prismaClient.bots.findUnique({
		where: {
			id: params.id
		}
	});

	if (session && model && session.user.userId === model.user_id) {
		currentBot.set(model);
		return { model, session };
	} else if (session) {
		throw redirect(303, '/account/chatbots');
	} else {
		throw redirect(303, '/login');
	}
};
