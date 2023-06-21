<script lang="ts">
	import { PUBLIC_CHAT_API_URL } from '$env/static/public';
	import BotStatus from '$lib/components/BotStatus.svelte';
	import { defaultSettings } from '$lib/models';
	import { marked } from 'marked';

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

	const addMessage = (message: string, sender = 'bot') => {
		messages = [...messages, { text: message, sender: sender }];
	};

	const queryModel = async (chatKey: string, chatSessionId: string, message: string) => {
		addMessage(message, 'user');
		inputVal = '';
		isThinking = true;
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
			const data = await res.json();
			isThinking = false;
			addMessage(data.message);
		} catch (err) {
			isThinking = false;
			console.error(err);
		}
	};

	// Generate a random ID
	const chatSessionId = Math.random().toString(36).slice(2, 9) + '-' + Date.now();

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
	class="h-full flex flex-col justify-between rounded-lg"
>
	<div class="overflow-y-auto scroll-smooth p-2" bind:this={chatWindow}>
		<BotStatus id={modelId} bind:trainingStatus />
		<slot>
			{#each messages as msg}
				<div class="chat overflow-hidden {msg.sender == 'bot' ? 'chat-start' : 'chat-end'}">
					{#if msg.sender === 'bot' && avatar}
						<div class="chat-image avatar">
							<div class="w-10 rounded-full">
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
						{@html marked.parse(msg.text, {mangle: false, headerIds: false})}
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
