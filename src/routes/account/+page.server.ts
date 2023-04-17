import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const load = async ({locals}) => {
	const session = await locals.auth.validate();
	if(!session) return;

	try {
		const plan = await prisma.authUser.findUnique({
			where: {
				id: session.userId
			},
			select: {
				current_plan: true
			}
		});

		return {session, plan};

	} catch (err) {
		console.error(err);
	}


};
