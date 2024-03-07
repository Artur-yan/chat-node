import { CB_TOKEN } from '$env/static/private';

export const POST = async ({ request, locals }) => {
	const { bot_id, fileId } = await request.json();

	const session = await locals.auth.validate();

	if (session) {
		const options = {
			method: 'POST',
			headers: {
				authorization: `Bearer ${CB_TOKEN}`,
				'Content-Type': 'application/json',
				'customer-id': bot_id
			},
			body: `{"include_raw_file":true,"filters":{"ids":[${fileId}]}}`
		};

		const response = await fetch('https://api.carbon.ai/user_files_v2', options);
		const data = await response.json();

		const file = data.results[0];
		const title = file.name;
		const presignedUrl = file.presigned_url;
		const presignedResponse = await fetch(presignedUrl);
		const presignedText = await presignedResponse.text();

		return new Response(
			JSON.stringify({
				status: 200,
				id: fileId,
				name: title,
				text: presignedText
			})
		);
	} else {
		return new Response(JSON.stringify({ status: 401 }));
	}
};
