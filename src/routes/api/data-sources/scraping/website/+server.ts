import { CB_TOKEN } from '$env/static/private';
import { json } from '@sveltejs/kit';

interface ScrapeConfig {
	urls: string[];
	recursionDepth: number;
	maxPagesToScrape: number;
	chunkSize: number;
	chunkOverlap: number;
	skipEmbeddingGeneration: boolean;
	enableAutoSync: boolean;
	embeddingModel: string;
}

interface ScrapeConfigSingleUrl extends Omit<ScrapeConfig, 'urls'> {
	url: string;
}

function transformConfigToSingleUrlList(config: ScrapeConfig): ScrapeConfigSingleUrl[] {
	return config.urls.map((url) => ({
		url,
		recursionDepth: config.recursionDepth,
		maxPagesToScrape: config.maxPagesToScrape,
		chunkSize: config.chunkSize,
		chunkOverlap: config.chunkOverlap,
		skipEmbeddingGeneration: config.skipEmbeddingGeneration,
		enableAutoSync: config.enableAutoSync,
		embeddingModel: config.embeddingModel
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
		enableAutoSync
	} = await request.json();

	const listOfConfigsWithSingleUrl = transformConfigToSingleUrlList({
		urls: urls,
		recursionDepth: recursionDepth,
		maxPagesToScrape: maxPagesToScrape,
		chunkSize: chunkSize,
		chunkOverlap: chunkOverlap,
		skipEmbeddingGeneration: false,
		enableAutoSync: enableAutoSync,
		embeddingModel: 'OPENAI_ADA_LARGE_3072'
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

}
