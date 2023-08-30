<script lang="ts">
	import { PUBLIC_CHAT_API_URL } from '$env/static/public';
	import BotStatus from '$lib/components/BotStatus.svelte';
	import { defaultSettings } from '$lib/models';
	import { marked } from 'marked';
	import { fade } from 'svelte/transition';
	import CopyButton from './CopyButton.svelte';
	import { onMount } from 'svelte';
	import '$lib/assets/css/chat.postcss'

	export let modelId: string;
	export let disabled = false;
	export let isThinking = false;
	export let settings = defaultSettings;
	export let showUserInfoCollection = true;
	export let messages = [
		{
			text: settings.greeting,
			sender: 'bot'
		}
	];
	export let userId: string;

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

	$: messages[0].text = settings.greeting;

	export let trainingStatus: undefined | 'training' | 'complete' | 'ready' | 'failed';
	export let avatar: string | undefined = undefined;

	if (!settings.theme) {
		settings.theme = defaultSettings.theme;
	}

	let inputVal: string;
	let chatWindow: HTMLElement;
	const scrollToBottom = () => {
		if (chatWindow) {
			setTimeout(() => {
				chatWindow.scrollTop = chatWindow.scrollHeight;
			}, 100);
		}
	};

	// let enduserEmail: string;
	// let enduserName: string;
	// let enduserPhone: string;


	let collectUserInfo = false;
	let userInfoReceived = false;
	let endUserInfo = {}

	onMount(() => {
		endUserInfo = JSON.parse(localStorage.getItem('enduserInfo')) || {};
	});

	$: if (settings.collectUserName || settings.collectUserEmail || settings.collectUserPhone) {
		collectUserInfo = true;
	} else {
		collectUserInfo = false;
	}

	const handleUserInfoSubmit = () => {
		if (
			settings.collectUserName && !endUserInfo.name ||
			settings.collectUserEmail && !endUserInfo.email ||
			settings.collectUserPhone && !endUserInfo.phone
		) {
			return;
		}
		userInfoReceived = true;
		// addMessage('Thank you for providing your info.');
		// queryModel(modelId, chatSessionId, withheldMessage);
	};

	const postProcessMsgHTML = (msgHTML) => {
		msgHTML = msgHTML.replace(/<a href=/g, '<a target="_blank" href=');
		return msgHTML;
	};

	const addMessage = (message: string, sender = 'bot') => {
		messages = [...messages, { text: message, sender: sender }];
	};

	const queryModel = async (chatKey: string, chatSessionId: string, message: string) => {
		addMessage(message, 'user');
		inputVal = '';
		isThinking = true;

		let streamedMsg = '';

		let chunksCount = 0;
		try {
			const res = await fetch(`${PUBLIC_CHAT_API_URL}/chat/${chatKey}`, {
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
			const data = res.body;
			isThinking = false;
			const reader = data.getReader();
			reader.read().then(function pump({ done, value }) {
				if (done) {
					// Do something with last chunk of data then exit reader
					return;
				}
				// Otherwise do something here to process current chunk
				streamedMsg += new TextDecoder().decode(value);

				if (chunksCount === 0) {
					addMessage(streamedMsg, 'bot');
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
	const chatSessionId = generateNewSessionId();

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
		if (messages.length === 1) {
			initConversation();
		}
		if (isThinking) {
			addMessage('Please wait for me to finish thinking...');
			return;
		} else if (inputVal.trim() === '') {
			return;
		} else if (!modelId) {
			addMessage('Add some data for me to respond to answers about');
			inputVal = '';
			return;
		} else {
			queryModel(modelId, chatSessionId, inputVal);
		}
	};

	$: messages && scrollToBottom();

	const resetChat = () => {
		messages = [];
		addMessage(settings.greeting);
		generateNewSessionId();
		isThinking = false;
	};
</script>

<div
	style="
    --bg: {settings.theme.bg};
    --headerBG: {settings.theme.headerBG};
    --headerTitle: {settings.theme.headerTitle};
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
    background-color: var(--bg)"
	class="h-full flex flex-col justify-between rounded-2xl overflow-hidden flex-1 relative"
>
	{#if settings?.headerEnabled && settings.publicTitle !== ''}
		<header style="background-color: var(--headerBG)" class="flex p-4 items-center gap-2">
			<!-- <div class="h-8">
				<img src={avatar} alt="" class="h-full" />
		</div> -->
			<h1 class="font-light text-sm" style="color: var(--headerTitle)">
				{settings.publicTitle ? settings.publicTitle : ''}
			</h1>
		</header>
	{/if}
	<div class="overflow-y-auto scroll-smooth h-full flex-1" bind:this={chatWindow}>
		<button
			class="z-20 absolute top-2.5 right-2.5 btn btn-circle btn-sm btn-ghost flex items-center justify-center"
			style="color: var(--resetButton);"
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
		<BotStatus id={modelId} bind:trainingStatus />
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<div class="p-2">
			<slot>
				{#each messages as msg}
					<div
						class="chat relative !overflow-visible w-auto {msg.sender == 'bot'
							? 'chat-start'
							: 'chat-end'}"
					>
						{#if msg.sender === 'bot' && avatar}
							<div class="chat-image avatar">
								<div class="w-10">
									<img src={avatar} alt="" />
								</div>
							</div>
						{/if}
						<div
							class="chat-bubble relative"
							style={msg.sender == 'bot'
								? 'background-color: var(--botBubbleBG); color: var(--botBubbleText)'
								: 'background-color: var(--userBubbleBG); color: var(--userBubbleText)'}
						>
							<div class="message-body">
								{@html postProcessMsgHTML(
									marked.parse(msg.text, { mangle: false, headerIds: false })
								)}
							</div>
							<!-- {#if msg.sender === 'bot'}
							<div class="absolute dropdown dropdown-bottom dropdown-end -right-10 top-0 text-sm text-white">
								<label tabindex="0" class="m-1 btn btn-sm btn-ghost btn-circle"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 3c-.825 0-1.5.675-1.5 1.5S11.175 6 12 6s1.5-.675 1.5-1.5S12.825 3 12 3Zm0 15c-.825 0-1.5.675-1.5 1.5S11.175 21 12 21s1.5-.675 1.5-1.5S12.825 18 12 18Zm0-7.5c-.825 0-1.5.675-1.5 1.5s.675 1.5 1.5 1.5s1.5-.675 1.5-1.5s-.675-1.5-1.5-1.5Z"/></svg></label>
								<ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow rounded bg-neutral ">
									<div class="">
										<div class="text-right">

											<CopyButton textToCopy={msg.text} />
										</div>
									<li><span>👍</span></li>
									<li>
																<span>👎</span>
															</li>
								</div>
								</ul>
							</div>
						{/if} -->
						</div>
					</div>
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

	<form on:submit|preventDefault={submitQuery} class="form-control p-1">
		<!-- <div class="text-right text-xs mb-1.5 mr-2 flex justify-end gap-1 items-end leading-none">
			<a href="https://www.chatnode.ai" target="_blank">
				Powered by <svg class="inline" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 300 300" fill="none">
					<path d="M207.498 117.156C207.498 125.748 200.538 132.713 191.951 132.713H186.769C178.183 132.713 171.222 125.748 171.222 117.156L171.222 22.3358C171.222 18.1376 168.693 14.3326 164.757 12.8725C142.316 4.54795 118.043 0 92.7083 0H13.1546C5.99932 0 0.19884 5.80432 0.19884 12.9643C0.19884 38.2283 -0.189051 63.5278 0.118701 88.7948C0.170219 93.0246 3.62267 96.413 7.85274 96.413L83.1231 96.413C91.7095 96.413 98.67 103.378 98.67 111.97V117.156C98.67 125.748 91.7095 132.713 83.1231 132.713H13.504C8.6203 132.713 4.94385 137.175 6.10095 141.92C10.8745 161.493 18.4236 179.979 28.3074 196.934C31.3972 202.235 37.165 205.313 43.3003 205.313H191.951C200.538 205.313 207.498 212.279 207.498 220.871V226.056C207.498 234.648 200.538 241.613 191.951 241.613H76.0908C71.4431 241.613 69.2283 247.191 72.7581 250.215C108.992 281.253 156.054 300 207.491 300H300V207.429C300 138.818 266.711 77.9878 215.413 40.2283C212.086 37.7792 207.498 40.215 207.498 44.3462L207.498 117.156Z" fill="#818CF8"/>
				  </svg> ChatNode
			</a></div> -->
		<div>
			<div class="relative">
				<input
					type="text"
					placeholder={settings.inputPlaceholder}
					bind:value={inputVal}
					class="input w-full placeholder:text-sm join-item rounded-xl focus-within:outline-none"
					style="background-color: var(--inputBG); color: var(--inputText); border: 1px solid var(--inputBorder);"
					{disabled}
				/>
				{#if settings.sendButtonEnabled}
					<button
						class="send-button btn btn-square btn-sm border-none rounded-lg join-item focus-within:outline-none absolute right-2 top-2"
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
							type="text"
							class="input join-item w-full placeholder:text-sm"
							style="background-color: var(--inputBG); border-color: var(--inputBorder);"
							name="name"
							placeholder={settings.collectUserNameLabel}
							bind:value={endUserInfo.name}
						/>

				{/if}
				{#if settings.collectUserEmail}
					<input
						type="text"
						class="input join-item w-full placeholder:text-sm"
						style="background-color: var(--inputBG); border-color: var(--inputBorder);"
						placeholder={settings.collectUserEmailLabel}

						bind:value={endUserInfo.email}
					/>
				{/if}
				{#if settings.collectUserPhone}
					<input
						type="text"
						class="input join-item w-full placeholder:text-sm"
						style="background-color: var(--inputBG); border-color: var(--inputBorder);"
						placeholder={settings.collectUserPhoneLabel}
						bind:value={endUserInfo.phone}
					/>
				{/if}
				<input
					type="submit"
					class="btn join-item border-none"
					value="Start Chatting"
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
</style>
