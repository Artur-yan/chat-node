<script lang="ts">
	import { PUBLIC_CHAT_API_URL } from '$env/static/public';
	import TrainingStatus from '$lib/components/TrainingStatus.svelte';
	import { addModel } from '$lib/models';
	import ModelSettings from '$lib/components/ModelSettings.svelte';
	import Chat from '$lib/components/Chat.svelte';
	import Icon from '@iconify/svelte';

	export let data;

	let user = data.user.user;
	let modelId = '';
	let name = 'Untitled';
	let settings = {
		greeting: 'What can I help you with?',
		public: false,
		allowedUrls: [],
		supportMessage: 'Hmm, I am not sure',
		systemPrompt:
			'I want you to act as a document that I am having a conversation with. Your name is "AI Assistant". You will provide me with answers from the given info. Refuse to answer any question not about the text. Never break character. Do NOT say "Based on the given information"',
		userPrompt: ''
	};

	let messages = [
		{
			text: settings.greeting,
			sender: 'bot'
		},
		{
			text: 'Once your bot is trained, type a message to test your responses.',
			sender: 'bot'
		}
	];
	let busyFetchingUrls = false;
	let step = 1;
	let activeTab: number;
	let trainingStatus: null | 'training' | 'done' | 'error' = null;
	let fileInput: HTMLInputElement;
	let files: FileList | undefined;
	let textData: string;
	let url: string;
	let urls: Array<string>;
	let selectedUrls: Array<string> = [];
	let charCount = 0;
	let selectedUrlsCharCount = 0;

	$: {
		if (files && files[0].size > 500 * 1024 * 1024) {
			alert('This file is too large');
			fileInput.value = '';
		}
	}

	// Get Up[dated Character Count when selectedUrls changes
	$: {
		if (urls) {
			selectedUrlsCharCount = 0;
			urls.urls.forEach((url) => {
				if (selectedUrls.includes(url[0])) {
					selectedUrlsCharCount += Number(url[1]);
				}
			});
		}
	}

	const fetchUrlsToScrape = async () => {
		urls = undefined;
		charCount = 0;
		selectedUrlsCharCount = 0;
		try {
			busyFetchingUrls = true;
			const res = await fetch(`${PUBLIC_CHAT_API_URL}/scraping-urls`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					urls: [url],
					user_id: user.userId,
					session_id: data.user.session.sessionId
				})
			});
			urls = await res.json();
			urls.urls.forEach((url) => {
				selectedUrls.push(url[0]);
				charCount += Number(url[1]);
			});
			selectedUrlsCharCount = charCount;
		} catch (err) {
			throw err;
		} finally {
			busyFetchingUrls = false;
		}
		return;
	};

	const createModel = async (id: string) => {
		let body = new FormData();

		body.append('user_id', user.userId);
		body.append('session_id', data.user.session.sessionId);
		if (files) {
			body.append('file', files[0] /*, optional filename */);
		}
		if (textData) {
			body.append('text', textData);
		}
		if (selectedUrls) {
			body.append('urls', selectedUrls);
		}
		try {
			const res = await fetch(`${PUBLIC_CHAT_API_URL}/create-model`, {
				method: 'POST',
				body
			});
			const resJson = await res.json();
			modelId = resJson.chat_key;
			addModel(modelId, name, settings);
			step++;
		} catch (err) {
			console.error(err);
			alert('Something went wrong. Please try again later.');
		}
	};
</script>

