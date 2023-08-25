import { prismaClient } from '$lib/server/prisma';
import { json } from '@sveltejs/kit';

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

export const POST = async ({ params, request }) => {
	const { bot_id, user_id, endUserInfo } = await request.json();

	const chatHistory = await prismaClient.chatConversations.create({
		data: {
			session_id: params.id,
			bot_id,
			user_id,
			enduser_name: endUserInfo.name,
			enduser_email: endUserInfo.email,
			enduser_phone: endUserInfo.phone
		}
	});

	return json({ success: true });
};
