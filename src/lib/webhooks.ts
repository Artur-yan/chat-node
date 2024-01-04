const createWebhook = async (botId: string) => {
	try {
		const response = await fetch('/api/webhooks', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ botId })
		});

		const data = await response.json();
		window.location.reload();
	} catch (error) {
		console.error(error);
		return { error: 'Error creating webhook' };
	}
};

const updateWebhook = async (botId: string, type: string, savedUrl: string, newUrl: string) => {
	try {
		const response = await fetch('/api/webhooks', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id: botId, type, savedUrl, newUrl })
		});

		const data = await response.json();
		window.location.reload();
	} catch (error) {
		console.error(error);
		return { error: 'Error updating webhook' };
	}
};

const deleteWebhook = async (botId: string, type: string, url: string) => {
	try {
		const response = await fetch('/api/webhooks', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id: botId, type: type, url: url })
		});

		const data = await response.json();
		window.location.reload();
	} catch (error) {
		console.error(error);
		return { error: 'Error deleting webhook' };
	}
};

export { createWebhook, updateWebhook, deleteWebhook };
