import { CB_TOKEN } from '$env/static/private';
import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals }) => {
	const { bot_id, text, title, chunkSize, chunkOverlap, fileId } = await request.json();

	const session = await locals.auth.validate();

	if (session) {
		const options = {
			method: 'POST',
			headers: {
				authorization: `Bearer ${CB_TOKEN}`,
				'Content-Type': 'application/json',
				'customer-id': bot_id
			},
			body: JSON.stringify({
				contents: text,
				name: title,
				overwrite_file_id: fileId,
				chunk_size: chunkSize,
				chunk_overlap: chunkOverlap,
				skip_embedding_generation: false,
				embedding_model: 'OPENAI_ADA_LARGE_3072'
			})
		};

		const response = await fetch('https://api.carbon.ai/upload_text', options)
			.then((response) => response.json())
			.catch((err) => console.error(err));

		console.log(response);
		return json(response);
	} else {
		return new Response(JSON.stringify({ status: 401 }));
	}
};
