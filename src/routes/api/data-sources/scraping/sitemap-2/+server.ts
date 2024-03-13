import { CB_TOKEN } from '$env/static/private';
import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals }) => {
	const { bot_id, sitemapUrl, maxPagesToScrape, chunkSize, chunkOverlap, enableAutoSync } =
		await request.json();

	const session = await locals.auth.validate();

	const jsonBody = `{"url":"${sitemapUrl}","tags":{},"max_pages_to_scrape":${maxPagesToScrape},"chunk_size":${chunkSize},"chunk_overlap":${chunkOverlap},"skip_embedding_generation":false,"enable_auto_sync":${enableAutoSync},"generate_sparse_vectors":false,"embedding_model":"OPENAI_ADA_LARGE_3072"}`;
	//"prepend_filename_to_chunks":true,

	if (session) {
		const options = {
			method: 'POST',
			headers: {
				authorization: `Bearer ${CB_TOKEN}`,
				'Content-Type': 'application/json',
				'customer-id': bot_id
			},
			body: jsonBody
		};

		const response = await fetch('https://api.carbon.ai/scrape_sitemap', options);
		const data = await response.json();
		return json(response);
	} else {
		return new Response(JSON.stringify({ status: 401 }));
	}
};
