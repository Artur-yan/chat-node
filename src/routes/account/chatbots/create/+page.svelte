<script lang="ts">
	import { PUBLIC_CHAT_API_URL } from '$env/static/public';
	import ChatWindow from '$lib/components/ChatWindow.svelte';
	import ChatBubble from '$lib/components/ChatBubble.svelte';
	import ChatInput from '$lib/components/ChatInput.svelte';
	import ColorPicker from 'svelte-awesome-color-picker';
	import { Dropzone, Tabs, TabItem } from 'flowbite-svelte';
	import TrainingStatus from '$lib/components/TrainingStatus.svelte';
	import { Prisma } from '@prisma/client';

	export let data

	let { user } = data.user

	let theme = {
		bg: '#FFFFFF',
		gptBubble: '#E9E9E9',
		userBubble: '#2C6BED',
		gptBubbleText: '#222222',
		userBubbleText: '#FFFFFF'
	};

	let method = 'text';

	let input: string;
	let chatInput: HTMLInputElement;

	let welcomeMessage = 'What can I help you with?';

	let messages = [
		{
			text: "I'm trying to build a chatbot!",
			sender: 'user'
		},
		{
			text: 'Great, I can help you with that!',
			sender: 'bot'
		}
	];

	let chatKey = '';

	let step = 1;

	let files: FileList | undefined;

	let textModel: string;
	let training = false;
	let trainingMessage = 'Training your chatbot';

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

	const addBot = async (id: string, data_source_type: 'text' | 'file' | 'url') => {
		const res = await fetch('/api/bots', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					id,
					data_source_type
				})
			});

	}

	const handleTextSubmit = async (text: string) => {
		training = true;
		step++;
		try {
			const res = await fetch(`${PUBLIC_CHAT_API_URL}/new_model`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					data_type: 'text',
					train_key: text,
					user_id: user.userId
				})
			});
			const data = await res.json();
			chatKey = data.chat_key;

			addBot(data.chat_key, 'text')

			training = false;
			trainingMessage = 'Your chatbot is ready to go!';
			addMessage("I've been trained on your data and I'm ready to give you custom repsonses.");
		} catch (err) {
			console.error(err);
		}
	};

	// const handleUpload = async (files) => {
	// 	training = true;
	// 	step++;
	// 	try {
	// 		const res = await fetch('https://chat-base-xxvbz.ondigitalocean.app/new_model', {
	// 			method: 'POST',
	// 			headers: {
	// 				'Content-Type': 'application/json'
	// 			},
	// 			body: JSON.stringify({
	// 				data_type: 'file',
	// 				train_key: files[0],
	// 				user_id: user.userId
	// 			})
	// 		});
	// 		const data = await res.json();
	// 		training = false;
	// 		trainingMessage = 'Your chatbot is ready to go!';
	// 		console.log(data);
	// 	} catch (err) {
	// 		console.error(err);
	// 		training = true;
	// 		trainingMessage = 'There was an error training your chatbot.';
	// 	}
	// };
</script>

<div class="container mt-10">
	{#if step == 1}
	<h2>How would you like to train your chatbot?</h2>

	<!-- <div class="flex w-full justify-stretch text-center text-secondary-500 mb-10">
					<button type="button" class="border border-primary-500 w-1/3 p-4 rounded-l-xl bg-primary-900" on:click={() => method = "text"}>Paste Text</button>
					<button type="button" class="border border-primary-500 w-1/3 p-4" on:click|preventDefault={() => method = "file"}>Upload File</button>
					<button type="button" class="border border-primary-500 w-1/3 p-4 rounded-r-xl" on:click={() => method = "url"}>URL</button>
				</div> -->

	<Tabs style="full" contentClass="my-4" defaultClass="flex">
		<TabItem open title="Copy/Paste Text">
			<div>
				<textarea
					name="textModel"
					class="h-80 max-h-screen text-xs w-full"
					placeholder="Paste your text here"
					bind:value={textModel}
				/>
				<button class="button mt-4" type="submit" on:click={() => handleTextSubmit(textModel)}>Train Bot</button>
			</div>
		</TabItem>
		<TabItem>
			<span slot="title">Upload a File</span>
			<Dropzone id="dropzone" bind:files>
				<svg
					aria-hidden="true"
					class="mb-3 w-10 h-10 text-gray-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
					/></svg
				>
				<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
					<span class="font-semibold">Click to upload</span> or drag and drop
				</p>
				<p class="text-xs text-gray-500 dark:text-gray-400">
					SVG, PNG, JPG or GIF (MAX. 800x400px)
				</p>
			</Dropzone>
		</TabItem>
	</Tabs>

	{:else if step == 2}

	<h2>Customize</h2>
	<div class="grid grid-cols-2 gap-4">
		<div>
			<label for="welcome-msg">Welcome Message</label>
			<input name="welcome-msg" bind:value={welcomeMessage} type="text" class="w-3/4" />
			<!-- <fieldset class="p-6 pb-8 gap-2 mt-8 border border-primary-500 rounded-lg">
						<legend class="label px-2">Customize colors</legend>
						<ColorPicker bind:hex={theme.bg} label="Background Color" />
						<ColorPicker bind:hex={theme.gptBubble} label="GPT Bubble" />
						<ColorPicker bind:hex={theme.userBubble} label="User Bubble" />
					</fieldset> -->
		</div>
		<div>
			<div class="p-4 border border-slate-400 rounded-lg self-start">
				<ChatWindow {theme}>
					<svelte:fragment slot="messages">
						<ChatBubble text={welcomeMessage} />
						{#each messages as { text, sender }}
							<ChatBubble {text} {sender} />
						{/each}
					</svelte:fragment>
					<div slot="input">
						<ChatInput
							bind:this={chatInput}
							autofocus={false}
							on:submit={() => queryChat(chatKey, input)}
							bind:input
						/>
					</div>
				</ChatWindow>
			</div>
		</div>
	</div>

	{/if}

	<TrainingStatus visible={step == 2} {training} {trainingMessage} />
</div>

<style lang="postcss">
	button[type='button'] {
		@apply bg-transparent text-secondary-500;
	}

	h2 {
		@apply text-xl font-light mb-4;
	}

	label {
		@apply text-sm block mb-1;
	}

	input,
	textarea {
		@apply p-2 rounded;
	}
</style>
