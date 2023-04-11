<script lang="ts">
	import { PUBLIC_CHAT_API_URL } from '$env/static/public';

	export let data;


	console.log(data);

	import { page } from '$app/stores';
	import ChatWindow from '$lib/components/ChatWindow.svelte';
	import ChatBubble from '$lib/components/ChatBubble.svelte';
	import ChatInput from '$lib/components/ChatInput.svelte';
	import { Drawer, CloseButton } from 'flowbite-svelte';
	import Icon from '@iconify/svelte';

	let settingsDrawerOpen = true; 
	let editingName = false;

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

	let theme = {
		bg: '',
		gptBubble: '#FFFDD1',
		userBubble: '#511A4E',
		gptBubbleText: '#222222',
		userBubbleText: '#FFFFFF',
		input: '',
		inputText: '#FFFDD1'
	};

	let greeting = 'What can I help you with?';
	let chatInput: HTMLInputElement;
	let input: string;

	let messages = [
		{
			text: greeting,
			sender: 'bot'
		}
	];
</script>

<div class="container">
	<div class="flex gap-2">
		<h1 class="py-2" contenteditable={editingName}>{data.bot.name ? data.bot.name : data.bot.id}</h1>
		<button on:click={() => editingName = true}><Icon icon="mdi:pencil-circle-outline" height="20" class="text-primary-400" /></button>
	</div>
	<ChatWindow {theme}>
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
	</ChatWindow>

	<Drawer transitionType="fly" bind:hidden={settingsDrawerOpen} id='settingsDrawer'>
		<h2>Settings</h2>
	
	</Drawer>
</div>
