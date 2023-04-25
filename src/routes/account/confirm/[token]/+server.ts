import type { RequestHandler } from './$types';


import { prismaClient } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
    await prismaClient.authUser.update({
        where: {
            id: params.token
        },
        data: {
            status: 'active'
        }
    })
    throw redirect(302, `/account/chatbots`);
};