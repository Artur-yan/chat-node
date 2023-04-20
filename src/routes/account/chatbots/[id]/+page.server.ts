import type { PageServerLoad } from './$types';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const load: PageServerLoad = async ({ params, locals }) => {
	const session = await locals.auth.validate();

	const model = await prisma.bots.findUnique({
		where: {
			id: params.id
		}
	});

	return { model };
};
