import { prismaClient } from '$lib/server/prisma';

export const POST = async ({ request }) => {

        const { scrape_session_id } = await request.json();
        const trainingUrls = await prismaClient.training_urls.findUnique({
            where: {
                scrape_session_id
            }
        });
        return new Response(JSON.stringify({ trainingUrls }));

}
