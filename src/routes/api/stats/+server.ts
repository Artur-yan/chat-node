import { PrismaClient } from '@prisma/client';
import { json } from '@sveltejs/kit';
let prismaClient = new PrismaClient();

export const POST = async ({ request, locals }) => {
	const session = await locals.auth.validate();

	if (session) {
		try {
			const { botId, timeSpan } = await request.json();
			let historyStartDate;

			if (timeSpan === 'Last 24 Hours') {
				historyStartDate = new Date();
				historyStartDate.setHours(historyStartDate.getHours() - 24);
			} else if (timeSpan === 'Last 7 Days') {
				historyStartDate = new Date();
				historyStartDate.setDate(historyStartDate.getDate() - 7);
			} else if (timeSpan === 'Last 30 Days') {
				historyStartDate = new Date();
				historyStartDate.setDate(historyStartDate.getDate() - 30);
			}

			const chats = await prismaClient.chatConversations.findMany({
				where: {
					bot_id: botId,
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
					bot_id: botId,
					created_at: {
						gt: historyStartDate
					}
				},
				orderBy: {
					created_at: 'asc'
				}
			});

			const numberOfChats = chats.length;
			const averageMessagesPerChat = numberOfChats > 0 ? messages / numberOfChats : 0;
			const numberOfLikes = chats.reduce((acc, chat) => acc + (chat.likes || 0), 0);
			const numberOfDislikes = chats.reduce((acc, chat) => acc + (chat.dislikes || 0), 0);

			const supportHoursSaved = messages / 2 / 60;
			const hours = Math.floor(supportHoursSaved);
			const minutes = Math.round((supportHoursSaved - hours) * 60);
			const supportHoursSavedFormated = `${hours} Hours ${minutes} Mins`;

			return json({
				chats,
				messages,
				numberOfChats,
				supportHoursSavedFormated,
				averageMessagesPerChat,
				numberOfLikes,
				numberOfDislikes
			});
		} catch (err) {
			console.error('Unexpected error:', err.message);
			return new Response(JSON.stringify({ error: 'Unexpected error' }));
		}
	}
};
