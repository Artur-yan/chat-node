import { prismaClient } from '$lib/server/prisma';

export const POST = async ({ locals, request }) => {
	const { id } = await request.json();
	const session = await locals.auth.validate();

	if (session) {
		let bot = await prismaClient.bots.findUnique({
			where: {
				id
			}
		});
		return new Response(JSON.stringify({ status: bot?.status }));
	} else {
		return new Response(JSON.stringify({ status: 401 }));
	}
};
