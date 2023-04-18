<script lang="ts">
	import { PUBLIC_CHAT_API_URL } from '$env/static/public';
	import ChatWindow from '$lib/components/ChatWindow.svelte';
	import ChatBubble from '$lib/components/ChatBubble.svelte';
	import ChatInput from '$lib/components/ChatInput.svelte';
	import TrainingStatus from '$lib/components/TrainingStatus.svelte';
	import { addModel, updateModel } from '$lib/models';
	import ModelSettings from '$lib/components/ModelSettings.svelte';

	export let data;

	let { user } = data.user;

	let activeTab = 0;

	let theme = {
		bg: '#FFFFFF',
		gptBubble: '#E9E9E9',
		userBubble: '#2C6BED',
		gptBubbleText: '#222222',
		userBubbleText: '#FFFFFF',
		inputText: '#000'
	};

	let input: string;
	let chatInput: HTMLInputElement;

	let name = 'Untitled';
	let settings = {
		greeting: 'What can I help you with?',
		public: false,
		allowedUrls: []
	};

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

	let id = '';

	let step = 1;

	let trainingStatus: null | 'training' | 'done' | 'error' = null;

	let files: FileList | undefined;
	let textData: string;
	let url: string;

	const addMessage = (message: string, sender = 'bot') => {
		messages = [...messages, { text: message, sender: sender }];
	};

	const queryModel = async (id: string, message: string) => {
		addMessage(message, 'user');
		input = '';
		try {
			const res = await fetch(`${PUBLIC_CHAT_API_URL}/chat/${id}`, {
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

	const handleFileTraining = async () => {
		let bodyContent = new FormData();
		bodyContent.append('new_file', files[0] /*, optional filename */);
		bodyContent.append('user_id', user.userId);

		const res = await fetch(`${PUBLIC_CHAT_API_URL}/new-model/upload`, {
			method: 'POST',
			body: bodyContent
		});

		const data = await res.json();

		return data;
	};

	const handleTextTraining = async () => {
		const res = await fetch(`${PUBLIC_CHAT_API_URL}/new-model`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				data_type: 'text',
				train_key: textData,
				user_id: user.userId
			})
		});
		const data = await res.json();
		return data;
	};

	const handleUrlTraining = async () => {
		const res = await fetch(`${PUBLIC_CHAT_API_URL}/new-model/urls`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				urls: [url],
				user_id: user.userId
			})
		});
		const data = await res.json();
		console.log(data);
		return data;
	};

	const handleSubmit = async (dataType: 'text' | 'file' | 'url') => {
		trainingStatus = 'training';
		step++;

		switch (dataType) {
			case 'text':
				try {
					const data = await handleTextTraining();
					id = data.chat_key;
				} catch (err) {
					trainingStatus = 'error';
					console.error(err);
				}
				break;
			case 'file':
				try {
					const data = await handleFileTraining();
					id = data.chat_key;
				} catch (err) {
					console.error(err);
					trainingStatus = 'error';
				}
				break;
			case 'url':
				try {
					const data = await handleUrlTraining();
					id = data.chat_key;
				} catch (err) {
					console.error(err);
					trainingStatus = 'error';
				}
				break;
			case 'url':
			// statements
		}

		addModel(id, dataType, name, settings);
		trainingStatus = 'done';
		addMessage("I've been trained on your data and I'm ready to give you custom repsonses.");
	};
</script>

<div class="container mt-10">
	{#if step == 1}
		<h2 class="mb-6 text-2xl font-light">How would you like to train your chatbot?</h2>
		<div class="tabs tabs-boxed mb-10">
			<label class="tab" class:tab-active={activeTab == 0}>
				<input type="radio" name="tab" bind:group={activeTab} value={0} class="hidden peer" />
				Upload a file
			</label>
			<label class="tab" class:tab-active={activeTab == 1}>
				<input type="radio" name="tab" bind:group={activeTab} value={1} class="hidden peer" />
				Copy/paste text
			</label>
			<label class="tab" class:tab-active={activeTab == 2}>
				<input type="radio" name="tab" bind:group={activeTab} value={2} class="hidden peer" />
				Scrape a URL
			</label>
		</div>

		{#if activeTab == 0}
					<input type="file" class="file-input file-input-bordered file-input-primary" bind:files />
					<button class="btn btn-primary" type="submit" on:click={() => handleSubmit('file')}
						>Train Bot</button
					>
		{:else if activeTab == 1}
			<div>
				<textarea
					placeholder="Paste your text"
					class="textarea textarea-bordered textarea-sm w-full"
					bind:value={textData}
					rows="8"
				/>

				<button class="btn btn-primary" type="submit" on:click={() => handleSubmit('text')}
					>Train Bot</button
				>
			</div>
		{:else if activeTab == 2}
			<div class="input-group">
				<form on:submit={() => handleSubmit('url')}>
					<input
						type="text"
						placeholder="example.com"
						class="input input-bordered"
						bind:value={url}
					/>

					<button class="btn btn-primary" type="submit">Train Bot</button>
				</form>
			</div>
		{/if}
	{:else if step == 2}
		<h2>Customize</h2>
		<div class="grid grid-cols-2 gap-4">
			<ModelSettings {id} {name} {settings} />
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
								on:submit={() => queryModel(id, input)}
								bind:input
							/>
						</div>
					</ChatWindow>
				</div>
			</div>
		</div>
	{/if}

	<TrainingStatus {trainingStatus} />
</div>
