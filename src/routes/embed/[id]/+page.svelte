<script lang="ts">
	import { PUBLIC_CHAT_API_URL } from '$env/static/public';

	export let data;

	const addMessage = (message: string, sender = 'bot') => {
		messages = [...messages, { text: message, sender: sender }];
	};

	const queryChat = async (chatKey: string, message: string) => {
		addMessage(message, 'user');
		input = '';
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
			console.error(err);
		}
	};

	let greeting = data.bot.settings.greeting;
	let input: string;
	import Chat from '$lib/components/Chat.svelte';

	let messages = [
		{
			text: greeting,
			sender: 'bot'
		}
	];
</script>

<!-- <ChatWindow {theme}>
	<svelte:fragment slot="messages">
		{#each messages as { text, sender }}
			<ChatBubble {text} {sender} />
		{/each}
	</svelte:fragment>
	<div slot="input">
		<ChatInput
			bind:this={chatInput}
			autofocus={false}
			on:submit={() => queryChat($page.params.id, input)}
			bind:input
		/>
	</div>
</ChatWindow> -->

<Chat {messages} {greeting} />
