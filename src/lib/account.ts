import { goto } from '$app/navigation';

const deleteAccount = async () => {
	await fetch('/api/account/delete', {
		method: 'POST'
	});
	goto('/');
};

const updateAccountEmail = async (newEmail: string) => {
	try {
		await fetch('/api/account/update-email', {
			method: 'POST',
			body: JSON.stringify({
				newEmail
			})
		});
	} catch (err) {
		console.error(err);
	}
};

const updateApiKey = async () => {
	try {
		const res = await fetch('/api/account/update-api-key', {
			method: 'POST'
		});
		const { apiKey } = await res.json();

		return apiKey;
	} catch (err) {
		console.error(err);
	}
};

export { deleteAccount, updateAccountEmail, updateApiKey };
