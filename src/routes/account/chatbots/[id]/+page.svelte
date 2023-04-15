<script lang="ts">
	import { PUBLIC_CHAT_API_URL } from '$env/static/public';

	export let data;
	
	import { page } from '$app/stores';
	import ChatWindow from '$lib/components/ChatWindow.svelte';
	import ChatBubble from '$lib/components/ChatBubble.svelte';
	import ChatInput from '$lib/components/ChatInput.svelte';
	import Icon from '@iconify/svelte';
	import { updateModel } from '$lib/models';

	let drawerOpen = false;

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
		bg: '#FFFFFF',
		gptBubble: '#E9E9E9',
		userBubble: '#2C6BED',
		gptBubbleText: '#222222',
		userBubbleText: '#FFFFFF',
		inputText: '#000'
	};

	let settings = {
		name: data.model.name,
		greeting: data.model.greeting
	}

	let chatInput: HTMLInputElement;
	let input: string;

	let messages = [
		{
			text: settings.greeting,
			sender: 'bot'
		}
	];
</script>

<div class="container">
	<div class="flex items-center py-4 justify-between gap-4">
		<div class="flex items-baseline">
			<h1 class="mr-2">{settings.name}</h1>
			<div class="text-xs text-primary-500">id:{data.model.id}</div>
		</div>
		<button class="text-primary-400 p-2" on:click={() => drawerOpen = !drawerOpen}>
			<Icon icon="mdi:settings" width="18" />
		</button>
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

</div>
<div class:hidden={!drawerOpen} id='sidebar1' class="fixed inset-0 left-auto w-1/2 max-w-2xl min-w-max h-full bg-black p-4">
	<div class="flex items-center justify-between mb-4">
	  <h5>Settings</h5>
	  <button type="button" on:click={() => (drawerOpen = false)} class="p-2">
		  <Icon icon="mdi:close" width="18" />
	  </button>

	</div>
	<form on:submit={updateModel(data.model.id, settings)} class="space-y-4">
		<div>
			<label for="greeting">Name</label>
			<input type="text" bind:value={settings.name} class="w-full p-2 rounded-md border border-gray-300" />
		</div>
		<div>
			<label for="greeting">Greeting</label>
			<input type="text" bind:value={settings.greeting} class="w-full p-2 rounded-md border border-gray-300" />
		</div>
		<button class="button" type="submit">Save</button>
	</form>
</div>
