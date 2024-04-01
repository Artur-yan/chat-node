import { CB_TOKEN } from '$env/static/private';
import { json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
	const { botId } = await request.json();
	console.log('botId', botId);

	const bodyJSON = `{"service":"NOTION","chunk_size":123,"chunk_overlap":123,"skip_embedding_generation":true,"embedding_model":"OPENAI"}`;

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

// notion.so/install-integration?response_type=code&client_id=a9d28aca-5006-4071-8e06-86411c9ee8bc&redirect_uri=https%3A%2F%2Fintegrations.chatnode.ai%2Fintegrations%2Fnotion&owner=user
// https://www.notion.so/install-integration?response_type=code&client_id=a9d28aca-5006-4071-8e06-86411c9ee8bc&redirect_uri=https%3A%2F%2Fapi.carbon.ai%2Fintegrations%2Fnotion&state=Z0FBQUFBQm1DdjhmSlVJNUFrVVp6YW1nclhUMldqM0hqT1ROQWlCYXdnVENGYUZKd3JxWFV6MnB3dDZlTk04S3RRZTFKUnU3SVRBVXpRUHI2eFQtcGl4d2FjRGNQaG96Q1E9PQ%3D%3D
