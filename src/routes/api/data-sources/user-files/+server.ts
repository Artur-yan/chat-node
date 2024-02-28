import { CB_TOKEN } from '$env/static/private';

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
			const count = data.results.length;

			return new Response(JSON.stringify({ results, count }));
		} catch (err) {
			console.error('Unexpected error:', err.message);
			return new Response(JSON.stringify({ error: 'Unexpected error' }));
		}
	}
};
