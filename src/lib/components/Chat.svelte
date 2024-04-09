<script lang="ts">
	import { PUBLIC_ENCODED_CHAT_API_URL } from '$env/static/public';
	import { Remarkable } from 'remarkable';
	import { defaultSettings, type Message, type SuggestedQuestion } from '$lib/models';
	import { onMount } from 'svelte';
	import 'highlight.js/styles/github-dark.css';
	import hljs from 'highlight.js';
	import '$lib/assets/css/chat.postcss';
	import { v4 as uuidv4 } from 'uuid';

	import ChatLinks from './chat/ChatLinks.svelte';
	import Feedback from './chat/Feedback.svelte';
	import PBCN from './chat/PBCN.svelte';
	import ChatHeader from './chat/ChatHeader.svelte';
	import Crisp from './chat/Crisp.svelte';
	import SuggestedQuestions from './chat/SuggestedQuestions.svelte';
	import Thinking from './chat/Thinking.svelte';
	import SubmitButton from './chat/SubmitButton.svelte';
	import { fade } from 'svelte/transition';
	import { browser } from '$app/environment';

	export let modelId: string;
	export let disabled = false;
	export let isThinking = false;
	export let isResponding = false;
	export let settings = defaultSettings;
	export let showUserInfoCollection = true;
	export let messages: Message[] = [
		{
			id: uuidv4(),
			text: settings.greeting,
			sender: 'bot',
			links: [],
			status: 'done',
			vote: 0
		}
	];
	export let avatar: string | undefined = undefined;
	export let userId: string;
	export let usedForPreview: boolean = false;
	export let plan: number;
	export let customDomain: boolean;

	$: if(browser && messages.length) {
		scrollToBottom();
	}

	let agreedToPolicy = false;
	let submittedInfo = false;

	// Initialize the markdown parser
	const md = new Remarkable();

	// Merge default settings with user settings
	// Merge nested object
	settings.theme = {
		...defaultSettings.theme,
		...settings.theme
	};
	settings = {
		...defaultSettings,
		...settings
	};

	if (!settings.theme) {
		settings.theme = defaultSettings.theme;
	}

	let chatSessionId: string;
	let inputVal = ``;
	let customMessage = ``;

	let collectUserInfo = false;
	let userInfoReceived = false;
	let links: string[] | undefined = [];
	let messageId: string | null = '';
	let suggestedQuestions: SuggestedQuestion[] = settings.suggestedQuestions;
	const lockedSuggestedQuestions = JSON.parse(JSON.stringify(suggestedQuestions));

	let endUserInfo = {
		name: '',
		email: '',
		phone: ''
	};

	let nameInput: HTMLInputElement;
	let emailInput: HTMLInputElement;
	let phoneInput: HTMLInputElement;

	let nameInputIsValid = false;
	let emailInputIsValid = false;
	let phoneInputIsValid = false;

	const phonePattern = /^(?:[+(). -]*\d){7,}$/;

	$: {
			if (endUserInfo.name && endUserInfo.name.length > 1 && nameInput) {
					nameInput.setCustomValidity('');
					nameInputIsValid = true;
			} else if (settings.collectUserName && nameInput) {
					nameInput.setCustomValidity('Please provide your name');
					nameInputIsValid = false;
			}

			if (endUserInfo.email && endUserInfo.email.includes('@') && endUserInfo.email.includes('.') && emailInput) {
					emailInput.setCustomValidity('');
					emailInputIsValid = true;
			} else if (settings.collectUserEmail && emailInput) {
					emailInput.setCustomValidity('Please provide a valid email');
					emailInputIsValid = false;
			}

			if (phonePattern.test(endUserInfo.phone) && phoneInput) {
					phoneInput.setCustomValidity('');
					phoneInputIsValid = true;
			} else if (settings.collectUserPhone && phoneInput) {
					phoneInput.setCustomValidity('Please provide a valid phone number');
					phoneInputIsValid = false;
			}
	}

	$: if (settings.collectUserName || settings.collectUserEmail || settings.collectUserPhone) {
		collectUserInfo = true;
	} else {
		collectUserInfo = false;
	}

	onMount(() => {
		const previousConversationJSON = localStorage.getItem('previous_convo_3495')
		let previousConversationId: string | null | undefined;

		if(previousConversationJSON) {
			const previousConversationObj = JSON.parse(previousConversationJSON);
			previousConversationId = previousConversationObj?.[modelId];
		}

		if(previousConversationJSON && previousConversationId) {
			chatSessionId = previousConversationId;
			continueConversation();
		} else if (previousConversationJSON && !previousConversationId) {
			chatSessionId = generateNewSessionId();
		} else if (!previousConversationJSON){
			chatSessionId = generateNewSessionId();
		}

		if (collectUserInfo) {
			endUserInfo = JSON.parse(localStorage.getItem('enduserInfo') || '{}');
			if (!settings.collectUserName) {
				endUserInfo.name = '';
			}
			if (!settings.collectUserEmail) {	
				endUserInfo.email = '';
			}
			if (!settings.collectUserPhone) {
				endUserInfo.phone = '';
			}
		}

		if(localStorage.getItem('agreed_to_policy_3485')) {
			agreedToPolicy = true;
		}

		if(localStorage.getItem('submitted_info_3485')) {
			submittedInfo = true;
		}

		if (usedForPreview) {
			localStorage.setItem('submitted_info_3485', '');
			localStorage.setItem('agreed_to_policy_3485', '');
		}
	});

	// Generate a random ID
	const generateNewSessionId = (): string => {
		return Math.random().toString(36).slice(2, 9) + '-' + Date.now();
	};

	const handleUserInfoSubmit = (): void => {
		if (
			(settings.collectUserName && !nameInputIsValid) ||
			(settings.collectUserEmail && !emailInputIsValid) ||
			(settings.collectUserPhone && !phoneInputIsValid)
		) {
			return;
		}
		userInfoReceived = true;
		localStorage.setItem('submitted_info_3485', 'true');
		initConversation();
	};

	const postProcessMsgHTML = (msgHTML: string): string => {
		msgHTML = msgHTML.replace(/<a href=/g, '<a target="_blank" href=');
		return msgHTML;
	};

	const addMessage = (message: string, sender: 'user' | 'human' | 'bot' = 'bot', links: string[]  = []): void => {
		messages = [...messages, 
			{ id: uuidv4(), text: message, sender: sender, links: links, status: undefined, vote: 0}
		];
	};

	const queryModel = async (chatKey: string, chatSessionId: string, message: string, customMessage: string = ''): Promise<ReadableStreamDefaultReader<Uint8Array> | undefined> => {
		messageId = null;
		
		if (customMessage && !settings.showSuggestedQuestionsPrompt) {
			addMessage(customMessage, 'user');
		} else {
			addMessage(message, 'user');
		}
	
		inputVal = ``;
		isThinking = true;
		links = [];

		let streamedMsg = '';
		let chunksCount = 0;

		try {
			const res = await fetch(`${atob(PUBLIC_ENCODED_CHAT_API_URL)}/chat/${chatKey}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					message: message,
					chat_session_id: chatSessionId
				})
			});
			isThinking = false;

			messageId = res.headers.get('x-message-id');

			const responseLinks = res.headers.get('urls');
			if (responseLinks !== null) {
				// Making the string parsable
				const contentString: string = responseLinks.replace(/'/g, '"');
				links = JSON.parse(contentString);
			}

			if (res.headers.get('content-type') === 'application/json') {
				const data = await res.json();
				addMessage(data.message, 'bot', links);
				return;
			}

			const data = res.body;
			const reader = data?.getReader() as ReadableStreamDefaultReader<Uint8Array>;
			reader.read().then(function pump({ done, value }): any{
				isResponding = true;
				if (done) {
					// Do something with last chunk of data then exit reader
					document.querySelectorAll('.message-body:last-child code').forEach((el: any) => {
						hljs.highlightElement(el);
					});
					isResponding = false
					messages[messages.length - 1].id = messageId as string;
					messages[messages.length - 1].status = 'done';
					playDoublePop();
					return;
				}
				// Otherwise do something here to process current chunk
				streamedMsg += new TextDecoder().decode(value);

				if (chunksCount === 0) {
					addMessage(streamedMsg, 'bot', links);
				} else {
					messages[messages.length - 1].text = streamedMsg;
				}
				chunksCount++;
				// Read some more, and call this function again
				return reader.read().then(pump);
			});
		} catch (err) {
			isThinking = false;
			console.error(err);
		}
	};

	const initConversation = async (): Promise<void> => {
		await fetch(`/api/chat-history/${chatSessionId}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				bot_id: modelId,
				user_id: userId,
				endUserInfo
			})
		});
		localStorage.setItem('enduserInfo', JSON.stringify(endUserInfo));
		
		const previousConversationJSON = localStorage.getItem('previous_convo_3495');
		let conversationObj;
		
		if(previousConversationJSON) {
			conversationObj = JSON.parse(previousConversationJSON);
		}

		if(conversationObj) {
			conversationObj[modelId] = chatSessionId;
			localStorage.setItem('previous_convo_3495', JSON.stringify(conversationObj));
		} else {
			localStorage.setItem('previous_convo_3495', JSON.stringify({[modelId]: chatSessionId}));
		}
	};

	const continueConversation = async (): Promise<void> => {
		messages = [];
		const response = await fetch(`/api/chat-history/${chatSessionId}`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json' 
			}
		});

		const data = await response.json();

		const processableMessages: Message[] = data.map((msg: any) => {
			return {
				id: msg.id,
				text: msg.message.data.content,
				sender: msg.message.data.type === 'human' ? 'user' : 'bot',
				vote: msg.vote,
				status: 'done',
				links: msg.data?.links || []
			};
		});

		if(processableMessages.length === 0) {
			addMessage(settings.greeting);
		} else {
			messages = processableMessages;
		}
	};

	const submitQuery = (): void => {
		playSingleClick();
		//Initalizations
		if (messages.length === 1 && !collectUserInfo) {
			initConversation();
		} else if(messages.length === 1 && collectUserInfo && localStorage.getItem('enduserInfo')) {
			initConversation();
		}

		if (isThinking) {
			addMessage('Please wait for me to finish thinking...');
			inputVal = '';
			return;
		} else if (isResponding){
			inputVal = '';
			return
		} else if (inputVal.trim() === '') {
			return;
		} else if (!modelId) {
			addMessage('Add some data for me to respond to answers about');
			inputVal = '';
			return;
		} else {
			queryModel(modelId, chatSessionId, inputVal, customMessage);
			customMessage = '';
		}
	};

	const resetChat = (): void => {
		messages = [];
		addMessage(settings.greeting);
		chatSessionId = generateNewSessionId();
		suggestedQuestions = JSON.parse(JSON.stringify(lockedSuggestedQuestions));
		
		const previousConversationJSON = localStorage.getItem('previous_convo_3495');
		let conversationObj;
		
		if(previousConversationJSON) {
			conversationObj = JSON.parse(previousConversationJSON);
		}

		if(conversationObj) {
			conversationObj[modelId] = null;
			localStorage.setItem('previous_convo_3495', JSON.stringify(conversationObj));
		} else {
			localStorage.setItem('previous_convo_3495', JSON.stringify({[modelId]: null}));
		}

		isThinking = false;
	};

	const askSuggestedQuestion = (question: string, label:string): void => {
		inputVal = question;
		customMessage = label;
		submitQuery();
	};

	function playDoublePop() :void {
		if(settings.soundEffects) {
			const audio = new Audio('/multiple-pops.mp3');
			audio.play();
		}
	}

	function playSingleClick() :void {
		if(settings.soundEffects) {
			const audio = new Audio('/click.mp3');
			audio.play();
		}
	}

	const scrollToBottom = () => {
    setTimeout(() => {
			const chatBottom = document.getElementById('chat-bottom');
			if (chatBottom) {
				chatBottom.scrollIntoView({ behavior: 'smooth' });
			}
		}, 100);
	};

	$: console.log(messages.length);
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com"  crossorigin="anonymous">
	<link href="https://fonts.googleapis.com/css2?family=Mulish:wght@400;700&display=swap" rel="stylesheet">
