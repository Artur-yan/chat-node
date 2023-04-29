import type { RequestHandler } from './$types';
import { prismaClient } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, url }) => {
    let update = url.searchParams.get('update')

    // For Existing Users
    if(update == 'true') {
        let account = await prismaClient.authUser.findUnique({
            where: {
                verification_uuid: params.uuid
            }
        });

        console.log(account)

        await prismaClient.authUser.update({
            where: {
                id: account.id
            },
            data: {
                email: account.new_email,
                new_email: null,
                verification_uuid: null
            }
        });
        throw redirect(302, `/account/chatbots`);
    }
    // For new Users
    else {
        await prismaClient.authUser.update({
            where: {
                verification_uuid: params.uuid
            },
            data: {
                status: 'active',
            },
        })
        throw redirect(302, `/account/chatbots`);
    }
};