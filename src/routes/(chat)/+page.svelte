<script lang="ts">
	import ChatWindow from './ChatWindow.svelte';
	import ChatBubble from './ChatBubble.svelte';
	import ChatInput from './ChatInput.svelte';

	let messages = [{
		text: 'What can I help you with?',
		sender: 'bot'
	}];

    let theme = {
		bg: '#FFFFFF',
		gptBubble: '#E9E9E9',
		userBubble: '#2C6BED',
		gptBubbleText: '#222222',
		userBubbleText: '#FFFFFF'
	};
	let thinking = false;

	const addMessage = (message: string, sender = 'bot') => {
		messages = [...messages, { text: message, sender: sender }];
		if (sender == 'user') {thinking = true}
	}

	let input = '';

	let bottom: HTMLElement


	const queryGPT = async (message: string) => {
		input = '';
		addMessage(message, 'user')
		await fetch('https://chat-base-xxvbz.ondigitalocean.app/chat', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				message: message
			})
		})
		.then(res => res.json())
		.then((data) => {
			addMessage(data.message)
			thinking = false;
		})
		.catch((err) => {
			thinking = false;
			console.error(err);
			addMessage("I'm sorry, something went wrong.");
			bottom.scrollIntoView({ behavior: 'smooth' });
		});
	}

</script>


<div class="p-4 h-[70vh]">
	<ChatWindow {messages} {theme}>
		<svelte:fragment slot="messages">
			{#each messages as message, i}
				<ChatBubble message={message.text} sender={message.sender} />
			{/each}
			{#if thinking}
				<ChatBubble message="Thinking..." />
			{/if}
			<div bind:this={bottom}></div>
		</svelte:fragment>
		<div slot="input">
			<ChatInput bind:input on:submit={() => queryGPT(input)} />
		</div>
	</ChatWindow>

</div>
