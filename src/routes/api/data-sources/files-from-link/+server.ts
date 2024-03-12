import { CB_TOKEN } from '$env/static/private';
import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals }) => {
	const session = await locals.auth.validate();
	const data = await request.json();

	const bot_id = data.bot_id;
	const chunkSize = data.chunk_size;
	const chunkOverlap = data.chunk_overlap;
	const presigned_url = data.url;
	const fileName = data.file_name;
	const fileType = data.file_type;

	//NOTE: leaving out the 'use_ocr' field for now
	// const use_ocr = fileType === 'pdf'; // * assumses 1 file upload at a time

	const jsonData = JSON.stringify({
		url: presigned_url,
		file_name: fileName,
		chunk_size: chunkSize,
		chunk_overlap: chunkOverlap,
		skip_embedding_generation: false,
		embedding_model: 'OPENAI_ADA_LARGE_3072'
		// generate_sparse_vectors: true,
		// use_textract: true,
	});

	if (session) {
		const options = {
			method: 'POST',
			headers: {
				authorization: `Bearer ${CB_TOKEN}`,
				'customer-id': bot_id,
				'Content-Type': 'application/json'
			},
			body: jsonData
		};

		const response = await fetch(`https://api.carbon.ai/upload_file_from_url`, options);
		const responseData = await response.json();

		return json(responseData);
	} else {
		return new Response(JSON.stringify({ status: 401 }));
	}
};
