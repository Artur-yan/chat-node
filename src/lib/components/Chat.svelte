<script lang="ts">
	import { PUBLIC_CHAT_API_URL } from '$env/static/public';
	import BotStatus from '$lib/components/BotStatus.svelte';
	import { defaultSettings } from '$lib/models';
	import { marked } from 'marked';
	import CopyButton from './CopyButton.svelte';

	export let modelId: string;
	export let inputPlaceholder = 'Type your message';
	export let disabled = false;
	export let isThinking = false;
	export let settings = defaultSettings;
	export let messages = [
		{
			text: settings.greeting,
			sender: 'bot'
		}
	];

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
	let chatSessionId: string
	const generateNewSessionId = () => {
		chatSessionId = Math.random().toString(36).slice(2, 9) + '-' + Date.now();
	};
	generateNewSessionId();

	const submitQuery = () => {
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
		generateNewSessionId()
		isThinking = false
	};
</script>

<div
	style="
    --bg: {settings.theme.bg};
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
	class="h-full flex flex-col justify-between rounded-lg overflow-hidden flex-1"
>
<div class="overflow-y-auto scroll-smooth h-full" bind:this={chatWindow}>
		{#if settings?.showHeader}
			<header class="p-2 flex justify-between">
				<div>{settings.publicTitle ? settings.publicTitle : ''}</div>
			</header>
		{/if}
		<button class="absolute top-1 right-1 btn btn-circle btn-sm btn-ghost tooltip tooltip-left flex items-center justify-center" data-tip="refresh chat" on:click={resetChat}>
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M17.65 6.35a7.95 7.95 0 0 0-6.48-2.31c-3.67.37-6.69 3.35-7.1 7.02C3.52 15.91 7.27 20 12 20a7.98 7.98 0 0 0 7.21-4.56c.32-.67-.16-1.44-.9-1.44c-.37 0-.72.2-.88.53a5.994 5.994 0 0 1-6.8 3.31c-2.22-.49-4.01-2.3-4.48-4.52A6.002 6.002 0 0 1 12 6c1.66 0 3.14.69 4.22 1.78l-1.51 1.51c-.63.63-.19 1.71.7 1.71H19c.55 0 1-.45 1-1V6.41c0-.89-1.08-1.34-1.71-.71l-.64.65z"/></svg>
		</button>
		<BotStatus id={modelId} bind:trainingStatus />
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<div class="p-2">

		<slot>
			{#each messages as msg}
				<div class="chat relative !overflow-visible {msg.sender == 'bot' ? 'chat-start' : 'chat-end'}">
					{#if msg.sender === 'bot' && avatar}
						<div class="chat-image avatar">
							<div class="w-10">
								<img src={avatar} alt="" />
							</div>
						</div>
					{/if}
					<div
						class="chat-bubble"
						style={msg.sender == 'bot'
							? 'background-color: var(--botBubbleBG); color: var(--botBubbleText)'
							: 'background-color: var(--userBubbleBG); color: var(--userBubbleText)'}
					>
						{@html postProcessMsgHTML(marked.parse(msg.text, { mangle: false, headerIds: false }))}
					</div>
					<div class="absolute dropdown dropdown-bottom dropdown-end right-0 top-0">
						<label tabindex="0" class="m-1 btn btn-sm btn-ghost btn-circle"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 3c-.825 0-1.5.675-1.5 1.5S11.175 6 12 6s1.5-.675 1.5-1.5S12.825 3 12 3Zm0 15c-.825 0-1.5.675-1.5 1.5S11.175 21 12 21s1.5-.675 1.5-1.5S12.825 18 12 18Zm0-7.5c-.825 0-1.5.675-1.5 1.5s.675 1.5 1.5 1.5s1.5-.675 1.5-1.5s-.675-1.5-1.5-1.5Z"/></svg></label>
						<ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow rounded w-52 bg-neutral ">
							<div class="flex items-center">
							  <li><CopyButton textToCopy={msg.text} /></li>
							<li><span>👍</span></li>
							<li>
														<span>👎</span>
													</li>
						  </div>
						</ul>
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
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
						><circle cx="4" cy="12" r="3" fill="currentColor"
							><animate
								id="svgSpinners3DotsBounce0"
								attributeName="cy"
								begin="0;svgSpinners3DotsBounce1.end+0.25s"
								calcMode="spline"
								dur="0.6s"
								keySplines=".33,.66,.66,1;.33,0,.66,.33"
								values="12;6;12"
							/></circle
						><circle cx="12" cy="12" r="3" fill="currentColor"
							><animate
								attributeName="cy"
								begin="svgSpinners3DotsBounce0.begin+0.1s"
								calcMode="spline"
								dur="0.6s"
								keySplines=".33,.66,.66,1;.33,0,.66,.33"
								values="12;6;12"
							/></circle
						><circle cx="20" cy="12" r="3" fill="currentColor"
							><animate
								id="svgSpinners3DotsBounce1"
								attributeName="cy"
								begin="svgSpinners3DotsBounce0.begin+0.2s"
								calcMode="spline"
								dur="0.6s"
								keySplines=".33,.66,.66,1;.33,0,.66,.33"
								values="12;6;12"
							/></circle
						></svg
					>
				</div>
			</div>
		{/if}
	</div>

		<div id="chat-bottom" class="h-1" />
	</div>

	<form on:submit|preventDefault={submitQuery} class="form-control p-2">
		<div class="input-group">
			<input
				type="text"
				placeholder={inputPlaceholder}
				bind:value={inputVal}
				class="input w-full"
				style="background-color: var(--inputBG); color: var(--inputText); border: 1px solid var(--inputBorder); border-right: none;"
				{disabled}
			/>
			<button
				class="btn btn-square border-none"
				type="submit"
				name="Send"
				style="background-color: var(--sendButtonBG) !important; color: var(--sendButtonIconColor);"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
					><path
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9.912 12H4L2.023 4.135A.662.662 0 0 1 2 3.995c-.022-.721.772-1.221 1.46-.891L22 12L3.46 20.896c-.68.327-1.464-.159-1.46-.867a.66.66 0 0 1 .033-.186L3.5 15"
					/></svg
				>
			</button>
		</div>
	</form>
	<style>
		.chat-bubble table,
		.chat-bubble td,
		.chat-bubble th {
			border: 1px solid rgba(0, 0, 0, 0.25) !important;
			border-collapse: collapse;
			padding: 4px;
		}

		.chat-bubble th {
			text-align: left;
		}

		.chat-start .chat-bubble {
			transform-origin: left center;
		}
		.chat-end .chat-bubble {
			transform-origin: right;
		}

		.chat-bubble a {
			text-decoration: underline !important;
			overflow-wrap: break-word;
			word-wrap: break-word;
			hyphens: auto;
		}

		.chat-bubble ul {
			list-style: disc;
			margin-left: 2em;
		}
		.chat-bubble ol {
			list-style: decimal;
			margin-left: 2em;
		}
	</style>
</div>

<style lang="postcss">
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
