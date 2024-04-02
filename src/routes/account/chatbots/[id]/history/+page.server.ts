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

	const messages = await prismaClient.chatHistory.count({
		where: {
			bot_id: params.id,
			created_at: {
				gt: historyStartDate
			}
			// message: {
			// 	path: ['type'],
			// 	equals: 'human'
			// }
		},
		orderBy: {
			created_at: 'asc'
		}
	});

	const numberOfChats = chats.length;
	const averageMessagesPerChat = numberOfChats > 0 ? messages / numberOfChats : 0;
	const safeAverage = isNaN(averageMessagesPerChat) ? 0 : averageMessagesPerChat;

	const numberOfLikes = chats.reduce((acc, chat) => acc + (chat.likes || 0), 0);
	const numberOfDislikes = chats.reduce((acc, chat) => acc + (chat.dislikes || 0), 0);

	const supportHoursSaved = messages / 2 / 60;
	const hours = Math.floor(supportHoursSaved);
	const minutes = Math.round((supportHoursSaved - hours) * 60);
	const supportHoursSavedFormated = `${hours} Hours ${minutes} Mins`;

	return {
		chats,
		messages,
		numberOfChats,
		supportHoursSavedFormated,
		safeAverage,
		numberOfLikes,
		numberOfDislikes
	};
};
