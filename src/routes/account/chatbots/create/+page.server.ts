import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { redirect } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
        return {};
    }

    const subscription = await prisma.subscriptions.findUnique({
        where: {
            user_id: session.userId
        }
    })

    if(subscription?.bot_count >= subscription?.max_bot){
        throw redirect(302, "/account/chatbots")
    }
    return { };
})