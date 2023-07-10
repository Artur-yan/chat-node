import { redirect } from '@sveltejs/kit';
import { prismaClient } from '$lib/server/prisma';
import { currentBot } from '$lib/stores.js';

export const load = async ({ locals, params }) => {
	const user = await locals.auth.validateUser();

	const model = await prismaClient.bots.findUnique({
		where: {
			id: params.id
		}
	});


	if (user.session && model && user.session.userId === model.user_id) {
		currentBot.set(model);
		return { model, user };
	} else if (user.session) {
		throw redirect(303, '/account/chatbots');
	} else {
		throw redirect(303, '/login');
	}
};