<script lang="ts">
	import { PUBLIC_CHAT_API_URL } from '$env/static/public';
	import ChatWindow from '$lib/components/ChatWindow.svelte';
	import ChatBubble from '$lib/components/ChatBubble.svelte';
	import ChatInput from '$lib/components/ChatInput.svelte';
	import { Dropzone, Tabs, TabItem } from 'flowbite-svelte';
	import TrainingStatus from '$lib/components/TrainingStatus.svelte';
	import Icon from '@iconify/svelte';
	import { goto } from '$app/navigation';

	export let data;

	let { user } = data.user;

	let theme = {
		bg: '#FFFFFF',
		gptBubble: '#E9E9E9',
		userBubble: '#2C6BED',
		gptBubbleText: '#222222',
		userBubbleText: '#FFFFFF',
		inputText: '#000'
	};

	let method = 'text';

	let input: string;
	let chatInput: HTMLInputElement;

	let settings = {
		name: null,
		greeting: 'What can I help you with?'
	}

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

	let modelKey = '';

	$: console.log(modelKey);

	let step = 1;

	let textData: string;
	let files: FileList | undefined;

	let isTraining, training = false;
	let trainingMessage = 'Training your chatbot';

	const addMessage = (message: string, sender = 'bot') => {
		messages = [...messages, { text: message, sender: sender }];
	};

	const queryModel = async (modelKey: string, message: string) => {
		addMessage(message, 'user');
		input = '';
		try {
			const res = await fetch(`${PUBLIC_CHAT_API_URL}/chat/${modelKey}`, {
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

	const addModel = async (id: string, data_source_type: 'text' | 'file' | 'url', name: string) => {
		const res = await fetch('/api/models', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id,
				data_source_type
			})
		});
	};
	const updateModel = async (id: string, settings: Object) => {
		try{
			const res = await fetch('/api/models', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					id,
					settings
				})
			});
		} catch (err) {
			console.error(err)
		} finally {
			goto(`/account/chatbots/${id}`)
		}
	};

	const handleFileTraining = async () => {
		let bodyContent = new FormData();
		bodyContent.append('new_file', files[0] /*, optional filename */)
		bodyContent.append('user_id', user.userId)

		const res = await fetch(`${PUBLIC_CHAT_API_URL}/new-model/upload`, {
			method: 'POST',
			body: bodyContent
		});

		const data = await res.json();

		return data
	}

	const handleTextTraining = async () => {
		const res = await fetch(`${PUBLIC_CHAT_API_URL}/new_model`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				data_type: "text",
				train_key: textData,
				user_id: user.userId
			})
		});
		const data = await res.json();
		return data
	}

	const handleSubmit = async (modelDataType: 'text' | 'file' | 'url') => {
		training = true;
		step++;

		switch (modelDataType) {
			case 'text':
				try {
					const data = await handleTextTraining();
					modelKey = data.chat_key;
				} catch (err) {
					training = false;
					console.error(err);
				} break;
			case 'file':
				try {
					const data = await handleFileTraining();
					modelKey = data.chat_key;
				} catch (err) {
					console.error(err);
					training = true;
					trainingMessage = 'There was an error training your chatbot.';
				} break;
			case 'url':
				// statements
		}

		addModel(modelKey, modelDataType, settings);
		trainingMessage = 'Your chatbot is ready to go!';
		training = false;
		addMessage("I've been trained on your data and I'm ready to give you custom repsonses.");
	};
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
			<TabItem open title="Upload a File">
				<Dropzone
					id="dropzone"
					bind:files
					class="p-10 border-primary-600 border cursor-pointer hover:bg-primary-900/50"
				>
				{#if files}
					<p class="flex text-sm items-center gap-2">
						<Icon icon="mdi:file-upload-outline" height="24" />
						{files[0].name}
					</p>
				{:else}
					<Icon icon="line-md:cloud-upload-outline-loop" height="32" />
					<p class="my-4 text-sm">
						<span class="font-semibold">Click to upload</span> or drag and drop
					</p>
					<p class="text-xs font-semibold">.pdf or .txt allowed (300MB Max)</p>
				{/if}
			</Dropzone>
			<button class="button mt-4" type="submit" on:click={() => handleSubmit('file')}
				>Train Bot</button>
			</TabItem>
			<TabItem title="Copy/Paste Text">
				<div>
					<textarea
						name="textModel"
						class="h-80 max-h-screen text-xs w-full"
						placeholder="Paste your text here"
						bind:value={textData}
					/>
					<button class="button mt-4" type="submit" on:click={() => handleSubmit('text')}
						>Train Bot</button
					>
				</div>
			</TabItem>
			<!-- <TabItem title="URL">
				<div>
					<textarea
						name="url"
						class="h-80 max-h-screen text-xs w-full"
						placeholder="Paste your URL here"
						bind:value={url}
					/>
					<button class="button mt-4" type="submit" on:click={() => handleURLSubmit(textModel)}
						>Train Bot</button
					>
				</div>
			</TabItem> -->
		</Tabs>
	{:else if step == 2}
		<h2>Customize</h2>
		<div class="grid grid-cols-2 gap-4">
			<div class="space-y-4">
				<div>
					<label for="name">Name</label>
					<input name="name" bind:value={settings.name} type="text" class="w-3/4" />
				</div>
				<div>
					<label for="greeting">Greeting</label>
					<input name="greeting" bind:value={settings.greeting} type="text" class="w-3/4" />
				</div>
				<button type="submit" class="button" on:click={() => updateModel(modelKey, settings)}>Save</button>
			</div>
			<div>
				<div class="p-4 border border-slate-400 rounded-lg self-start">
					<ChatWindow {theme}>
						<svelte:fragment slot="messages">
							<ChatBubble text={settings.greeting} />
							{#each messages as { text, sender }}
								<ChatBubble {text} {sender} />
							{/each}
						</svelte:fragment>
						<div slot="input">
							<ChatInput
								bind:this={chatInput}
								autofocus={false}
								on:submit={() => queryModel(modelKey, input)}
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
