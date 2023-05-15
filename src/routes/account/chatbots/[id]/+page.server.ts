import type { PageServerLoad } from './$types';
import { prismaClient } from '$lib/server/prisma';

export const load: PageServerLoad = async ({ params }) => {
	const model = await prismaClient.bots.findUnique({
		where: {
			id: params.id
		}
	});

	return { model };
};
