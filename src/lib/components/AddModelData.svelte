<script lang="ts">
	import { PUBLIC_CHAT_API_URL } from '$env/static/public';
	import { addModel } from '$lib/models';
	import { alert } from '$lib/stores.js';

	export let modelId: string = '';
	export let userId: string;
	export let sessionId: string;
	export let subscription: string;
	export let trainingStatus: 'training' | 'ready' | 'failed' | 'not started' | undefined
	export let name = 'Untitled';
	export let existingTokenCount = 0;

	let settings = {
		greeting: 'What can I help you with?',
		public: false,
		allowedUrls: [],
		supportMessage: 'Hmm, I am not sure',
		systemPrompt:
			'I want you to act as a document that I am having a conversation with. Your name is "AI Assistant". You will provide me with answers from the given info. Refuse to answer any question not about the text. Never break character. Do NOT say "Based on the given information"',
		userPrompt: ''
	};
	let activeTab: number;
	let busyFetchingUrls = false;
	let busyTraining = false;
	let busyCheckingFile = false;
	let fileInput: HTMLInputElement;
	let files: FileList | undefined;
	let textData = ''
	let url: string;
	let urls: Array<Array<string | number>>;
	let selectedUrls: Array<string> = [];
	let urlsTokenCount = 0;
	let filesTokenCount = 0;
	let selectedUrlsTokenCount = 0;
	let approxTextTokenCount = 0;
	let uploadedFileName: string;

	$: approxTextTokenCount = Math.floor(textData.length / 3.5)

	$: {
		if (files && files[0].size > 50 * 1024 * 1024) {
			$alert = 'This file is too large';
			fileInput.value = '';
		}
	}

	$: {
		if (selectedUrls.length > 0) {
			selectedUrlsTokenCount = 0;
			urls.forEach((url) => {
				if (selectedUrls.includes(url[0])) {
					selectedUrlsTokenCount += Number(url[1]);
				}
			});
		}
	}

	const fetchUrlsToScrape = async () => {
		urls = undefined;
		urlsTokenCount = 0;
		selectedUrlsTokenCount = 0;
		try {
            busyFetchingUrls = true;
            let body = new FormData();
			body.append('user_id', userId);
			body.append('session_id', sessionId);
            body.append('urls', [url]);
			const res = await fetch(`${PUBLIC_CHAT_API_URL}/api/scraping`, {
				method: 'POST',
				body
			});
			const data = await res.json();
			urls = await data.urls
			urls.forEach( (url) => {
				selectedUrls.push(url[0]);
				urlsTokenCount += Number(url[1]);
			});
			selectedUrlsTokenCount = urlsTokenCount;
		} catch (err) {
			console.error(err);
		} finally {
			busyFetchingUrls = false;
		}
	};

	const getFileTokenCount = async () => {
		if (files) {
			busyCheckingFile = true;
			let body = new FormData();
			body.append('user_id', userId);
			body.append('session_id', sessionId);
			body.append('file', files[0] /*, optional filename */);

			const res = await fetch(`${PUBLIC_CHAT_API_URL}/api/scraping`, {
				method: 'POST',
				body
			});

			const data = await res.json();

			filesTokenCount = data.file[1];
			uploadedFileName = data.file[0];
			busyCheckingFile = false;
		}
	};
	const createOrUpdateModel = async (id: string = '') => {
		busyTraining = true;
		let body = new FormData();

		body.append('user_id', userId);
		body.append('session_id', sessionId);
		if (uploadedFileName) {
			body.append('file_key', uploadedFileName /*, optional filename */);
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
			if (modelId) {
				body.append('chat_key', modelId);
				const res = await fetch(`${PUBLIC_CHAT_API_URL}/api/create-model`, {
					method: 'POST',
					body
				});
				
			} else {
				const res = await fetch(`${PUBLIC_CHAT_API_URL}/api/create-model`, {
					method: 'POST',
					body
				});
				const resJson = await res.json();
				modelId = resJson.chat_key;
				addModel(modelId, name, settings);
			}
			trainingStatus = 'ready';
		} catch (err) {
			console.error(err);
			$alert = 'Something went wrong. Please try again later.';
		} finally {
			busyTraining = false;
		}
	};
