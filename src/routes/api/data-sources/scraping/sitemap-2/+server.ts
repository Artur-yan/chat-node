import { CB_TOKEN } from '$env/static/private';
import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals }) => {
	console.log('hitting new route!!!!');
	const { bot_id, sitemapUrl, maxPagesToScrape } = await request.json();

	const session = await locals.auth.validate();

	const jsonBody = `{"url":"${sitemapUrl}","tags":{},"max_pages_to_scrape":${maxPagesToScrape},"chunk_size":400,"chunk_overlap":20,"skip_embedding_generation":false,"enable_auto_sync":true,"generate_sparse_vectors":false,"prepend_filename_to_chunks":true,"embedding_model":"OPENAI_ADA_LARGE_3072"}`;

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
		console.log('response', response);
		const data = await response.json();
		console.log('data', data);
		return json(data);
	} else {
		return new Response(JSON.stringify({ status: 401 }));
	}
};
