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
		return;
	}

	const botsSource = await prismaClient.botsSource.findMany({
		where: {
			id: model.id
		}
	});

	let modelData = {
		urls: [],
		files: [],
		texts: [],
		legacyUrls: [],
		baseUrls: []
	};

	botsSource.forEach((item) => {
		if (item.source_type === 'url') {
			modelData.urls.push(item);
			modelData.baseUrls[item.base_url] = true;
		} else if (item.source_type === 'text') {
			modelData.texts.push(item);
		} else if (item.source_type === 'urls') {
			modelData.legacyUrls.push(item);
		} else {
			modelData.files.push(item);
		}
	});

	modelData.baseUrls = Object.keys(modelData.baseUrls);

	return { modelData };
};
