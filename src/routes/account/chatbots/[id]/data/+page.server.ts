import type { PageServerLoad } from './$types';
import { prismaClient } from '$lib/server/prisma';

export const load: PageServerLoad = async ({ params, locals }) => {
	const user = await locals.auth.validateUser();

	const model = await prismaClient.bots.findUnique({
		where: {
			id: params.id
		}
	});

	if (user.session.userId !== model.user_id) {
		return
	}

	const modelData = await prismaClient.botsSource.findMany({
		where: {
			id: model.id
		}
	});

	console.log('modelData', modelData)
	

	const baseUrls = await Array.from(new Set(modelData.map((item) => item.original_url)))
	console.log(baseUrls)

	return { modelData };



};
