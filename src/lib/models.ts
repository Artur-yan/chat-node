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
	allowedUrls: [],
	supportMessage: 'Hmm, I am not sure',
	systemPrompt:
		'I want you to act as a document that I am having a conversation with. Your name is "AI Assistant". You will provide me with answers from the given info. Refuse to answer any question not about the text. Never break character. Do NOT say "Based on the given information." Always answer in the language of my message.',
	userPrompt: '',
	theme: {
		name: 'default',
		bg: '#0F172A',
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

export { addModel, updateModel, deleteModel, defaultSettings};
