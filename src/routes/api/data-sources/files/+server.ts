import { CB_TOKEN } from '$env/static/private';
import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals }) => {
	const form = await request.formData();

	const session = await locals.auth.validate();
	console.log(form);
	const file = form.get('file');
	const bot_id = form.get('bot_id');
	const chunkSize = form.get('chunkSize');
	const chunkOverlap = form.get('chunkOverlap');

	//Assuming 'files' is an array of File objects
	const form_tmp = new FormData();

	form_tmp.append('file', file);

	console.log(form_tmp);
	if (session) {
		const options = {
			method: 'POST',
			headers: { authorization: `Bearer ${CB_TOKEN}`, 'customer-id': bot_id },
			body: form
		};

		const use_ocr = file.type === 'application/pdf'; // * assumses 1 file upload at a time

		const response = await fetch(
			`https://api.carbon.ai/uploadfile?chunk_size=${chunkSize}&chunk_overlap=${chunkOverlap}&skip_embedding_generation=false&embedding_model=OPENAI_ADA_LARGE_3072&useOCR=${use_ocr}`,
			options
		)
			.then((response) => response.json())
			.catch((err) => console.error('FROM source --->', err));

		console.log('Response --->', response);

		return json(response);
	} else {
		return new Response(JSON.stringify({ status: 401 }));
	}
};
