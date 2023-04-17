<script lang="ts">
    import { PUBLIC_CHAT_API_URL } from '$env/static/public';

	export let theme = {
		bg: 'transparent',
		botBubbleBG: '#E9E9E9',
		botBubbleText: '#222222',
		userBubbleBG: '#2C6BED',
		userBubbleText: '#FFFFFF',
		inputBG: '#FFFFFF',
		inputText: '#000'
	};
	export let greeting = 'What can I help you with?';
	export let messages = [
		{
			text: greeting,
			sender: 'bot'
		}
	];
	export let inputPlaceholder = 'Type your message';
	let inputVal: string;
	let disabled = false;

	const addMessage = (message: string, sender = 'bot') => {
		messages = [...messages, { text: message, sender: sender }];
	};

	const queryModel = async (chatKey: string, message: string) => {
		addMessage(message, 'user');
		inputVal = '';
		try {
			const res = await fetch(`${PUBLIC_CHAT_API_URL}/chat/${chatKey}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					message: message
				})
			});
			const data = await res.json();
			addMessage(data.message);
		} catch (err) {
			console.error(err);BG
		}
	};
</script>

<section 	style="
    --bg: {theme.bg};
    --botBubbleBG: {theme.botBubbleBG};
    --botBubbleText: {theme.botBubbleText};
    --userBubbleBG: {theme.userBubbleBG};
    --userBubbleText: {theme.userBubbleText};
    --inputBG: {theme.inputBG};
    --inputText: {theme.inputText};
    background-color: var(--bg)">




{#each messages as msg}
	<div class="chat {msg.sender == 'bot' ? 'chat-start' : 'chat-end'}">
		<div class="chat-bubble">{msg.text}</div>
	</div>
{/each}

<form on:submit|preventDefault={() => queryModel(modelId, inputVal)} class="form-control p-2">
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
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
				/></svg
			>
		</button>
	</div>
</form>

</section>