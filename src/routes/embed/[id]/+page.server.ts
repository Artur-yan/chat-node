import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const load: PageServerLoad = async ({ params }) => {
	try {
		const bot = await prisma.bots.findUniqueOrThrow({
			where: {
				id: params.id
			}
		});
		return { bot };
	} catch (err) {
		if (err.code == 'P2025') {
			throw error(400, 'Bot not found');
		} else {
			throw error(500, 'Unknown error occurred');
		}
	}
};
