<script lang="ts">
	import { PUBLIC_CHAT_API_URL } from '$env/static/public';
	import { addModel } from '$lib/models';
	import ModelSettings from '$lib/components/ModelSettings.svelte';
	import Chat from '$lib/components/Chat.svelte';
	import { alert } from '$lib/stores.js';

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

	$: console.log(urls)

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
	let trainingStatus: 'training' | 'ready' | 'failed' = 'ready';
	let fileInput: HTMLInputElement;
	let files: FileList | undefined;
	let textData: string;
	let url: string;
	let urls
	let selectedUrls: Array<string> = [];
	let charCount = 0;
	let selectedUrlsCharCount = 0;

	$: {
		if (files && files[0].size > 50 * 1024 * 1024) {
			$alert = 'This file is too large'
			fileInput.value = '';
		}
	}



	// Get Up[dated Character Count when selectedUrls changes
	$: {
		if (selectedUrls.length > 0) {
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
			$alert = err
		} finally {
			busyFetchingUrls = false;
		}
		return;
	};

	const createModel = async (id: string) => {
		trainingStatus = 'training';
		let body = new FormData();

		body.append('user_id', user.userId);
		body.append('session_id', data.user.session.sessionId);
		if (files) {
			body.append('file', files[0] /*, optional filename */);
			name = files[0].name;
		}
		if (textData) {
			body.append('text', textData);
			name = textData.slice(0, 20) + '...';
		}
		if (selectedUrls && selectedUrls.length > 0) {
			body.append('urls', selectedUrls);
			name = url;
		}
		try {
			const res = await fetch(`${PUBLIC_CHAT_API_URL}/create-model`, {
				method: 'POST',
				body
			});
			const resJson = await res.json();
			modelId = resJson.chat_key;
			addModel(modelId, name, settings);
			trainingStatus = 'ready';
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
		</ul>
	</div>

	<div class="grid md:grid-cols-2 gap-10">
		{#if step == 1}
			<div>
				<h2 class="font-bold text-secondary text-lg mb-2">Add Data</h2>
				<div class="mb-10 grid grid-cols-3 gap-2">
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
						class="file-input file-input-bordered w-full"
						bind:files
						bind:this={fileInput}
						accept=".doc,.docx,.pdf,.txt,.csv,.json"
					/>
					<p class="help">PDF, TXT, CSV, JSON or DOC files only (MAX 50MB)</p>
					<button class="btn btn-primary mt-8" type="submit" on:click={createModel}
						>Train Bot</button
					>
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
						<button class="btn btn-primary mt-8" type="submit" on:click={createModel}
							>Train Bot</button
						>
					</div>
				{:else if activeTab == 2}
					<form on:submit={() => fetchUrlsToScrape()}>
						<div class="form-control">
							<div class="input-group">
								<input
									type="url"
									placeholder="https://yourwebsite.com"
									class="input input-bordered w-full"
									bind:value={url}
									required
									autofocus
								/>
								<button class="btn btn-primary" type="submit" class:loading={busyFetchingUrls}>
									Fetch URLs
								</button>
							</div>
						</div>
					</form>
					<p class="help">Please be sure to include http:// or https://</p>
					{#if urls}
						<table class="table table-zebra table-compact w-full my-8">
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
						{#if selectedUrlsCharCount > data.subscription.max_tocken}
							<div class="alert alert-warning shadow-lg mt-2">
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
							class="btn btn-primary"
							on:click={createModel}
							disabled={selectedUrlsCharCount > data.subscription.max_tocken}>Train Bot</button
						>
					{/if}
				{/if}
			</div>
		{/if}

		{#if step == 2}
			<div>
				<ModelSettings id={modelId} {name} {settings} />
			</div>
		{/if}
		<div>
			<div class="h-[calc(100vh_-_16rem)] sticky top-10">
				<Chat {modelId} {messages} {trainingStatus} />
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	.help {
		@apply text-sm mt-3;
	}

	.breadcrumbs .active {
		@apply text-xl;
	}
</style>
