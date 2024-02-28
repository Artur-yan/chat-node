import { CB_TOKEN } from '$env/static/private';

export const POST = async ({ request, locals }) => {
	const { customerId, fileId } = await request.json();

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
				body: `{"file_ids":[${fileId}]}`
			};

			const response = await fetch('https://api.carbon.ai/delete_files', options);

			const data = await response.json();

			return new Response(JSON.stringify({ data }));
		} catch (err) {
			console.error('Unexpected error:', err.message);
			return new Response(JSON.stringify({ error: 'Unexpected error' }));
		}
	}
};
