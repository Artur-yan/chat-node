import { prismaClient } from '$lib/server/prisma';

export const load = async ({ locals, params }) => {
	const botId = params.id;

	const webhooks = await prismaClient.webhook.findMany({
		where: {
			bot_id: botId
		}
	});

	return {
		webhooks
	};
};
