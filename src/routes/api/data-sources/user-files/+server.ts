import { CB_TOKEN } from '$env/static/private';
import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals }) => {
	const { customerId, fileTypes, limit, offset } = await request.json();
	const bodyJson = JSON.stringify({
		pagination: {
			limit,
			offset
		},
		filters: {
			source: fileTypes
		}
	});

	const session = await locals.auth.validate();

	if (session) {
		try {
			const options = {
				method: 'POST',
				headers: {
					authorization: `Bearer ${CB_TOKEN}`,
					'Content-Type': 'application/json',
					'customer-id': customerId
				},
				body: bodyJson
			};

			const response = await fetch('https://api.carbon.ai/user_files_v2', options);

			const data = await response.json();
			const results = data.results;
			const count = data.count;

			return new Response(JSON.stringify({ results, count }));
		} catch (err) {
			console.error('Unexpected error:', err.message);
			return new Response(JSON.stringify({ error: 'Unexpected error' }));
		}
	}
};

export const GET = async ({ url }) => {
	const customerId = url.searchParams.get('id');
	const offset = url.searchParams.get('offset');
	const includeUrls = url.searchParams.get('url');
	const verbose = url.searchParams.get('verbose');

	let source: string[];
	if (includeUrls === 'true') {
		source = ['WEB_SCRAPE'];
	} else {
		source = ['PDF', 'TEXT', 'XLSX', 'CSV', 'DOCX', 'MD', 'RTF', 'TSV', 'PPTX', 'JSON', 'RAW_TEXT'];
	}

	const bodyJson = JSON.stringify({
		pagination: {
			limit: 250,
			offset
		},
		filters: {
			source
		}
	});

	const options = {
		method: 'POST',
		headers: {
			authorization: `Bearer ${CB_TOKEN}`,
			'Content-Type': 'application/json',
			'customer-id': customerId
		},
		body: bodyJson
	};

	try {
		const response = await fetch('https://api.carbon.ai/user_files_v2', options);

		const data = await response.json();
		const formatedData = data.results.map((item: any) => {
			return {
				id: item.id,
				name: item.name,
				source: item.source,
				created_at: item.created_at,
				updated_at: item.updated_at,
				status: item.sync_status,
				error_message: item.sync_error_message
			};
		});
		return json(verbose === 'true' ? data : formatedData);
	} catch (e) {
		console.error('Unexpected error:', e.message);
		return json({ error: 'Unexpected error' });
	}
};
