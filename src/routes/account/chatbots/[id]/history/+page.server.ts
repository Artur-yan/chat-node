import { prismaClient } from '$lib/server/prisma';
import tiersMap from '$lib/data/tiers.js';

export const load = async ({ locals, params }) => {
	const session = await locals.auth.validate();

	const { plan } = await prismaClient.subscriptions.findFirst({
		where: {
			user_id: session.user.userId
		}
	});

	let historyLengthDays = tiersMap[plan].history_length_days || 1;

	const today = new Date();
	const historyStartDate = new Date(today.setDate(today.getDate() - historyLengthDays));

	const chats = await prismaClient.chatConversations.findMany({
		where: {
			bot_id: params.id,
			created_at: {
				gt: historyStartDate
			}
		},
		orderBy: {
			created_at: 'desc'
		}
	});

	return {
		chats
	};
};
