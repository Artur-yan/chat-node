import { prismaClient } from '$lib/server/prisma';
import { json } from '@sveltejs/kit';

async function updateVote(id: string, action: string) {
	if (action === 'like' || action === 'undislike') {
		await prismaClient.chatHistory.update({
			where: {
				id
			},
			data: {
				vote: {
					increment: 1
				}
			}
		});
	} else if (action === 'unlike' || action === 'dislike') {
		await prismaClient.chatHistory.update({
			where: {
				id
			},
			data: {
				vote: {
					decrement: 1
				}
			}
		});
	}
}

async function updateTotal(id: string, action: string) {
	if (action === 'like') {
		await prismaClient.chatConversations.update({
			where: {
				session_id: id
			},
			data: {
				likes: {
					increment: 1
				}
			}
		});
	} else if (action === 'unlike') {
		await prismaClient.chatConversations.update({
			where: {
				session_id: id
			},
			data: {
				likes: {
					decrement: 1
				}
			}
		});
	} else if (action === 'dislike') {
		await prismaClient.chatConversations.update({
			where: {
				session_id: id
			},
			data: {
				dislikes: {
					increment: 1
				}
			}
		});
	} else if (action === 'undislike') {
		await prismaClient.chatConversations.update({
			where: {
				session_id: id
			},
			data: {
				dislikes: {
					decrement: 1
				}
			}
		});
	}
}

export const PUT = async ({ request }) => {
	const { messageId, sessionId, action } = await request.json();

	await updateVote(messageId, action);
	await updateTotal(sessionId, action);

	return json({ success: true });
};
