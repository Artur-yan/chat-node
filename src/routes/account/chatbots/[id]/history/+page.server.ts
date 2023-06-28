import { prismaClient } from '$lib/server/prisma';

export const load = async ({ params }) => {
    
    const chats = await prismaClient.chatHistory.groupBy({
        by: ['session_id'],
        where: {
            bot_id: params.id
        }
    });

    return {
        chats
    };
};