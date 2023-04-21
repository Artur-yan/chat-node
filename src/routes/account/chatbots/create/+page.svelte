<script lang="ts">
	import { PUBLIC_CHAT_API_URL } from '$env/static/public';
	import TrainingStatus from '$lib/components/TrainingStatus.svelte';
	import { addModel } from '$lib/models';
	import ModelSettings from '$lib/components/ModelSettings.svelte';
	import Chat from '$lib/components/Chat.svelte';
	export let data;

	let { user } = data.user;

	let activeTab = 0;

	let modelId = '';

	let name = 'Untitled';
	let settings = {
		greeting: 'What can I help you with?',
		public: false,
		allowedUrls: []
	};

	let messages = [
		{
			text: settings.greeting,
			sender: 'bot'
		},
		{
			text: "I'm trying to build a chatbot!",
			sender: 'user'
		},
		{
			text: 'Great, I can help you with that!',
			sender: 'bot'
		}
	];

	let step = 1;

	let trainingStatus: null | 'training' | 'done' | 'error' = null;

	let fileInput: HTMLInputElement;
	let files: FileList | undefined;
	let textData: string;
	let url: string;

	$: {
		if(files && files[0].size >  500 * 1024 * 1024) {
			alert('This file is too large')
			fileInput.value = ''
		}
	}

	$: console.log(files)

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
					modelId = data.chat_key;
				} catch (err) {
					trainingStatus = 'error';
					console.error(err);
				}
				break;
			case 'file':
				try {
					const data = await handleFileTraining();
					modelId = data.chat_key;
				} catch (err) {
					console.error(err);
					trainingStatus = 'error';
				}
				break;
			case 'url':
				try {
					const data = await handleUrlTraining();
					modelId = data.chat_key;
				} catch (err) {
					console.error(err);
					trainingStatus = 'error';
				}
				break;
			case 'url':
			// statements
		}

		addModel(modelId, dataType, name, settings);
		trainingStatus = 'done';

		messages.push({
			text: "I've been trained on your data and I'm ready to give you custom repsonses.",
			sender: 'bot'
		});
	};
</script>

<div class="container mt-10">
    <div class="text-sm breadcrumbs text-secondary mb-6 font-bold">
        <ul>
			<li><a href="/account/chatbots">&larr; Chatbots</a></li> 
			<li>Create</li> 
			<li class:active={step == 1}>Train</li> 
			<li class:active={step == 2}>Customize</li> 
		  </ul>
	  </div>
	{#if step == 1}
		<div class="tabs tabs-boxed mb-10">
			<label class="tab text-primary" class:tab-active={activeTab == 0}>
				<input type="radio" name="tab" bind:group={activeTab} value={0} class="hidden peer" />
				Upload a file
			</label>
			<label class="tab text-primary" class:tab-active={activeTab == 1}>
				<input type="radio" name="tab" bind:group={activeTab} value={1} class="hidden peer" />
				Copy/paste text
			</label>
			<label class="tab text-primary" class:tab-active={activeTab == 2}>
				<input type="radio" name="tab" bind:group={activeTab} value={2} class="hidden peer" />
				Scrape a URL
			</label>
		</div>

		{#if activeTab == 0}
			<input type="file" class="file-input file-input-bordered file-input-primary" bind:files bind:this={fileInput} accept=".doc,.docx,.pdf,.txt" />
			<button class="btn btn-primary" type="submit" on:click={() => handleSubmit('file')}
				>Train Bot</button
			>
			<p class="help">PDF, TXT or DOC files only (MAX 50MB)</p>
		{:else if activeTab == 1}
			<div>
				<textarea
					placeholder="Paste your text"
					class="textarea textarea-bordered textarea-sm w-full"
					bind:value={textData}
					rows="8"
					maxlength="50000"
				/>
				<p class="help">Max 50000 characters</p>

				<button class="btn btn-primary mt-10" type="submit" on:click={() => handleSubmit('text')}
					>Train Bot</button
				>
			</div>
		{:else if activeTab == 2}
			<div class="input-group">
				<form on:submit={() => handleSubmit('url')}>
					<input
						type="url"
						placeholder="https://yourwebsite.com"
						class="input input-bordered"
						bind:value={url}
					/>

					<button class="btn btn-primary" type="submit">Train Bot</button>
				</form>
			</div>
			<p class="help">Please be sure to include http:// or https://</p>

		{/if}
	{:else if step == 2}
		<h2>Customize</h2>
		<div class="grid md:grid-cols-2 gap-4">
			<ModelSettings id={modelId} {name} {settings} />
			<div>
				<div class="p-4 border border-slate-400 rounded-lg self-start h-full">
					<Chat {modelId} {messages} disabled={trainingStatus != "done"} />
				</div>
			</div>
		</div>
	{/if}

	<TrainingStatus {trainingStatus} />
</div>

<style lang="postcss">
	.help{
		@apply text-sm opacity-50 mt-2;
	}

	.breadcrumbs .active{
		@apply text-xl;
	}
</style>