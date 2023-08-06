import { prismaClient } from '$lib/server/prisma';
import { v4 as uuidv4 } from 'uuid';

export const POST = async ({ locals }) => {
	const { user } = await locals.auth.validateUser();

	const { plan } = await prismaClient.subscriptions.findUnique({
		where: {
			user_id: user?.userId
		}
	});

	const plansWithApiFeature = [3, 4, 103, 104];

	if (!plansWithApiFeature.includes(plan)) {
		return new Response();
	}

	const apiKey = 'sk-' + uuidv4();

	try {
		await prismaClient.authUser.update({
			where: {
				id: user.userId
			},
			data: {
				api_key: apiKey
			}
		});

		return new Response(JSON.stringify({ apiKey }));
	} catch (err) {
		return new Response();
	}
};
