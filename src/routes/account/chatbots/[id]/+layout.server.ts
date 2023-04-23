import { PrismaClient } from '@prisma/client';
import { redirect } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const load = async ({ locals, params }) => {
    const model = await prisma.bots.findUnique({
        where: {
            id: params.id
        }
    });

    const user = await locals.auth.validateUser();

    if(user.session && model && user.session.userId === model.user_id) {
        return { model };
    } else if (user.session) {
        throw redirect(303, '/account/chatbots');
    } else {
        throw redirect(303, '/login');
    }
};    