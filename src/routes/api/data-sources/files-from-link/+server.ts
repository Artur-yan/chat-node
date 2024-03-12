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

	const jsonData = JSON.stringify({
		url: presigned_url,
		file_name: fileName,
		chunk_size: chunkSize,
		chunk_overlap: chunkOverlap,
		skip_embedding_generation: true,
		set_page_as_boundary: true,
		embedding_model: 'OPENAI_ADA_LARGE_3072',
		// generate_sparse_vectors: true,
		// use_textract: true,
		prepend_filename_to_chunks: true,
		max_items_per_chunk: 123
	});

	//NOTE: leaving out the 'use_ocr' field for now

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

		const use_ocr = fileType === 'pdf'; // * assumses 1 file upload at a time

		const response = await fetch(`https://api.carbon.ai/upload_file_from_url`, options);

		const responseData = await response.json();
		console.log('Data --->', responseData);

		return json(response);
	} else {
		return new Response(JSON.stringify({ status: 401 }));
	}
};
