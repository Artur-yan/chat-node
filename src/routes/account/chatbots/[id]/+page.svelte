<script lang="ts">
	import { PUBLIC_CHAT_API_URL } from '$env/static/public';

	export let data;

	import { page } from '$app/stores';
	import ChatWindow from '$lib/components/ChatWindow.svelte';
	import ChatBubble from '$lib/components/ChatBubble.svelte';
	import ChatInput from '$lib/components/ChatInput.svelte';
	import Icon from '@iconify/svelte';
	import { updateModel } from '$lib/models';
	import { PUBLIC_SITE_URL } from '$env/static/public';
	import { Toggle } from 'flowbite-svelte';

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
		greeting: data.model.settings.greeting,
		public: data.model.settings.public
	};

	let iframeEmbedCode = `<iframe src="${PUBLIC_SITE_URL}/embed/${data.model.id}" width="100%" height="100%" style="border: none;"></iframe>`;

	let chatInput: HTMLInputElement;
	let input: string;

	let messages = [
		{
			text: settings.greeting,
			sender: 'bot'
		}
	];
</script>

<div class="drawer drawer-end">
	<input id="settings-drawer" type="checkbox" class="drawer-toggle" bind:checked={drawerOpen} />
	<div class="drawer-content">
		<div class="container">
			<div class="flex items-center py-4 justify-between gap-4">
				<div class="flex items-baseline">
					<h1 class="mr-2">{settings.name}</h1>
					<div class="text-xs text-primary-500">id:{data.model.id}</div>
				</div>
				<label for="settings-drawer" class="drawer-button btn btn-primary">Settings</label>
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
	</div>
	<div class="drawer-side">
		<label for="settings-drawer" class="drawer-overlay" />
		<ul class="menu p-4 w-full md:w-2/3 lg:w-1/2 bg-base-100 text-base-content">
			<div class="flex items-center justify-between mb-4">
				<h5>Settings</h5>
			</div>
			<form
				on:submit={updateModel(data.model.id, data.model.name, settings)}
				class="space-y-4 mb-10"
			>
				<div>
					<label for="name" class="label">
						<span class="label-text">Name</span>
					</label>
					<input
						type="text"
						bind:value={settings.name}
						class="input input-bordered input-primary w-full"
					/>
				</div>
				<div>
					<label for="greeting" class="label">
						<span class="label-text">Greeting</span>
					</label>
					<input
						type="text"
						bind:value={settings.greeting}
						class="input input-bordered input-primary w-full"
					/>
				</div>
				<div class="form-control w-64">
					<label class="label cursor-pointer">
						<span class="label-text">Private</span>
						<input
							type="checkbox"
							class="toggle toggle-warning input-success"
							bind:checked={settings.public}
						/>
						<span class="label-text">Public</span>
					</label>
				</div>
				<button class="btn btn-primary" type="submit">Save</button>
			</form>

			<h6>Embed Code</h6>
			<div class="mockup-code w-full">
				<pre><code>{iframeEmbedCode}</code></pre>
			</div>
		</ul>
	</div>
</div>
