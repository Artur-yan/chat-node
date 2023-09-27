import { PUBLIC_CHAT_API_URL } from '$env/static/public';

async function getText(
	chat_key: string,
	source_keys: Array<string>,
	user_id: string,
	session_id: string
) {
	const body = new FormData();
	body.append('source_keys', source_keys);
	body.append('user_id', user_id);
	body.append('session_id', session_id);

	const res = await fetch(`${PUBLIC_CHAT_API_URL}/api/get-data-text?chat_key=${chat_key}`, {
		method: 'POST',
		body
	});

	return await res.json();
}

async function updateText(
	source_key: string,
	chat_key: string,
	text: string,
	user_id: string,
	session_id: string
) {
	const body = new FormData();
	body.append('source_key', source_key);
	body.append('chat_key', chat_key);
	body.append('text', text);
	body.append('user_id', user_id);
	body.append('session_id', session_id);

	const res = await fetch(`${PUBLIC_CHAT_API_URL}/api/retrain-text`, {
		method: 'POST',
		body
	});

	return await res.json();
}

export { getText, updateText };
