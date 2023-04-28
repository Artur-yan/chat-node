import type { RequestHandler } from './$types';


import { prismaClient } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
    await prismaClient.authUser.update({
        where: {
            verification_uuid: params.uuid
        },
        data: {
            status: 'active'
        }
    })
    throw redirect(302, `/account/chatbots`);
};