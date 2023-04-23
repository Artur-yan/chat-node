import { goto } from '$app/navigation';

const addModel = async (
	id: string,
	data_source_type: 'text' | 'file' | 'url',
	name: string,
	settings?: Object
) => {
	const res = await fetch('/api/models', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			id,
			data_source_type,
			name,
			settings
		})
	});
};

const updateModel = async (id: string, name: string, settings?: Object) => {
	try {
		const res = await fetch('/api/models', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id,
				name,
				settings
			})
		});
	} catch (err) {
		console.error(err);
	} finally {
		goto(`/account/chatbots/${id}`);
	}
};

const deleteModel = async (id: string) => {
	try {
		await fetch('/api/models', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id
			})
		});
	} catch (err) {
		console.error(err);
	}
};

export { addModel, updateModel, deleteModel };
