<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { PUBLIC_CHAT_API_URL } from '$env/static/public';
	import { addModel, defaultSettings } from '$lib/models';
	import { alert } from '$lib/stores.js';
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';

	export let modelId: string = '';
	export let userId: string;
	export let sessionId: string;
	export let subscription: string;
	export let trainingStatus: 'training' | 'ready' | 'failed' | 'not started' | undefined;
	export let name = 'Untitled';
	export let existingTokenCount = 0;

	let settings = defaultSettings;
	let activeTab: number;
	let busyFetchingUrls = false;
	let busyCheckingFile = false;
	let fileInput: HTMLInputElement;
	let files: FileList | undefined;
	let textData = '';
	let url: string;
	let urls: Array<Array<string | number>>;
	let selectedUrls: Array<string> = [];
	let urlsTokenCount = 0;
	let filesTokenCount = 0;
	let selectedUrlsTokenCount = 0;
	let approxTextTokenCount = 0;
	let fileKeys: Array<string> = [];
	let selectAllUrlsCheckbox: HTMLInputElement;

	const fetchUrlsToScrape = async () => {
		busyFetchingUrls = true;
		urls = [];
		selectedUrls = [];
		selectedUrlsTokenCount = 0;
		// loadingProgress();
		try {
			let body = new FormData();
			body.append('user_id', userId);
			body.append('session_id', sessionId);
			body.append('urls', [url]);
			const res = await fetch(`${PUBLIC_CHAT_API_URL}/api/scraping`, {
				method: 'POST',
				body
			});
			const data = await res.json();

			const scrape_session_id = data.urls;
			let currentUrlsCount = 0;

			let checkFetchingProgress = setInterval(async () => {
				const res = await fetch(`/api/models/scrape-urls`, {
					method: 'POST',
					body: JSON.stringify({
						scrape_session_id
					})
				});
				const data = await res.json();

				if (data.trainingUrls) {
					if (data.trainingUrls.scraped_url.length > currentUrlsCount) {
						for (let i = currentUrlsCount; i < data.trainingUrls.scraped_url.length; i++) {
							urls = [...urls, data.trainingUrls.scraped_url[i]];
							selectedUrls = [...selectedUrls, data.trainingUrls.scraped_url[i].s3_key];
							urlsTokenCount += Number(data.trainingUrls.scraped_url[i].token);
						}
						currentUrlsCount = urls.length;
					}
					// If done
					if (data.trainingUrls.status === 'ready') {
						clearInterval(checkFetchingProgress);
						busyFetchingUrls = false;
					} else if (!data.trainingUrls.scraped_url) {
						clearInterval(checkFetchingProgress);
						busyFetchingUrls = false;
						$alert = { type: 'error', msg: 'Failed to fetch web pages from the provided URL' };
					} 
				}
			}, 2500);
		} catch (err) {
			busyFetchingUrls = false;
			console.error(err);
		}
	};

	const getFileTokenCount = async () => {
		try {
			if (files) {
				busyCheckingFile = true;
				let body = new FormData();
				body.append('user_id', userId);
				body.append('session_id', sessionId);
				for (let i = 0; i < files.length; i++) {
					body.append('files', files[i] /*, optional filename */);
				}

				const res = await fetch(`${PUBLIC_CHAT_API_URL}/api/scraping`, {
					method: 'POST',
					body
				});

				const data = await res.json();

				data.file.forEach((file) => {
					fileKeys.push(file[0]);
					filesTokenCount += file[1];
				});

				busyCheckingFile = false;
			}
		} catch (err) {
			console.error(err);
			$alert = { msg: 'Something went wrong', type: 'error' };
			invalidateAll();
		}
	};
	const createOrUpdateModel = async (id: string = '') => {
		trainingStatus = 'training';

		let body = new FormData();

		body.append('user_id', userId);
		body.append('session_id', sessionId);
		if (fileKeys.length > 0) {
			body.append('file_keys', fileKeys /*, optional filename */);
			name = files[0].name.slice(0, 20) + '...';
		}
		if (textData) {
			body.append('text', textData);
			name = textData.slice(0, 20) + '...';
		}
		if (selectedUrls && selectedUrls.length > 0) {
			body.append('urls', selectedUrls);
			name = url.slice(0, 20) + '...';
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
				await addModel(modelId, name, settings);
				goto(`/account/chatbots/${modelId}/settings`);
			}
		} catch (err) {
			console.error(err);
			$alert = { msg: 'Something went wrong. Please try again later.', type: 'error' };
		}
	};

	const handleSelectAllUrls = () => {
		if (selectAllUrlsCheckbox.checked) {
			selectedUrls = urls.map((url) => url.s3_key);
		} else {
			selectedUrls = [];
		}
	};

	$: approxTextTokenCount = Math.ceil(textData.length / 3.5);

	$: {
		if (files && files[0].size > 50 * 1024 * 1024) {
			$alert = 'This file is too large';
			fileInput.value = '';
		}
	}

	$: {
		selectAllUrlsCheckbox, (selectedUrlsTokenCount = 0);
		selectedUrls.forEach((url) => {
			selectedUrlsTokenCount += urls.find((u) => u.s3_key === url).token;
		});
	}

	$: if (urls && selectAllUrlsCheckbox && selectedUrls.length < urls.length) {
		selectAllUrlsCheckbox.checked = false;
	}
</script>

