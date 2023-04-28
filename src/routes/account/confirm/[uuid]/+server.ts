import type { RequestHandler } from './$types';
import { prismaClient } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, url }) => {
    if(url.searchParams.get('update')) {
        await prismaClient.authUser.update({
            where: {
                verification_uuid: params.uuid
            },
            data: {
                email: user,
                new_email: null,
                verification_uuid: null
            }
        });
        throw redirect(302, `/account/chatbots`);
    }
    await prismaClient.authUser.update({
        where: {
            verification_uuid: params.uuid
        },
        data: {
            status: 'active',
        },
    })
    throw redirect(302, `/account/chatbots`);
};