import type { PageServerLoad } from './$types';
import { prismaClient } from '$lib/server/prisma';

export const load: PageServerLoad = async ({ params, locals }) => {
	const user = await locals.auth.validateUser();

	const model = await prismaClient.bots.findUnique({
		where: {
			id: params.id
		}
	});

	let modelData;

	if (user.session.userId === model.user_id) {
		modelData = prismaClient.botsSource.findMany({
			where: {
				id: model.id
			}
		});
	}


	return { modelData };
};