</script>

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
		<div class="form-control">
			<div class="input-group">
				<input
					type="file"
					class="file-input file-input-bordered w-full"
					bind:files
					bind:this={fileInput}
					accept=".doc,.docx,.pdf,.txt,.csv,.json"
					on:change={getFileTokenCount}
				/>
				<!-- <button class="btn btn-primary" type="submit" on:click={getFileTokenCount}>Upload</button> -->
			</div>
			<div class="label">
				<p>PDF, TXT, CSV, JSON or DOC files only (MAX 50MB)</p>
				<div class="text-sm text-warning invisible" class:!visible={busyCheckingFile}>Uploading</div>
			</div>
		</div>
		<div class="alert" class:hidden={!uploadedFileName}>
			Your file contains {filesTokenCount} tokens.
			{#if existingTokenCount > 0}{existingTokenCount} tokens are already in use.{/if}
			Your plan allows {subscription.max_tocken} tokens/bot.
		</div>
		<button
			class="btn btn-primary mt-8"
			class:loading={busyTraining}
			type="submit"
			disabled={!uploadedFileName}
			on:click={() => createOrUpdateModel()}>Train Bot</button
		>
	{:else if activeTab == 1}
		<div>
			<textarea
				placeholder="Paste your text"
				class="textarea textarea-bordered textarea-sm w-full"
				bind:value={textData}
				rows="8"
				autofocus
			/>
			<div class="alert mt-2" class:alert-warning={approxTextTokenCount + existingTokenCount > subscription.max_tocken}>
				Your included text contains {approxTextTokenCount} tokens. 
				{#if existingTokenCount > 0}{existingTokenCount} tokens are already in use.{/if}
				Your plan allows {subscription.max_tocken} tokens/bot.
			</div>
			<button class="btn btn-primary mt-8" class:loading={busyTraining} type="submit" disabled={approxTextTokenCount + existingTokenCount > subscription.max_tocken} on:click={() => createOrUpdateModel()}
				>Train Bot</button
			>
		</div>
	{:else if activeTab == 2}
		<form on:submit={() => fetchUrlsToScrape()}>
			<div class="form-control">
				<div class="input-group">
					<input
						type="text"
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
		<p class="help">
			We will check your website for any sub-pages and you can choose which to include in your data
		</p>
		{#if urls}
			<table class="table table-zebra table-compact w-full my-4">
				<thead>
					<tr>
						<th><!-- <input type="checkbox" class="checkbox" />--></th>
						<th>url</th>
						<th>character count</th>
					</tr>
				</thead>
				<tbody>
					{#each urls as url}
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
						<td>Urls: {urls.length}</td>
						<td>Tokens: {urlsTokenCount}</td>
					</tr>
				</tfoot>
			</table>
			<div class="alert mb-2">
				Your selected urls contain {selectedUrlsTokenCount} tokens. 
				{#if existingTokenCount > 0}{existingTokenCount} tokens are already in use.{/if}
				Your plan allows {subscription.max_tocken} tokens/bot.
			</div>
			{#if selectedUrlsTokenCount > subscription.max_tocken}
				<div class="alert alert-warning shadow-lg mb-2">
					<div>
						<span
							>Token count exceeds plan allowance. Please select fewer urls or <a
								href="/account/settings/plan"
								class="link">upgrade your plan</a
							>.</span
						>
					</div>
				</div>
			{/if}
			<button
				class="btn btn-primary"
				class:loading={busyTraining}
				on:click={() => createOrUpdateModel()}
				disabled={selectedUrlsTokenCount + existingTokenCount > subscription.max_tocken}>Train Bot</button
			>
		{/if}
	{/if}
</div>
