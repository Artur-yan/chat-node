import { goto } from '$app/navigation';
import { alert } from '$lib/stores';

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

const redirectToStripeBilling = async () => {
	try {
		alert.set('Redirecting you to Stripe billing portal')

		const res = await fetch('/api/account/billing', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: ''
		});
		if (res.status == 200) {
			const url = await res.json();
			goto(url);
		} else {
			alert.set('Failed to redirect to Stripe billing portal')
		}
	} catch (err) {
		console.error(err);
	}
};

export { deleteAccount, updateAccountEmail, updateApiKey, redirectToStripeBilling };
