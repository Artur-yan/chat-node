import { CB_TOKEN } from '$env/static/private';

export const POST = async ({ request, locals }) => {
	const { customerId } = await request.json();
	const session = await locals.auth.validate();

	const bodyJson = JSON.stringify({
		pagination: {
			limit: 1,
			offset: 0
		},
		filters: {
			source: [
				'PDF',
				'TEXT',
				'XLSX',
				'CSV',
				'DOCX',
				'MD',
				'RTF',
				'TSV',
				'PPTX',
				'JSON',
				'RAW_TEXT',
				'NOTION'
			]
		}
	});

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
			const count = data.count || 0;

			return new Response(JSON.stringify({ count }));
		} catch (err) {
			console.error('Unexpected error:', err.message);
			return new Response(JSON.stringify({ error: 'Unexpected error' }));
		}
	}
};
