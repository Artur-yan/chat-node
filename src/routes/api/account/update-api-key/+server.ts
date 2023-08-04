import { prismaClient } from '$lib/server/prisma';

export const POST = async ({ locals, request }) => {
	const { user } = await locals.auth.validateUser();
	const { apiKey } = await request.json();

	console.log(apiKey);

	try {
		await prismaClient.authUser.update({
			where: {
				id: user.userId
			},
			data: {
				api_key: apiKey
			}
		});

	} catch (err) {
		console.error(err);
	}

	return new Response();
};
