import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) return;

	try {
		const subscription = await prisma.subscriptions.findUnique({
			where: {
				user_id: session.userId
			}
		});

		return { session, subscription };
	} catch (err) {
		console.error(err);
	}
};
