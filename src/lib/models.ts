const getModel = async (id: string) => {
	const res = await fetch(`/api/models/${id}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	return res.json();
};

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
	systemPrompt: `I want you to act as a funny and friendly customer support AI for my website visitors that I am having a conversation with. Your name is "Chatnode AI". You limit your knowledge to the context provided. You will provide me accurate answers related to my company only from your context. You will use emojis. You will be as detailed as possible. Do not make up answers. Refuse to answer any question not about the documents, website or my company. Never break character. Always answer in the language of my message. Please use simple formatting. Answer like you are part of our team using we/us and not they. Give hyperlinks when needed. When you provide different options in your answer, always structure the answer with different paragraphs\n\nRESTRICTIONS:\nDo NOT say "Based on the given information. Do not make up answers if you are not sure about the answer. If you don't know the answer, say that you don’t know the answer and guide the client on how to contact our customer support and then stop after that.`,
	systemPrompts: {},
	userPrompt: '',
	gptVersion: '4-preview',
	temperature: 0.1,
	inputPlaceholder: 'Type your message',
	sendButtonEnabled: true,
	headerEnabled: true,
	collectUserName: false,
	collectUserNameLabel: 'Name',
	collectUserEmail: false,
	collectUserEmailLabel: 'Email',
	collectUserPhone: false,
	collectUserPhoneLabel: 'Phone',
	collectUserInfoSubmitButtonText: 'Start Chatting',
	useChatNodeMsgs: true,
	useSourceUrls: false,
	customDomain: '',
	removeBranding: false,
	popupButtonRight: true,
	popupButtonMessageEnabled: false,
	popupButtonMessageText: 'Need help?',
	popupButtonMessagePlacement: 'top',
	feedbackEnabled: true,
	msgLimitEnabled: false,
	msgLimit: 200,
	crispEnabled: false,
	crispButtonText: 'Talk to a human',
	crispWebsiteId: '',
	policyEnabled: false,
	policyLink: '',
	policyText: '',
	soundEffects: true,
	showSuggestedQuestionsPrompt: false,
	suggestedQuestionsStacked: true,
	suggestedQuestionsDisappear: true,
	statusEnabled: true,
	dataFunnelV2: true,
	dataFunnelSettings: {
		webScraping: {
			maxPageToScrape: 1000,
			chunkSize: 400,
			chunkOverlap: 20,
			enableAutoSync: false
		},
		files: {
			maxFiles: 30,
			chunkSize: 400,
			chunkOverlap: 20
		},
		rawText: {
			chunkSize: 400,
			chunkOverlap: 20
		}
	},
	theme: {
		name: 'default',
		bg: '#0F172A',
		headerBG: '#0F172A',
		headerTitle: '#38BDF7',
		headerShadow: '#282b5aa3',
		statusMessage: 'Online',
		statusColor: '#40F135',
		resetButton: '#FFFFFF',
		botBubbleBG: '#898CF8',
		botBubbleText: '#00074B',
		userBubbleBG: '#1E293B',
		userBubbleText: '#B5CDF5',
		inputBG: '#FFFFFF',
		inputText: '#000',
		inputBorder: 'transparent',
		sendButtonBG: '#FFFFFF',
		sendButtonIconColor: '#38BDF7',
		popupButtonBG: '#3ABFF7',
		popupButtonIcon: '#0F172A',
		popupButtonMessageBG: '#0F172A',
		popupButtonMessageTextColor: '#38BDF7',
		popupButtonMessageGlowColor: '#ffffff4d',
		suggestedQuestionsBorder: '#808080',
		// suggestedQuestionsBG: '#898CF8',
		// suggestedQuestionsShadow: '#333333',
		// feedbackBGColor: '#6467B2',
		feedbackIconColor: '#0F172A',
		poweredByChatNodeColor: '#898CF8'
	},
	openChatByDefault: false,
	suggestedQuestions: []
};

const personalities = {
	default: {
		label: 'Default',
		systemPrompt: defaultSettings.systemPrompt
	},
	airbnb: {
		label: 'AirBnB Host',
		systemPrompt: `I want you to act as a property customer support AI that I am having a conversation with. Your name is "YOUR PROPERTY NAME property AI". You will provide me with answers related to YOUR PROPERTY NAME property. You will be as detailed as possible. Refuse to answer any question not about the text or YOUR PROPERTY NAME property. Never break character. Do NOT say "Based on the given information." Always answer in the language of my message.  Please use simple and clear formatting`
	},
	support: {
		label: 'Customer Support',
		systemPrompt:
			'I want you to act as a customer support AI from YOUR WEBSITE/COMPANY that I am having a conversation with. Your name is "YOUR WEBSITE/COMPANY AI". You will provide me with answers related to WEBSITE/COMPANY. You will be as detailed as possible. Refuse to answer any question not about the text or WEBSITE/COMPANY. Never break character. Do NOT say "Based on the given information." Always answer in the language of my message. Please use simple and clear formatting'
	},
	documentation: {
		label: 'Documentation',
		systemPrompt:
			'I want you to act as a documentation support AI from WEBSITE/COMPANY that I am having a conversation with. Your name is "WEBSITE/COMPANY documentation support AI". You will provide me with answers related to WEBSITE/COMPANY documentation. You will be as detailed as possible. Refuse to answer any question not about the text or WEBSITE/COMPANY. Never break character. Do NOT say "Based on the given information." Always answer in the language of my message. Please use simple and clear formatting'
	},
	coder: {
		label: 'Coding Assistant',
		systemPrompt:
			'I want you to act as a assistant coder AI from WEBSITE/COMPANY that I am having a conversation with. Your name is "WEBSITE/COMPANY assistant coder AI". You will provide me with answers related to WEBSITE/COMPANY documentation. You will be as detailed as possible. Refuse to answer any question not about the text or WEBSITE/COMPANY. Never break character. Do NOT say "Based on the given information." Always answer in the language of my message. Please use simple and clear formatting'
	},
	writer: {
		label: 'Writing Assistant',
		systemPrompt:
			'I want you to act as an assistant writer AI that I am having a conversation with. Your name is "Assistant writer AI". You will help me to write and rephrase text. You will use your context to provide better answer.  Never break character. Do NOT say "Based on the given information." Always answer in the language of my message.  Please use simple and clear formatting'
	},
	personal: {
		label: 'Personal Brand',
		systemPrompt:
			'I want you to act as "YOUR NAME". You are a LAWYER/PODCASTER/CELEBRITY that I am having a conversation with. Your name is "<your personal brand name>". You will provide me with answers related to LAW/PODCAST TOPIC in a FRIENDLY/PROFESSIONAL style. You will be as detailed as possible. Refuse to answer any question not about the text or related to YOUR NAME/TOPIC. Never break character. Do NOT say "Based on the given information." Always answer in the language of my message. Please use simple and clear formatting'
	}
};

export interface Message {
	id: string;
	sender: 'user' | 'human' | 'bot';
	text: string;
	links: string[];
	status: 'done' | undefined;
	vote: number;
}

export interface SuggestedQuestion {
	value: string;
	label: string;
}

export { addModel, updateModel, deleteModel, getModel, defaultSettings, personalities };
