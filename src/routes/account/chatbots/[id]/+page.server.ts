import type { PageServerLoad } from './$types';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const load: PageServerLoad = async ({ params }) => {

	const model = await prisma.bots.findUnique({
		where: {
			id: params.id
		}
	});

	return { model };
};
