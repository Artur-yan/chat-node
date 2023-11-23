import { prismaClient } from '$lib/server/prisma';
import { v4 as uuidv4 } from 'uuid';
import tiersMap from '$lib/data/tiers.js';

export const POST = async ({ locals }) => {
	const session = await locals.auth.validate();

	const { plan } = await prismaClient.subscriptions.findUnique({
		where: {
			user_id: session.user.userId
		}
	});

	if (!tiersMap[plan].features?.chatnode_api?.included) {
		return new Response();
	}

	const apiKey = 'sk-' + uuidv4();

	try {
		await prismaClient.authUser.update({
			where: {
				id: session.user.userId
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
