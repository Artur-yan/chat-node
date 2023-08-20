const addModel = async (id: string, name: string, settings?: Object) => {
	try {
		const res = await fetch('/api/models', {
			method: 'POST',
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
		throw err;
	}
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

const defaultSettings = {
	greeting: 'What can I help you with?',
	public: false,
	publicTitle: 'AI Chatbot',
	allowedUrls: [],
	supportMessage:
		'If the answer is not included, say exactly "Hmm, I don\'t know" and stop after that.',
	systemPrompt:
		'You are a helpful assistant named "Assistant AI". You limit your knowledge to the context provided',
	userPrompt: '',
	gptVersion: '3.5',
	temperature: 0.1,
	inputPlaceholder: 'Type your message',
	theme: {
		name: 'default',
		bg: '#0F172A',
		headerBG: '',
		botBubbleBG: '#818CF8',
		botBubbleText: '#00074B',
		userBubbleBG: '#1E293B',
		userBubbleText: '#B5CDF5',
		inputBG: '#FFFFFF',
		inputText: '#000',
		inputBorder: '#transparent',
		sendButtonBG: '#FFFFFF',
		sendButtonIconColor: '#000'
	}
};

export { addModel, updateModel, deleteModel, defaultSettings };
