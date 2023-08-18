import { prismaClient } from '$lib/server/prisma';

export const load = async ({ locals, params }) => {
	const user = await locals.auth.validateUser();

	const { plan } = await prismaClient.subscriptions.findFirst({
		where: {
			user_id: user.session.userId
		}
	});

	let historyLengthDays = 1;

	switch (plan) {
		case 1 || 101:
			historyLengthDays = 3;
		case 2 || 102:
			historyLengthDays = 7;
		case 3 || 103:
			historyLengthDays = 30;
		case 4 || 104:
			historyLengthDays = 45;
	}

	const chats = await prismaClient.chatConversations.findMany({
		where: {
			bot_id: params.id,
		},
		orderBy: {
			created_at: 'desc'
		}
	});

	return {
		chats
	};
};
