<script lang="ts">
	import { PUBLIC_CHAT_API_URL } from '$env/static/public';
	import BotStatus from '$lib/components/BotStatus.svelte';

	export let modelId: string;
	export let theme = {
		bg: 'transparent',
		botBubbleBG: '#E9E9E9',
		botBubbleText: '#222222',
		userBubbleBG: '#2C6BED',
		userBubbleText: '#FFFFFF',
		inputBG: '#FFFFFF',
		inputText: '#000'
	};
	export let inputPlaceholder = 'Type your message';
	export let disabled = false;
	export let isThinking = false;
	export let messages = [
		{
			text: 'Hello, how can I help you?',
			sender: 'bot'
		}
	];
	export let status: 'training' | 'ready' | 'failed' = 'ready';


	let inputVal: string;
	let chatWindow: HTMLElement;
	const scrollToBottom = () => {
		setTimeout(() => {
			chatWindow.scrollTop = chatWindow.scrollHeight;
		}, 100);
	};

	const addMessage = (message: string, sender = 'bot') => {
		messages = [...messages, { text: message, sender: sender }];
		scrollToBottom();
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

	const doubleMessage = () => {
		addMessage('Please wait for me to finish thinking...');
	};


	// Generate a random ID
	const chatSessionId = Math.random().toString(36).slice(2, 9) + '-' + Date.now();

	const submitQuery = () => {
		if (isThinking) {
			doubleMessage();
			return;
		} else if(inputVal.trim() === '') {
			return;
		} else {
			queryModel(modelId, chatSessionId, inputVal)
		}
	}



</script>

<section
	style="
    --bg: {theme.bg};
    --botBubbleBG: {theme.botBubbleBG};
    --botBubbleText: {theme.botBubbleText};
    --userBubbleBG: {theme.userBubbleBG};
    --userBubbleText: {theme.userBubbleText};
    --inputBG: {theme.inputBG};
    --inputText: {theme.inputText};
    background-color: var(--bg)"
	class="h-full flex flex-col justify-between"
>
	<div class="overflow-y-auto scroll-smooth" bind:this={chatWindow}>
		<BotStatus id={modelId} {status} />
		<slot>
			{#each messages as msg}
				<div class="chat {msg.sender == 'bot' ? 'chat-start' : 'chat-end'}">
					<div class="chat-bubble {msg.sender == 'bot' ? 'chat-bubble-secondary' : ''}">{msg.text}</div>
				</div>
			{/each}
		</slot>
		{#if isThinking}
			<div class="chat chat-start">
				<div class="chat-bubble">
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
				style="background-color: var(--inputBG); color: var(--inputText);"
				{disabled}
			/>
			<button class="btn btn-square" type="submit">
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
</section>


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

.chat-bubble{
	animation: message 0.3s ease-out 0s forwards;
}

.chat-start .chat-bubble{
	transform-origin: left center;
}
.chat-end .chat-bubble{
	transform-origin: right;
}
</style>