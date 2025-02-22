import type { PageServerLoad } from './$types';
import { prismaClient } from '$lib/server/prisma';

export const load: PageServerLoad = async ({ params }) => {

	const model = await prismaClient.bots.findUnique({
		where: {
			id: params.id
		}
	});

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
		areTraining: []
	};

	botsSource.forEach((item) => {
		if (item.source_type === 'url') {
			if (!modelData.urls[item.base_url]) {
				modelData.urls[item.base_url] = [];
			}
			modelData.urls[item.base_url].push(item);
			// modelData.baseUrls[item.base_url] = true;
		} else if (item.source_type === 'text') {
			modelData.texts.push(item);
		} else if (item.source_type === 'urls') {
			modelData.legacyUrls.push(item);
		} else {
			modelData.files.push(item);
		}
		if (['scraping', 'training'].includes(item.status)) {
			modelData.areTraining.push(item.s3_key);
		}
	});

	return { modelData };
};
