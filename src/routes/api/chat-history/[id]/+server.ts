import { prismaClient } from '$lib/server/prisma';

export const GET = async ({ params }) => {
	const chatHistory = await prismaClient.chatHistory.findMany({
		where: {
			session_id: params.id
		},
		orderBy: {
			created_at: 'asc'
		}
	});

	return new Response(JSON.stringify(chatHistory), { status: 200 });
};