<div>
	<h2 class="font-bold text-secondary mb-2">Add Data</h2>
	<div class="mb-10 grid grid-cols-3 gap-2">
		<label class="btn btn-neutral text-primary" class:btn-outline={activeTab == 0}>
			<input type="radio" name="tab" bind:group={activeTab} value={0} class="hidden peer" />
			+ File
		</label>
		<label class="btn btn-neutral text-primary" class:btn-outline={activeTab == 1}>
			<input type="radio" name="tab" bind:group={activeTab} value={1} class="hidden peer" />
			+ Text
		</label>
		<label class="btn btn-neutral text-primary" class:btn-outline={activeTab == 2}>
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
					accept=".doc,.docx,.pdf,.txt, .json"
					multiple
					on:change={getFileTokenCount}
				/>
				<!-- <button class="btn btn-primary" type="submit" on:click={getFileTokenCount}>Upload</button> -->
			</div>
			<div class="label">
				<p>PDF, TXT, or DOC files only (MAX 50MB)</p>
				<div class="badge badge-warning invisible" class:!visible={busyCheckingFile}>
					<span class="loading loading-xs" />
					Uploading
				</div>
			</div>
		</div>
		<div
			class="alert flex-col"
			class:hidden={filesTokenCount === 0}
			class:alert-warning={filesTokenCount + existingTokenCount > subscription.max_tocken}
		>
			Your file{files && files.length > 1 ? 's' : ''} contain{files && files.length > 1 ? '' : 's'}
			{filesTokenCount.toLocaleString()} tokens.
			{#if existingTokenCount > 0}{existingTokenCount.toLocaleString()} tokens are already in use.{/if}
			Your plan allows {subscription.max_tocken.toLocaleString()} tokens/bot.

			{#if filesTokenCount + existingTokenCount > subscription.max_tocken}
				<a href="/account/settings/plan" class="btn">Upgrade</a>
			{/if}
		</div>
		<button
			class="btn btn-primary mt-8"
			type="submit"
			disabled={fileKeys.length == 0 ||
				filesTokenCount + existingTokenCount > subscription.max_tocken}
			on:click={() => createOrUpdateModel()}
		>
			<span class={trainingStatus === 'training' ? 'loading' : 'invisible'} />
			Train Bot</button
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
			<div
				class="alert mt-2"
				class:alert-warning={approxTextTokenCount + existingTokenCount > subscription.max_tocken}
			>
				Your included text contains approx. {approxTextTokenCount.toLocaleString()} tokens.
				{#if existingTokenCount > 0}{existingTokenCount.toLocaleString()} tokens are already in use.{/if}
				Your plan allows {subscription.max_tocken.toLocaleString()} tokens/bot.
			</div>
			<button
				class="btn btn-primary mt-8"
				type="submit"
				disabled={approxTextTokenCount + existingTokenCount > subscription.max_tocken ||
					approxTextTokenCount == 0}
				on:click={() => createOrUpdateModel()}
			>
				<span class={trainingStatus === 'training' ? 'loading' : 'invisible'} />

				Train Bot</button
			>
		</div>
	{:else if activeTab == 2}
		<form on:submit={() => fetchUrlsToScrape()}>
			<div class="form-control">
				<div class="join">
					<input
						type="text"
						class="input input-bordered w-full join-item"
						bind:value={url}
						required
						autofocus
					/>
					<button class="btn btn-primary join-item" type="submit" disabled={busyFetchingUrls}>
						<span class={busyFetchingUrls ? 'loading loading-xs' : 'hidden'} />
						Fetch URLs
					</button>
				</div>
			</div>
		</form>
		<p class="help">
			We will check your website for any sub-pages and you can choose which to include in your data
		</p>

		{#if urls}
			<table class="table table-zebra table-sm w-full max-w-full my-4">
				<thead>
					<tr>
						<th>
							<label class="flex items-center">
								<input
									type="checkbox"
									class="checkbox checkbox-sm mr-4"
									checked
									bind:this={selectAllUrlsCheckbox}
									on:change={handleSelectAllUrls}
								/>URL</label
							></th
						>
						<th>Tokens</th>
					</tr>
				</thead>
				<tbody>
					{#each urls as url}
						<tr transition:fade>
							<td class="w-full text-ellipsis overflow-hidden" title={url.url}>
								<label class="flex items-center">
									<input
										type="checkbox"
										class="checkbox checkbox-sm mr-4"
										value={url.s3_key}
										bind:group={selectedUrls}
									/>
									{url.url}</label
								></td
							>
							<td>{url.token.toLocaleString()}</td>
						</tr>
					{/each}
					{#if busyFetchingUrls}
						<tr>
							<td class="flex items-center"><span class="loading loading-sm mr-2" /> loading</td>
							<td />
						</tr>
					{/if}
				</tbody>
				<tfoot>
					<tr>
						<td>Urls: {urls.length}</td>
						<td>Tokens: {urlsTokenCount.toLocaleString()}</td>
					</tr>
				</tfoot>
			</table>
			<div
				class="alert mb-2 flex-col"
				class:alert-warning={selectedUrlsTokenCount + existingTokenCount > subscription.max_tocken}
			>
				<progress
					class="progress progress-success w-full"
					value={selectedUrlsTokenCount + existingTokenCount}
					max={subscription.max_tocken}
				/>
				Your selected urls contain {selectedUrlsTokenCount.toLocaleString()} tokens.
				{#if existingTokenCount > 0}{existingTokenCount.toLocaleString()} tokens are already in use.{/if}
				Your plan allows {subscription.max_tocken.toLocaleString()} tokens/bot.
			</div>
			<button
				class="btn btn-primary"
				on:click={() => createOrUpdateModel()}
				disabled={selectedUrlsTokenCount + existingTokenCount > subscription.max_tocken ||
					selectedUrlsTokenCount == 0 ||
					busyFetchingUrls}
			>
				<span class={trainingStatus === 'training' ? 'loading' : 'invisible'} />

				Train Bot</button
			>
		{/if}
	{/if}
</div>
