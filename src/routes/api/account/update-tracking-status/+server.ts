import { prismaClient } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';

export const POST = async ({ locals }) => {
	const session = await locals.auth.validate();

	try {
		await prismaClient.authUser.update({
			where: {
				id: session.user.userId
			},
			data: {
				tracking_status: true
			}
		});

		return new Response();
	} catch (err) {
		console.error(err);
		throw error(500, 'There was an error');
	}
};
