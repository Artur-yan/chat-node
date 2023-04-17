<script lang="ts">
	import { PUBLIC_CHAT_API_URL } from '$env/static/public';
	import ChatWindow from '$lib/components/ChatWindow.svelte';
	import ChatBubble from '$lib/components/ChatBubble.svelte';
	import ChatInput from '$lib/components/ChatInput.svelte';
	import { Dropzone, Tabs, TabItem, Toggle } from 'flowbite-svelte';
	import TrainingStatus from '$lib/components/TrainingStatus.svelte';
	import Icon from '@iconify/svelte';
	import { addModel, updateModel } from '$lib/models';

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

	let textData: string;
	let files: FileList | undefined;

	let isTraining,
		training = false;
	let trainingMessage = 'Training your chatbot';

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
		const res = await fetch(`${PUBLIC_CHAT_API_URL}/new_model`, {
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

	const handleSubmit = async (dataType: 'text' | 'file' | 'url') => {
		training = true;
		step++;

		switch (dataType) {
			case 'text':
				try {
					const data = await handleTextTraining();
					id = data.chat_key;
				} catch (err) {
					training = false;
					console.error(err);
				}
				break;
			case 'file':
				try {
					const data = await handleFileTraining();
					id = data.chat_key;
				} catch (err) {
					console.error(err);
					training = true;
					trainingMessage = 'There was an error training your chatbot.';
				}
				break;
			case 'url':
			// statements
		}

		addModel(id, dataType, name, settings);
		trainingMessage = 'Your chatbot is ready to go!';
		training = false;
		addMessage("I've been trained on your data and I'm ready to give you custom repsonses.");
	};
</script>

<div class="container mt-10">
	{#if step == 1}
		<h2>How would you like to train your chatbot?</h2>

		<Tabs style="full" contentClass="my-4" defaultClass="flex" color="primary">
			<TabItem open title="Upload a File" color="primary">
				<div class="form-control">
					<div class="input-group">
						<input
							type="file"
							class="file-input file-input-bordered file-input-primary"
							bind:files
						/>
						<button class="btn btn-primary" type="submit" on:click={() => handleSubmit('file')}
							>Train Bot</button
						>
					</div>
				</div>
			</TabItem>
			<TabItem title="Copy/Paste Text">
				<div>
					<textarea
						placeholder="Paste Your Text Here"
						class="textarea textarea-bordered textarea-sm w-full"
						bind:value={textData}
					/>

					<button class="btn btn-primary" type="submit" on:click={() => handleSubmit('text')}
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
				<div class="form-control w-full">
					<label class="label" for="name">
						<span class="label-text">Name</span>
					</label>
					<input
						type="text"
						name="name"
						class="input input-bordered w-full max-w-sm"
						bind:value={name}
					/>
				</div>
				<div class="form-control w-full max-w-lg">
					<label class="label" for="name">
						<span class="label-text">Greeting</span>
					</label>
					<input
						name="greeting"
						bind:value={settings.greeting}
						type="text"
						class="input input-bordered w-full"
					/>
				</div>
				<div class="form-control">
					<label class="label cursor-pointer justify-start gap-4">
						<span class="label-text">Private</span>
						<input
							type="checkbox"
							class="toggle toggle-warning input-success"
							bind:checked={settings.public}
						/>
						<span class="label-text">Public</span>
					</label>
				</div>
				<button type="submit" class="btn" on:click={() => updateModel(id, name, settings)}
					>Save</button
				>
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
								on:submit={() => queryModel(id, input)}
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
