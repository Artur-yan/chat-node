import { prismaClient } from '$lib/server/prisma';

export const load = async ({ params }) => {
    
    const chats = prismaClient.chatHistory.findMany({
        where: {
            bot_id: params.id
        },
        orderBy: {
            created_at: 'desc'
        }
    });
    return {
        chats
    };
};