import { prismaClient } from '$lib/server/prisma';

export const GET = async ({ params }) => {
	const botId = params.id;

	const bot = await prismaClient.bots.findUnique({
		where: {
			id: botId
		}
	});

	if (bot) {
		return new Response(
			String(`
		`)
		);
	} else {
		return {
			status: 404,
			body: {
				error: 'Bot not found'
			}
		};
	}
};
