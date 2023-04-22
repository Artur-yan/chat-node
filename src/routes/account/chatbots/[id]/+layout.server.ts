import { PrismaClient } from '@prisma/client';
import { error } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const load = async ({ locals, params }) => {
    const model = await prisma.bots.findUnique({
        where: {
            id: params.id
        }
    });

    const user = await locals.auth.validateUser();

    console.log(user)

    if(user.session && user.session.userId === model.user_id) {
        return { model };
    } else {
        throw error( 403,
           { message: 'You are not authorized to view this page.'}
        )
    }
};    