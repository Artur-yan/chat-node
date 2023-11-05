import { prismaClient } from '$lib/server/prisma';
import { json } from '@sveltejs/kit';

export const POST = async ({ locals, request }) => {
    const session = await locals.auth.validate();

    let { s3_keys } = await request.json();

    if(!session) {
        return new Response(JSON.stringify({ status: 401 }));
    }

    const updatedDataSources = await prismaClient.botsSource.findMany({
        where: {
            s3_key: {
                in: s3_keys
            }
        }
    });

    return json(updatedDataSources);
}