</svelte:head>

	<div
		style="
		--bg: {settings.theme.bg};
		--headerBG: {settings.theme.headerBG};
		--headerTitle: {settings.theme.headerTitle};
		--headerShadow: {settings.theme.headerShadow};
		--resetButton: {settings.theme.resetButton};
		--botBubbleBG: {settings.theme.botBubbleBG};
		--botBubbleText: {settings.theme.botBubbleText};
		--userBubbleBG: {settings.theme.userBubbleBG};
		--userBubbleText: {settings.theme.userBubbleText};
		--inputBG: {settings.theme.inputBG};
		--inputText: {settings.theme.inputText};
		--inputBorder: {settings.theme.inputBorder};
		--sendButtonBG: {settings.theme.sendButtonBG};
		--sendButtonIconColor: {settings.theme.sendButtonIconColor};
		--statusColor: {settings.theme.statusColor};
		--feedbackIconColor: {settings.theme.feedbackIconColor};
		background-color: var(--bg);
		font-family: 'Mulish', sans-serif;"
		class="flex h-full flex-col justify-between overflow-hidden flex-1 relative transition-colors ease-in-out duration-500"
	>
		<!-- Header -->
		{#if settings?.headerEnabled && settings.publicTitle !== ''}
			<ChatHeader {settings} {resetChat} />
		{/if}

		<!-- PBCN -->
    {#if settings.dataFunnelV2 && !customDomain && !settings.removeBranding && (settings.removeBranding !== undefined && [0, 1001, 5, 105, 6, 106].includes(plan)) && plan !== 1006 && plan !== 1005}
			<PBCN textColor={settings.theme.poweredByChatNodeColor} />
		{/if}
		<div class="flex-col-reverse flex flex-1 overflow-y-auto scroll-smooth h-0 basis-auto">
			<div class="flex-1">

				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<div class="p-2">
					<slot>
						{#each messages as msg, i}
							<div
								class="chat relative w-auto {msg.sender == 'bot' ? 'chat-start my-1.5' : ''} {msg.sender !== 'bot' && i === 1 ? 'chat-end mt-0 mb-2' : ''} {msg.sender !== 'bot' && i !== 1 ? 'chat-end mt-6 mb-2' : ''}" 
							>
								{#if msg.sender === 'bot' && avatar}
									<div class="chat-image avatar">
										<div class="w-10 rounded-full">
											<img src={avatar} alt="" />
										</div>
									</div>
								{/if}
								<div
									class="chat-bubble relative w-auto transition-colors"
									style={msg.sender == 'bot'
										? 'background-color: var(--botBubbleBG); color: var(--botBubbleText)'
										: 'background-color: var(--userBubbleBG); color: var(--userBubbleText)'}
								>
									<div class="message-body break-words">
										{@html (postProcessMsgHTML(md.render(msg.text)))}
									</div>
									{#if msg.sender === 'bot' && msg.status === 'done'  && i !== 0 && msg.text !== 'Please wait for me to finish thinking...'}
									<div class="absolute my-2.5 -ml-3 flex justify-between items-center w-full z-0">
										<span in:fade={{ delay: 300, duration: 1000}} class="my-1 text-[14px] {i !== messages.length - 1 ? 'invisible' : ''}">Bot · Just now.</span>
										<Feedback 
											message={msg} 
											messageId={msg.id}
											sessionId={chatSessionId}
											vote={msg.vote} 
										/>
									</div>
								{/if}
								</div>
								<!-- {#if msg.sender === 'bot' && msg.status === 'done'  && i !== 0 && msg.text !== 'Please wait for me to finish thinking...'}
								<div class="flex justify-between items-center -mt-2.5 gap-2 w-10/12 mx-auto">
									<span in:fade={{ delay: 300, duration: 1000}} class="my-1 mx-2.5 text-[14px] {i !== messages.length - 1 ? 'invisible' : ''}">Bot · Just now.</span>
									<Feedback 
										message={msg} 
										messageId={msg.id}
										sessionId={chatSessionId}
										vote={msg.vote} 
										iconColor={settings.theme.feedbackIconColor} 
										bgColor={settings.theme.feedbackBGColor}
										fallbackBGColor={settings.theme.botBubbleBG}
										fallbackIconColor={settings.theme.botBubbleText}
									/>
								</div>
							{/if} -->
							</div>
							{#if settings.useSourceUrls && msg.links?.length > 0}
								<ChatLinks links={msg.links} {settings}/>
							{/if}
						{/each}
					</slot>
					{#if isThinking}
						<Thinking {avatar} />
					{/if}
				</div>
				<div id="chat-bottom" class="h-6" />
			</div>
		</div>
		<form on:submit|preventDefault={submitQuery} class="form-control p-0">
			<div>
				<div class="relative">
					{#if settings.crispEnabled && settings.crispButtonText && settings.crispWebsiteId}
						<Crisp {settings} />
					{/if}
					{#if suggestedQuestions}
						<SuggestedQuestions {suggestedQuestions} {settings} askSuggestedQuestion={askSuggestedQuestion} {isThinking} />
					{/if}
					{#if !settings.policyEnabled || (settings.policyEnabled && agreedToPolicy) || (settings.policyEnabled && collectUserInfo && !showUserInfoCollection) || (settings.policyEnabled && !showUserInfoCollection)} 
					
					<textarea
							placeholder={settings.inputPlaceholder}
							rows="1"
							bind:value={inputVal}
							on:keydown={(e) => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault();
									submitQuery();
								}
							}}
							class="textarea textarea-lg resize-none text-[14px] placeholder:text-[14px] min-h-0 max-h-32 w-full leading-5 join-item focus-within:outline-none placeholder:text-[var(--inputText)] {settings.sendButtonEnabled
								? 'pr-12'
								: ''}"
							style="background-color: var(--inputBG); color: var(--inputText); border: 1px solid var(--inputBorder);"
							{disabled}
						/>
						{#if settings.sendButtonEnabled}
							<SubmitButton />
						{/if}

					{:else if settings.policyEnabled && !agreedToPolicy && !collectUserInfo}
						<div class="relative w-full">
							<textarea
								rows="1"
								class="textarea textarea-lg resize-none text-[14px] placeholder:text-[1rem] min-h-0 max-h-32 w-full leading-5 join-item focus-within:outline-none placeholder:text-[var(--inputText)]"
								style="background-color: var(--botBubbleBG); color: var(--inputText); border: 1px solid var(--inputBorder);"								disabled={true}
							></textarea>
							<div class="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-0 flex justify-center items-center">
								<input 
									type="checkbox" 
									bind:checked={agreedToPolicy} 
									on:click={() => localStorage.setItem('agreed_to_policy_3485', 'true')}
									class="checkbox checkbox-sm mx-2 border-1 border-slate-300" 
								/>
								<a 
									href="{settings.policyLink && settings.policyLink.startsWith('http') ? settings.policyLink : `https://${settings.policyLink}`}" 
									on:click={(e) => {
										if (!settings.policyLink) {
											e.preventDefault();
										}
									}}
									class="underline" 
									target="_blank"
								>
									<span class="text-[14px] underline text-white">{settings.policyText || "I agree with the terms and conditions"}</span>
								</a>
							</div>
						</div>					
					{/if}
				</div>
			</div>
		</form>

		{#if collectUserInfo && !userInfoReceived && showUserInfoCollection && !submittedInfo}
			{#if settings.policyEnabled && !agreedToPolicy}
				<div 
					class="@container absolute bottom-0 left-0 right-0 grid gap-1 p-8"
					style="background-color: var(--bg); color: var(--inputText)"
				>

				<!--	oninput="this.style.height = ''; this.style.height = this.scrollHeight + 'px'" -->
					<textarea
						rows="1"
						class="textarea textarea-lg resize-none text-[14px] placeholder:text-[1rem] min-h-0 max-h-32 w-full leading-5 join-item focus-within:outline-none placeholder:text-[var(--inputText)]"
						style="background-color: var(--botBubbleBG); color: var(--inputText); border: 1px solid var(--inputBorder);"
					></textarea>
					<div class="absolute top-0 left-0 right-0 bottom-0 bg-black bg-transparent flex justify-center items-center">
						<input 
							type="checkbox" 
							bind:checked={agreedToPolicy} 
							on:click={() => localStorage.setItem('agreed_to_policy_3485', 'true')}
							class="checkbox checkbox-sm mx-2 border-1 border-slate-300" 
						/>
						<a 
							href="{settings.policyLink && settings.policyLink.startsWith('http') ? settings.policyLink : `https://${settings.policyLink}`}" 
							on:click={(e) => {
								if (!settings.policyLink) {
									e.preventDefault();
								}
							}}
							class="underline text-white" 
							target="_blank"
						>
							<span class="text-[1rem] underline text-white">{settings.policyText || "I agree with the terms and conditions"}</span>
						</a>
					</div>
				</div>
			{:else}
			<form
				class="@container absolute bottom-0 left-0 right-0 grid gap-1 p-8"
				style="background-color: var(--bg); color: var(--inputText)"
			>
				<div class="join join-vertical @xl:join-horizontal">
					{#if settings.collectUserName}
						<input
							bind:this={nameInput}
							type="text"
							name="name"
							class="input join-item w-full placeholder:text-sm"
							style="background-color: var(--inputBG); border-color: var(--inputBorder);"
							placeholder={settings.collectUserNameLabel || 'Name'}
							bind:value={endUserInfo.name}
						/>
					{/if}
					{#if settings.collectUserEmail}
						<input
							bind:this={emailInput}
							type="email"
							name="email"
							class="input join-item w-full placeholder:text-sm"
							style="background-color: var(--inputBG); border-color: var(--inputBorder);"
							placeholder={settings.collectUserEmailLabel || 'Email'}
							bind:value={endUserInfo.email}
						/>
					{/if}
					{#if settings.collectUserPhone}
						<input
							bind:this={phoneInput}
							name="phone"
							type="tel"
							class="input join-item w-full placeholder:text-sm"
							style="background-color: var(--inputBG); border-color: var(--inputBorder);"
							placeholder={settings.collectUserPhoneLabel || 'Phone'}
							bind:value={endUserInfo.phone}
						/>
					{/if}
					<input
						type="submit"
						class="btn join-item border-none"
						value={settings.collectUserInfoSubmitButtonText || 'Start Chatting'}
						on:click={handleUserInfoSubmit}
						style="background-color: var(--botBubbleBG); color: var(--botBubbleText)"
					/>
				</div>
			</form>
			{/if}
		{/if}
	
		<style>
			.message-body table,
			.message-body td,
			.message-body th {
				border: 1px solid rgba(0, 0, 0, 0.25) !important;
				border-collapse: collapse;
				padding: 4px;
			}
	
			.message-body th {
				text-align: left;
			}

			.chat {
				column-gap: 0rem;
			}
	
			.chat-start .chat-bubble {
				transform-origin: left center;
			}
			.chat-end .chat-bubble {
				transform-origin: right;
				margin-right: 20px;
			}

			.chat-bubble::before {
				content: none !important;
				border-radius: 0.25rem;
			}

			.chat-bubble {
				/* border-bottom-left-radius: 0.50rem !important; */
				border-radius: 0.50rem !important;
			}

			.message-body {
				font-size: 14px;
				margin-top: 0.2em;
			}

			.message-body a {
				text-decoration: underline !important;
				overflow-wrap: break-word;
				word-wrap: break-word;
				hyphens: auto;
			}
	
			.message-body ul {
				list-style: disc;
				margin-left: 2em;
			}
			.message-body ol {
				list-style: decimal;
				margin-left: 2em;
			}

			.message-body p + p{
				margin-top: 1em;
			}
	
			pre, code {
				border-radius: 0.25rem;
				transition-property: background-color, padding;
				transition-duration: 300ms;
				overflow-x: auto;
			}

			.textarea-lg {
				border-radius: 0px !important;'
				font-size: 14px;
			}
		</style>
	</div>

<style lang="postcss">
	.chat-bubble {
		animation: message 0.3s ease-out 0s forwards;
	}

	.rotatable {
        transition: transform 0.8s ease-in-out;
    }

	.rotatable:hover {
			transform: rotate(360deg);
  }
</style>