import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();

	if(!session) {
		throw redirect ( 302, '/' );
	}

	const bots = await prisma.bots.findMany({
		where: {
			user_id: {
				equals: session.userId
			}
		},
		orderBy: {
			created: 'desc'
		}
	});

	const subscription = await prisma.subscriptions.findUnique({
		where: {
			user_id: session.userId
		}
	});

	return { bots, subscription };
};
