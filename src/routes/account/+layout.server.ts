import type { LayoutServerLoad } from './settings/plan/$typesypes';
import { redirect } from '@sveltejs/kit';
import { prismaClient } from '$lib/server/prisma';

export const load: LayoutServerLoad = async ({ locals }) => {
	const user = await locals.auth.validateUser();
	console.log(user)

	const subscription = await prismaClient.subscriptions.findUnique({
		where: {
			user_id: user.user.userId
		}
	});

	if (user.session) {
		return { user, subscription };
	} else {
		throw redirect(303, '/login');
	}
};
