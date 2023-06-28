import { prismaClient } from "$lib/server/prisma";


export const GET = async ({ params }) => {
    const chatHistory = await prismaClient.chatHistory.findMany({
        where: {
            session_id: params.id
        }
    })

    console.log(chatHistory)

    return new Response(JSON.stringify(chatHistory), { status: 200 })
}