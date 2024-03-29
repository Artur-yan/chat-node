import { SUPPORT_PASSCODE } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
let prismaClient = new PrismaClient();

export const GET = async ({ url }) => {
	const passcode = url.searchParams.get('passcode') as string;

	if (passcode !== SUPPORT_PASSCODE) {
		return json({ error: 'Invalid passcode' });
	}

	const botId = url.searchParams.get('botId') as string;

	const bot = await prismaClient.bots.findMany({
		where: {
			id: botId
		}
	});

	if (bot.length === 0) {
		return json({ error: 'Bot not found' });
	}

	return json({ bot });
};
