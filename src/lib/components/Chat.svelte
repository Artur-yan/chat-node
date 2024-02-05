<script lang="ts">
	import { PUBLIC_ENCODED_CHAT_API_URL } from '$env/static/public';
	import { defaultSettings } from '$lib/models';
	import { Remarkable } from 'remarkable';
	import hljs from 'highlight.js';
	import 'highlight.js/styles/github-dark.css';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import '$lib/assets/css/chat.postcss';
	import ChatLinks from './ChatLinks.svelte';
	import Button from './Button.svelte';
	import { page } from '$app/stores';
	import Feedback from './Feedback.svelte';

	export let removeBranding = true;
	export let modelId: string;
	export let disabled = false;
	export let isThinking = false;
	export let isResponding = false;
	export let settings = defaultSettings;
	export let showUserInfoCollection = true;
	export let messages = [
		{
			text: settings.greeting,
			sender: 'bot',
			links: []
		}
	];
	export let userId: string;

	let context = $page.url.searchParams.get('context');

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

	export let avatar: string | undefined = undefined;

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
		if (collectUserInfo) {
			endUserInfo = JSON.parse(localStorage.getItem('enduserInfo')) || {};
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
	});

	const handleUserInfoSubmit = () => {
		if (
			(settings.collectUserName && !nameInputIsValid) ||
			(settings.collectUserEmail && !emailInputIsValid) ||
			(settings.collectUserPhone && !phoneInputIsValid)
		) {
			return;
		}
		userInfoReceived = true;
		initConversation();
	};

	const postProcessMsgHTML = (msgHTML) => {
		msgHTML = msgHTML.replace(/<a href=/g, '<a target="_blank" href=');
		return msgHTML;
	};

	const addMessage = (message: string, sender = 'bot', links: string[]  = []) => {
		messages = [...messages, { text: message, sender: sender, links: links}];
	};

	const queryModel = async (chatKey: string, chatSessionId: string, message: string, customMessage: string = '') => {
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
			// const data = await res.json();
			isThinking = false;

			messageId = res.headers.get('x-message-id');
	
			console.log(messageId);

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
			const reader = data.getReader();
			reader.read().then(function pump({ done, value }) {
				isResponding = true;
				if (done) {
					// Do something with last chunk of data then exit reader
					document.querySelectorAll('.message-body:last-child code').forEach((el) => {
						hljs.highlightElement(el);
					});
					isResponding = false
					messages[messages.length - 1].id = messageId;
					messages[messages.length - 1].status = 'done';
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

	// Generate a random ID
	const generateNewSessionId = () => {
		return Math.random().toString(36).slice(2, 9) + '-' + Date.now();
	};
	chatSessionId = generateNewSessionId();

	const initConversation = async () => {
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
	};

	const submitQuery = () => {
		if (messages.length === 1 && !collectUserInfo) {
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

	// $: messages && scrollToBottom();

	const resetChat = () => {
		messages = [];
		addMessage(settings.greeting);
		chatSessionId = generateNewSessionId();
		isThinking = false;
	};

	const askSuggestedQuestion = (question: string, label:string) => {
		inputVal = question;
		customMessage = label;
		submitQuery();
	};

	const transferToCrisp = () => {
		goto('https://go.crisp.chat/chat/embed/?website_id=' + settings.crispWebsiteId);
	};
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
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
		background-color: var(--bg);
		font-family: 'Mulish', sans-serif;"
		class="flex h-full flex-col justify-between overflow-hidden flex-1 relative transition-colors ease-in-out duration-500"
	>
		{#if settings?.headerEnabled && settings.publicTitle !== ''}
			<header style="background-color: var(--headerBG);" class="flex px-6 py-4 items-center gap-3 shadow-md shadow-[var(--headerShadow)]">
				<!-- <div class="h-8">
					<img src={avatar} alt="" class="h-full" />
			</div> -->
				<h1 class="font-bold text-lg" style="color: var(--headerTitle)">
					{settings.publicTitle ? settings.publicTitle : ''}
				</h1>
				{#if settings.statusEnabled}
				<span class="inline-flex items-center gap-x-1.5 rounded-md text-sm font-medium text-[--statusColor]">
					<svg class="h-1.5 w-1.5 fill-[--statusColor]" viewBox="0 0 6 6" aria-hidden="true">
						<circle cx="3" cy="3" r="3" />
					</svg>
					{settings.theme.statusMessage}
				</span>
				{/if}
			</header>
		{/if}
		<div class="flex-col-reverse flex flex-1 overflow-y-auto scroll-smooth h-0 basis-auto">
			<div class="flex-1">
				<button 
					class="z-[1] absolute top-2.5 {context === 'popup' ? 'right-[45px]' : 'right-2'} btn btn-circle btn-sm btn-ghost flex items-center justify-center rotatable"
					style="color: var(--resetButton); position:absolute right: 8px;"
					title="Reset Chat"
					on:click={resetChat}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
						<path
							fill="currentColor"
							d="M17.65 6.35a7.95 7.95 0 0 0-6.48-2.31c-3.67.37-6.69 3.35-7.1 7.02C3.52 15.91 7.27 20 12 20a7.98 7.98 0 0 0 7.21-4.56c.32-.67-.16-1.44-.9-1.44c-.37 0-.72.2-.88.53a5.994 5.994 0 0 1-6.8 3.31c-2.22-.49-4.01-2.3-4.48-4.52A6.002 6.002 0 0 1 12 6c1.66 0 3.14.69 4.22 1.78l-1.51 1.51c-.63.63-.19 1.71.7 1.71H19c.55 0 1-.45 1-1V6.41c0-.89-1.08-1.34-1.71-.71l-.64.65z"
						/>
					</svg>
				</button>
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<div class="p-2">
					<slot>
						{#each messages as msg, i}
							<div
								class="chat relative w-auto {msg.sender == 'bot'
									? 'chat-start my-4'
									: 'chat-end'}"
							>
								{#if msg.sender === 'bot' && avatar}
									<div class="chat-image avatar">
										<div class="w-10 rounded-full">
											<img src={avatar} alt="" />
										</div>
									</div>
								{/if}
								<div
									class="chat-bubble w-auto relative transition-colors"
									style={msg.sender == 'bot'
										? 'background-color: var(--botBubbleBG); color: var(--botBubbleText)'
										: 'background-color: var(--userBubbleBG); color: var(--userBubbleText)'}
								>
									<div class="message-body break-words">
										{@html (postProcessMsgHTML(md.render(msg.text)))}
									</div>
									{#if msg.sender === 'bot' && msg.status === 'done' && i !== 0 && msg.text !== 'Please wait for me to finish thinking...'}
										<div class="flex justify-end w-full mt-1.5">
											<Feedback 
											message={msg} 
											messageId={msg.id}
											sessionId={chatSessionId} 
											iconColor={settings.theme.feedbackIconColor} 
											bgColor={settings.theme.feedbackBGColor}
											fallbackBGColor={settings.theme.botBubbleBG}
											fallbackIconColor={settings.theme.botBubbleText}
											/>
										</div>
									{/if}
								</div>
							</div>
							{#if settings.useSourceUrls && msg.links?.length > 0}
								<ChatLinks links={msg.links} {settings}/>
							{/if}
						{/each}
					</slot>
					{#if isThinking}
						<div class="chat chat-start">
							{#if avatar}
								<div class="chat-image avatar">
									<div class="w-10 rounded-full">
										<img src={avatar} alt="" />
									</div>
								</div>
							{/if}
							<div
								class="chat-bubble"
								style="background-color: var(--botBubbleBG); color: var(--botBubbleText)"
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
									<circle cx="4" cy="12" r="3" fill="currentColor">
										<animate
											id="svgSpinners3DotsBounce0"
											attributeName="cy"
											begin="0;svgSpinners3DotsBounce1.end+0.25s"
											calcMode="spline"
											dur="0.6s"
											keySplines=".33,.66,.66,1;.33,0,.66,.33"
											values="12;6;12"
										/>
									</circle>
									<circle cx="12" cy="12" r="3" fill="currentColor">
										<animate
											attributeName="cy"
											begin="svgSpinners3DotsBounce0.begin+0.1s"
											calcMode="spline"
											dur="0.6s"
											keySplines=".33,.66,.66,1;.33,0,.66,.33"
											values="12;6;12"
										/>
									</circle>
									<circle cx="20" cy="12" r="3" fill="currentColor">
										<animate
											id="svgSpinners3DotsBounce1"
											attributeName="cy"
											begin="svgSpinners3DotsBounce0.begin+0.2s"
											calcMode="spline"
											dur="0.6s"
											keySplines=".33,.66,.66,1;.33,0,.66,.33"
											values="12;6;12"
										/>
									</circle>
								</svg>
							</div>
						</div>
					{/if}
				</div>
				<div id="chat-bottom" class="h-1" />
			</div>
		</div>
		<form on:submit|preventDefault={submitQuery} class="form-control p-1">
			{#if !removeBranding}
				<div class="text-right text-xs mb-1.5 mr-2 flex justify-end gap-1 items-end leading-none">
					<a href="https://www.chatnode.ai" target="_blank">
						Powered by <svg
							class="inline"
							xmlns="http://www.w3.org/2000/svg"
							width="10"
							height="10"
							viewBox="0 0 300 300"
							fill="none"
						>
							<path
								d="M207.498 117.156C207.498 125.748 200.538 132.713 191.951 132.713H186.769C178.183 132.713 171.222 125.748 171.222 117.156L171.222 22.3358C171.222 18.1376 168.693 14.3326 164.757 12.8725C142.316 4.54795 118.043 0 92.7083 0H13.1546C5.99932 0 0.19884 5.80432 0.19884 12.9643C0.19884 38.2283 -0.189051 63.5278 0.118701 88.7948C0.170219 93.0246 3.62267 96.413 7.85274 96.413L83.1231 96.413C91.7095 96.413 98.67 103.378 98.67 111.97V117.156C98.67 125.748 91.7095 132.713 83.1231 132.713H13.504C8.6203 132.713 4.94385 137.175 6.10095 141.92C10.8745 161.493 18.4236 179.979 28.3074 196.934C31.3972 202.235 37.165 205.313 43.3003 205.313H191.951C200.538 205.313 207.498 212.279 207.498 220.871V226.056C207.498 234.648 200.538 241.613 191.951 241.613H76.0908C71.4431 241.613 69.2283 247.191 72.7581 250.215C108.992 281.253 156.054 300 207.491 300H300V207.429C300 138.818 266.711 77.9878 215.413 40.2283C212.086 37.7792 207.498 40.215 207.498 44.3462L207.498 117.156Z"
								fill="#818CF8"
							/>
						</svg>
						 ChatNode
					</a>
				</div>
			{/if}
			<div>
				<div class="relative">
					{#if settings.crispEnabled && settings.crispButtonText && settings.crispWebsiteId}
						<div class="flex gap-1 mb-2 overflow-x-auto w-full mx-1.5">
							<!-- <Button
								question={{value: 'transfer_to_crisp', label: settings.crispButtonText}}
								bgColor={settings.theme.suggestedQuestionsBG}
								hoverColor={settings.theme.botBubbleBG}
								functionToCall={transferToCrisp}
							/> -->
							<button
							class="btn btn-sm text-xs normal-case bg-[var(--inputBG)] text-[var(--inputText)] border-[var(--inputBorder)] hover:bg-[var(--botBubbleBG)] hover:text-[var(--botBubbleText)]"
							type="button"
							on:click={() => transferToCrisp()}
							>
								{settings.crispButtonText}
							</button>
						</div>
					{/if}
					{#if settings.suggestedQuestions}
						<div class="relative">
							<div class="absolute right-[-1rem] top-0 bottom-0 w-12 z-1" style="background: linear-gradient(90deg, {settings.theme.bg}00, var(--bg) 96%);" />
							<div class="flex gap-1 overflow-x-auto mb-2 w-full mx-1.5">
								{#each settings.suggestedQuestions as question}
									<!-- <Button
										question={question}
										bgColor={settings.theme.suggestedQuestionsBG}
										functionToCall={askSuggestedQuestion}
									/> -->
									<button
										class="btn btn-sm text-xs normal-case bg-[var(--inputBG)] text-[var(--inputText)] border-[var(--inputBorder)] hover:bg-[var(--botBubbleBG)] hover:text-[var(--botBubbleText)]"
										type="button"
										on:click={() => askSuggestedQuestion(question.value, question.label)}
									>
										{question.label}
									</button>
								{/each}
							</div>
						</div>
					{/if}
					<textarea
						placeholder={settings.inputPlaceholder}
						oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'
						rows="1"
						bind:value={inputVal}
						on:keydown={(e) => {
							if (e.key === 'Enter' && !e.shiftKey) {
								e.preventDefault();
								submitQuery();
							}
						}}
						class="textarea textarea-md resize-none text-[1rem] placeholder:text-[1rem] min-h-0 max-h-32 w-full leading-5 join-item rounded-xl focus-within:outline-none placeholder:text-[var(--inputText)] {settings.sendButtonEnabled
							? 'pr-12'
							: ''}"
						style="background-color: var(--inputBG); color: var(--inputText); border: 1px solid var(--inputBorder);"
						{disabled}
					/>
					{#if settings.sendButtonEnabled}
						<button
							class="send-button btn btn-square btn-sm border-none rounded-lg join-item focus-within:outline-none absolute right-2 bottom-[0.4375rem]"
							type="submit"
							name="Send"
							style="background-color: var(--sendButtonBG); color: var(--sendButtonIconColor);"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
								<path
									fill="none"
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9.912 12H4L2.023 4.135A.662.662 0 0 1 2 3.995c-.022-.721.772-1.221 1.46-.891L22 12L3.46 20.896c-.68.327-1.464-.159-1.46-.867a.66.66 0 0 1 .033-.186L3.5 15"
								/>
							</svg>
						</button>
					{/if}
				</div>
			</div>
		</form>
	
		{#if collectUserInfo && !userInfoReceived && showUserInfoCollection}
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
	
			.chat-start .chat-bubble {
				transform-origin: left center;
			}
			.chat-end .chat-bubble {
				transform-origin: right;
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
		</style>
	</div>

<style lang="postcss">
	.send-button:focus {
		background-color: var(--sendButtonIconColor) !important;
		color: var(--sendButtonBG) !important;
	}
	@keyframes message {
		0% {
			opacity: 0.5;
			transform: scale(0.75);
			/* max-height: 100vmax; */
		}
		60% {
			transform: scale(1.05);
		}
		100% {
			opacity: 1;
			transform: scale(1);
			/* max-height: 100vmax; */
			overflow: visible;
		}
	}

	.chat-bubble {
		animation: message 0.3s ease-out 0s forwards;
	}

	.rotatable {
        transition: transform 0.8s ease-in-out;
    }

	.rotatable:hover {
			transform: rotate(360deg);
  }

	.button-shrink {
		color: #65b5f6;
		background-color: transparent;
		border: 1px solid #65b5f6;
		border-radius: 4px;
		padding: 0 16px;
		cursor: pointer;
		transition: all 0.3s ease-in-out;
	}

	.button-shrink:hover {
		transform: scale(0.8);
	}
</style>