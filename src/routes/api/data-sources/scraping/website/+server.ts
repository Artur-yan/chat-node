import { CB_TOKEN } from '$env/static/private';
import { json } from '@sveltejs/kit';

interface ScrapeConfig {
	urls: string[];
	recursion_depth: number;
	max_pages_to_scrape: number;
	chunk_size: number;
	chunk_overlap: number;
	skip_embedding_generation: boolean;
	enable_auto_sync: boolean;
	embedding_model: string;
	tags: any;
}

interface ScrapeConfigSingleUrl extends Omit<ScrapeConfig, 'urls'> {
	url: string;
}

function transformConfigToSingleUrlList(config: ScrapeConfig): ScrapeConfigSingleUrl[] {
	return config.urls.map((url) => ({
		url,
		recursion_depth: config.recursion_depth,
		max_pages_to_scrape: config.max_pages_to_scrape,
		chunk_size: config.chunk_size,
		chunk_overlap: config.chunk_overlap,
		skip_embedding_generation: config.skip_embedding_generation,
		enable_auto_sync: config.enable_auto_sync,
		embedding_model: config.embedding_model,
		tags: config.tags
	}));
}

export const POST = async ({ request, locals }) => {
	const {
		bot_id,
		urls,
		recursionDepth,
		maxPagesToScrape,
		chunkSize,
		chunkOverlap,
		enableAutoSync,
		tags
	} = await request.json();

	console.log('tags ---->', tags);

	const listOfConfigsWithSingleUrl = transformConfigToSingleUrlList({
		urls: urls,
		recursion_depth: recursionDepth,
		max_pages_to_scrape: maxPagesToScrape,
		chunk_size: chunkSize,
		chunk_overlap: chunkOverlap,
		skip_embedding_generation: false,
		enable_auto_sync: enableAutoSync,
		embedding_model: 'OPENAI_ADA_LARGE_3072',
		tags: tags
	});

	const session = await locals.auth.validate();

	if (session) {
		const options = {
			method: 'POST',
			headers: {
				authorization: `Bearer ${CB_TOKEN}`,
				'Content-Type': 'application/json',
				'customer-id': bot_id
			},
			body: JSON.stringify(listOfConfigsWithSingleUrl)
		};

		const response = await fetch('https://api.carbon.ai/web_scrape', options)
			.then((response) => response.json())
			.catch((err) => console.error(err));

		console.log(response);

		return json(response);
	} else {
		return new Response(JSON.stringify({ status: 401 }));
	}
};
