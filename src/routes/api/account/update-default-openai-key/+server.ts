import { prismaClient } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';

export const POST = async ({ locals, request }) => {
	const session = await locals.auth.validate();

	const { key } = await request.json();

	try {
		await prismaClient.authUser.update({
			where: {
				id: session.user.userId
			},
			data: {
				default_openai_key: key
			}
		});

		return new Response();
	} catch (err) {
		console.error(err);
		throw error(500, 'There was an error');
	}
};
