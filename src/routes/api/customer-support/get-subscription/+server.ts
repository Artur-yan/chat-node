import { SUPPORT_PASSCODE } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
let prismaClient = new PrismaClient();

export const GET = async ({ url }) => {
	const passcode = url.searchParams.get('passcode') as string;

	if (passcode !== SUPPORT_PASSCODE) {
		return json({ error: 'Invalid passcode' });
	}

	const userId = url.searchParams.get('userId') as string;

	if (!userId) {
		return json({ error: 'User ID is required' });
	}

	const subscription = await prismaClient.subscriptions.findMany({
		where: {
			user_id: userId
		}
	});

	if (subscription.length === 0) {
		return json({ error: 'Subscription not found' });
	}

	return json({ subscription });
};