<div class="container pb-20">
	<div class="text-sm breadcrumbs text-secondary pb-6 font-bold">
		<ul>
			<li><a href="/account/chatbots">&larr; Chatbots</a></li>
			<li>Create</li>
			<li class:active={step == 1}>Train</li>
			<li class:active={step == 2}>Customize</li>
		</ul>
	</div>

	{#if step == 1}
		<h2 class="text-lg mb-4">Add your first data to get started.</h2>
		<div class="mb-10">
			<label class="btn text-primary" class:btn-outline={activeTab == 0}>
				<input type="radio" name="tab" bind:group={activeTab} value={0} class="hidden peer" />
				+ File
			</label>
			<label class="btn text-primary" class:btn-outline={activeTab == 1}>
				<input type="radio" name="tab" bind:group={activeTab} value={1} class="hidden peer" />
				+ Text
			</label>
			<label class="btn text-primary" class:btn-outline={activeTab == 2}>
				<input type="radio" name="tab" bind:group={activeTab} value={2} class="hidden peer" />
				+ URL
			</label>
		</div>

		{#if activeTab == 0}
			<input
				type="file"
				class="file-input file-input-bordered file-input-primary"
				bind:files
				bind:this={fileInput}
				accept=".doc,.docx,.pdf,.txt,.csv,.json"
			/>
			<button class="btn btn-primary" type="submit" on:click={createModel}>Train Bot</button>
			<p class="help">PDF, TXT, CSV, JSON or DOC files only (MAX 50MB)</p>
		{:else if activeTab == 1}
			<div>
				<textarea
					placeholder="Paste your text"
					class="textarea textarea-bordered textarea-sm w-full"
					bind:value={textData}
					rows="8"
					maxlength="50000"
					autofocus
				/>
				<p class="help">Max 50,000 characters</p>

				<button class="btn btn-primary mt-10" type="submit" on:click={createModel}>Train Bot</button
				>
			</div>
		{:else if activeTab == 2}
			<div class="input-group">
				<form on:submit={() => fetchUrlsToScrape()}>
					<input
						type="url"
						placeholder="https://yourwebsite.com"
						class="input input-bordered w-96 max-w-full"
						bind:value={url}
						required
						autofocus
					/>

					<button class="btn btn-primary" type="submit" class:loading={busyFetchingUrls}>
							Fetch URLs
					</button>
				</form>
			</div>
			<p class="help mb-10">Please be sure to include http:// or https://</p>
			{#if urls}
				<table class="table table-zebra table-compact w-full">
					<thead>
						<tr>
							<th><!-- <input type="checkbox" class="checkbox" />--></th>
							<th>url</th>
							<th>character count</th>
						</tr>
					</thead>
					<tbody>
						{#each urls.urls as url}
							<tr>
								<td>
									<input
										type="checkbox"
										class="checkbox"
										checked={true}
										value={url[0]}
										bind:group={selectedUrls}
									/>
								</td>
								<td>{url[0]}</td>
								<td>{url[1]}</td>
							</tr>
						{/each}
					</tbody>
					<tfoot>
						<tr>
							<td />
							<td>Urls: {selectedUrls.length}/{urls.urls.length}</td>
							<td>Total Characters: {selectedUrlsCharCount}/{charCount}</td>
						</tr>
					</tfoot>
				</table>
				<!-- <div>
					  <div>URL Count: {urls.urls.length}</div>
					  <div>Selected URLs Character Count: {selectedUrlsCharCount}</div>
					  <div>Character Count: {charCount}</div>
					  <progress class="relative progress progress-info" value={selectedUrlsCharCount} max={data.subscription.max_tocken}></progress>
				</div> -->
				{#if selectedUrlsCharCount > data.subscription.max_tocken}
					<div class="alert alert-warning shadow-lg">
						<div>
							<span
								>Character count exceeds account allowance. Please select fewer urls or <a
									href="/account/settings/plan"
									class="link">upgrade your plan</a
								>.</span
							>
						</div>
					</div>
				{/if}
				<button
					class="btn mt-8"
					on:click={createModel}
					disabled={selectedUrlsCharCount > data.subscription.max_tocken}
					>Scrape Urls for data</button
				>
			{/if}
		{/if}
	{:else if step == 2}
		<div class="grid md:grid-cols-[2fr_3fr] gap-6">
			<div>
				<ModelSettings id={modelId} {name} {settings} />
			</div>
			<div>
				<div class="flex">
					<TrainingStatus {trainingStatus} />
				</div>
				<div class="h-[calc(100vh_-_16rem)]">
					<Chat {modelId} {messages} disabled={trainingStatus != 'done'} status="training" />
				</div>
			</div>
		</div>
	{/if}
</div>

<style lang="postcss">
	.help {
		@apply text-sm opacity-50 mt-2;
	}

	.breadcrumbs .active {
		@apply text-xl;
	}
</style>
