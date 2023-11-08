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
		},
		orderBy: {
			created_at: 'desc'
		}
	});

	let modelData = {
		urls: {},
		files: [],
		texts: [],
		legacyUrls: [],
		urlsInTrainingS3Keys: []
	};

	botsSource.forEach((item) => {
		if (item.source_type === 'url') {
			if (!modelData.urls[item.base_url]) {
				modelData.urls[item.base_url] = [];
			}
			modelData.urls[item.base_url].push(item);
			if (['scraping', 'training'].includes(item.status)) {
				modelData.urlsInTrainingS3Keys.push(item.s3_key);
			}
			// modelData.baseUrls[item.base_url] = true;
		} else if (item.source_type === 'text') {
			modelData.texts.push(item);
		} else if (item.source_type === 'urls') {
			modelData.legacyUrls.push(item);
		} else {
			modelData.files.push(item);
		}
	});

	return { modelData };
};
