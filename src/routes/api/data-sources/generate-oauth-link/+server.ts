import { CB_TOKEN } from '$env/static/private';
import { json } from '@sveltejs/kit';

// async function isWhiteLabel(botId: string) {
// 	const options = {
// 		method: 'GET',
// 		headers: { authorization: `Bearer ${CB_TOKEN}`, 'customer-id': botId }
// 	};

// 	const response = await fetch('https://api.carbon.ai/auth/v1/white_labeling', options);
// 	const data = await response.json();
// 	console.log('data', data);
// }

export const POST = async ({ request }) => {
	const { botId, service, chunkSize, chunkOverlap } = await request.json();
	console.log('botId', botId);
	console.log('service', service);
	console.log('chunkSize', chunkSize);
	console.log('chunkOverlap', chunkOverlap);

	// isWhiteLabel(botId);

	const bodyJSON = `{"service":"${service}","chunk_size":${chunkSize},"chunk_overlap":${chunkOverlap},"skip_embedding_generation":true,"embedding_model":"OPENAI_ADA_LARGE_3072", "data_source_id": 1}`;

	const options = {
		method: 'POST',
		headers: {
			authorization: `Bearer ${CB_TOKEN}`,
			'Content-Type': 'application/json',
			'customer-id': botId
		},
		body: bodyJSON
	};

	const response = await fetch('https://api.carbon.ai/integrations/oauth_url', options);
	const data = await response.json();

	console.log('data', data);
	return json(data);
};
