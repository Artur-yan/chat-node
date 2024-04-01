import { CB_TOKEN } from '$env/static/private';
import { json } from '@sveltejs/kit';

async function isWhiteLabel(botId: string) {
	const options = {
		method: 'GET',
		headers: { authorization: `Bearer ${CB_TOKEN}`, 'customer-id': botId }
	};

	const response = await fetch('https://api.carbon.ai/auth/v1/white_labeling', options);
	const data = await response.json();
	console.log('data', data);
}

export const POST = async ({ request }) => {
	const { botId } = await request.json();
	console.log('botId', botId);
	isWhiteLabel(botId);

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

// https://www.notion.so/install-integration?response_type=code&client_id=3ba2da6c-b5d9-44c2-802f-03b5465a8349&redirect_uri=https%3A%2F%2Fintegrations.chatnode.ai%2Fintegrations%2Fnotion&owner=user
// https://www.notion.so/install-integration?response_type=code&client_id=3ba2da6c-b5d9-44c2-802f-03b5465a8349&redirect_uri=https%3A%2F%2Fintegrations.chatnode.ai%2Fintegrations%2Fnotion&owner=user&state=Z0FBQUFBQm1Dd2tWVlBselM0Vllhb0R6REQtOUZuRWpsdERBNFQ0NHF3Skh1YnFHRjE3TlZHMlJrNzY0b3FBU0VJSlNaN01paUpNb1Nsbld4bDBDSHVzeGM5dllSWTZjNXc9PQ%3D%3D
// https://www.notion.so/install-integration?response_type=code&client_id=a9d28aca-5006-4071-8e06-86411c9ee8bc&redirect_uri=https%3A%2F%2Fapi.carbon.ai%2Fintegrations%2Fnotion&state=Z0FBQUFBQm1Dd2tWVlBselM0Vllhb0R6REQtOUZuRWpsdERBNFQ0NHF3Skh1YnFHRjE3TlZHMlJrNzY0b3FBU0VJSlNaN01paUpNb1Nsbld4bDBDSHVzeGM5dllSWTZjNXc9PQ%3D%3D

// https://integrations.chatnode.ai/integrations/notion?code=03c81086-4dc2-492a-a564-2b920a31e6b9&state=Z0FBQUFBQm1Dd2tWVlBselM0Vllhb0R6REQtOUZuRWpsdERBNFQ0NHF3Skh1YnFHRjE3TlZHMlJrNzY0b3FBU0VJSlNaN01paUpNb1Nsbld4bDBDSHVzeGM5dllSWTZjNXc9PQ%3D%3D
// https://api.carbon.ai/integrations/notion?code=039411fb-e75e-4d2c-b797-1eabf6782e1d&state=Z0FBQUFBQm1Dd2tWVlBselM0Vllhb0R6REQtOUZuRWpsdERBNFQ0NHF3Skh1YnFHRjE3TlZHMlJrNzY0b3FBU0VJSlNaN01paUpNb1Nsbld4bDBDSHVzeGM5dllSWTZjNXc9PQ%3D%3D

// https://integrations.chatnode.ai/v1/oauth/authorize?client_id=a9d28aca-5006-4071-8e06-86411c9ee8bc&redirect_uri=https://api.carbon.ai/integrations/notion&response_type=code&state=Z0FBQUFBQm1Dd3lxc2hzRGtHNGdjdExlZlZRb1lBY0VpVnJmbldLNlNkVjhPYmJ6OWJucEJqUDJncFlvVUR5MEhyM3JDalhWM25Xc0lLSzdzaDFyRk5YUFlyWFZINE0yTGc9PQ==
// https://integrations.chatnode.ai/v1/oauth/authorize?client_id=a9d28aca-5006-4071-8e06-86411c9ee8bc&redirect_uri=https://api.carbon.ai/integrations/notion&response_type=code&state=Z0FBQUFBQm1Dd3lxc2hzRGtHNGdjdExlZlZRb1lBY0VpVnJmbldLNlNkVjhPYmJ6OWJucEJqUDJncFlvVUR5MEhyM3JDalhWM25Xc0lLSzdzaDFyRk5YUFlyWFZINE0yTGc9PQ==
