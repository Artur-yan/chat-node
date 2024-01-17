<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { PUBLIC_CHAT_API_URL } from '$env/static/public';
	import { addModel, defaultSettings } from '$lib/models';
	import { alert } from '$lib/stores.js';
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import Modal from './Modal.svelte';
	import BotStatus from './BotStatus.svelte';

	export let modelId: string = '';
	export let userId: string;
	export let sessionId: string;
	export let subscription: string;
	export let trainingStatus:
		| 'training'
		| 'ready'
		| 'failed'
		| 'not started'
		| 'cancelled'
		| undefined;
	export let name = 'Untitled';
	export let existingTokenCount = 0;

	let settings = defaultSettings;
	let activeTab = 0;
	let busyFetchingUrls = false;
	let busyCheckingFile = false;
	let fileInput: HTMLInputElement;
	let files: FileList | undefined;
	let textData = '';
	let url: string | undefined;
	let urls: Array<Array<string | number>> | undefined = undefined;
	let selectedUrls: Array<string> = [];
	let urlsTokenCount = 0;
	let filesTokenCount = 0;
	let selectedUrlsTokenCount = 0;
	let approxTextTokenCount = 0;
	let fileKeys: Array<string> = [];
	let selectAllUrlsCheckbox: HTMLInputElement;
	let maxFileSizeMB = 150;

	function resetAddDataForm() {
		activeTab = 0;
		files = undefined;
		textData = '';
		url = undefined;
		urls = undefined;
		selectedUrls = [];
		urlsTokenCount = 0;
		filesTokenCount = 0;
		selectedUrlsTokenCount = 0;
		approxTextTokenCount = 0;
		fileKeys = [];
	}

	const fetchUrlsToScrape = async () => {
		busyFetchingUrls = true;
		urls = [];
		selectedUrls = [];
		selectedUrlsTokenCount = 0;
		urlsTokenCount = 0;
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
				if (!busyFetchingUrls) {
					clearInterval(checkFetchingProgress);
					return;
				}
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
			}, 10000);
		} catch (err) {
			busyFetchingUrls = false;
			console.error(err);
			clearInterval(checkFetchingProgress);
			$alert = { msg: 'Something went wrong', type: 'error' };
		}
	};

	const cancelFetchUrlsToScrape = () => {
		busyFetchingUrls = false;
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
			if (files[0].name.length > 32) {
				name = files[0].name.slice(0, 30) + '...';
			} else {
				name = files[0].name;
			}
		}
		if (textData) {
			body.append('text', textData);
			name = textData.slice(0, 30) + '...';
		}
		if (selectedUrls && selectedUrls.length > 0) {
			body.append('urls', selectedUrls);
			if (url.length > 32) {
				name = url.slice(0, 30) + '...';
			} else {
				name = url;
			}
		}
		try {
			if (modelId) {
				body.append('chat_key', modelId);
				const res = await fetch(`${PUBLIC_CHAT_API_URL}/api/create-model`, {
					method: 'POST',
					body
				});
				resetAddDataForm();
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
			setTimeout(() => {
				window.location.reload();
			}, 1250);
		} catch (err) {
			resetAddDataForm();

			$alert = { msg: 'Something went wrong.', type: 'error' };
			console.error(err);
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
		if (files && files[0].size > maxFileSizeMB * 1024 * 1024) {
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
	<div class="grid grid-cols-3 gap-2 mb-4">
		<label class="btn" class:btn-outline={activeTab == 1}>
			<input type="radio" name="tab" bind:group={activeTab} value={1} class="hidden peer" />
			+ File
		</label>
		<label class="btn" class:btn-outline={activeTab == 2}>
			<input type="radio" name="tab" bind:group={activeTab} value={2} class="hidden peer" />
			+ Text
		</label>
		<label class="btn" class:btn-outline={activeTab == 3}>
			<input type="radio" name="tab" bind:group={activeTab} value={3} class="hidden peer" />
			+ URL
		</label>
	</div>
	{#if activeTab == 1}
		<div class="form-control">
			<div class="input-group">
				<input
					type="file"
					class="file-input file-input-bordered w-full"
					bind:files
					bind:this={fileInput}
					accept=".doc,.docx,.pdf,.txt,.json"
					multiple
					on:change={getFileTokenCount}
				/>
				<!-- <button class="btn btn-primary" type="submit" on:click={getFileTokenCount}>Upload</button> -->
			</div>
			<div class="label">
				<p>.pdf, .txt, or .doc/docx files only (MAX 150MB)</p>
				<div class="badge badge-warning invisible" class:!visible={busyCheckingFile}>
					<span class="loading loading-xs" />
					Uploading
				</div>
			</div>
		</div>
		<div
			class="alert"
			class:hidden={filesTokenCount === 0}
			class:alert-warning={filesTokenCount + existingTokenCount > subscription.max_tocken}
		>
			Your file{files && files.length > 1 ? 's' : ''} contain{files && files.length > 1 ? '' : 's'}
			{filesTokenCount.toLocaleString()} tokens.
			{#if existingTokenCount > 0}{existingTokenCount.toLocaleString()} tokens are already in use.{/if}
			Your plan allows {subscription.max_tocken.toLocaleString()} tokens/bot.

			{#if filesTokenCount + existingTokenCount > subscription.max_tocken}
				<a href="/account/settings/subscription" class="btn">Upgrade</a>
			{/if}
		</div>
		<button
			class="btn btn-primary mt-8"
			type="submit"
			disabled={fileKeys.length == 0 ||
				filesTokenCount + existingTokenCount > subscription.max_tocken ||
				trainingStatus === 'training'}
			on:click={() => createOrUpdateModel()}
		>
			<span class={trainingStatus === 'training' ? 'loading' : 'invisible'} />
			Train Bot
		</button>
	{:else if activeTab == 2}
		<div>
			<textarea
				placeholder="Enter your text"
				class="textarea textarea-bordered textarea-sm w-full"
				bind:value={textData}
				rows="8"
				autofocus
			/>
			<div
				class="alert mt-2"
				class:alert-warning={approxTextTokenCount + existingTokenCount > subscription.max_tocken}
			>
				<p>
					Your included text contains approx. {approxTextTokenCount.toLocaleString()} tokens.
					{#if existingTokenCount > 0}{existingTokenCount.toLocaleString()} tokens are already in use.{/if}
					Your plan allows {subscription.max_tocken.toLocaleString()} tokens/bot.
				</p>
				{#if approxTextTokenCount + existingTokenCount > subscription.max_tocken}
					<a href="/account/settings/subscription" class="btn">Upgrade</a>
				{/if}
			</div>
			<button
				class="btn btn-primary mt-8"
				type="submit"
				disabled={approxTextTokenCount + existingTokenCount > subscription.max_tocken ||
					approxTextTokenCount == 0 ||
					trainingStatus === 'training'}
				on:click={() => createOrUpdateModel()}
			>
				<span class={trainingStatus === 'training' ? 'loading' : 'invisible'} />

				Train Bot
			</button>
		</div>
	{:else if activeTab == 3}
		<form on:submit|preventDefault={() => fetchUrlsToScrape()}>
			<div class="form-control">
				<div class="join">
					<input
						type="text"
						class="input input-bordered w-full join-item placeholder:text-sm"
						bind:value={url}
						placeholder="e.g. https://chatnode.ai or https://chatnode.ai/sitemap.xml"
						required
						autofocus
					/>
					<button class="btn btn-primary join-item" type="submit" disabled={busyFetchingUrls}>
						<span class={busyFetchingUrls ? 'loading loading-xs' : 'hidden'} />
						Fetch URLs
					</button>
				</div>
				<p class="help">Up to 5000 URLs</p>
			</div>
		</form>

		<button class="btn btn-xs my-4" on:click={() => urlHelp.showModal()}>help</button>
		{#if urls}
			<table class="table table-sm w-full max-w-full my-4">
				<thead>
					<tr>
						<th class="w-full">
							<label class="flex items-center">
								<input
									type="checkbox"
									class="checkbox checkbox-sm mr-4"
									checked
									bind:this={selectAllUrlsCheckbox}
									on:change={handleSelectAllUrls}
								/>
								URL
							</label>
						</th>
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
									{url.url}
								</label>
							</td>
							<td>{url.token.toLocaleString()}</td>
						</tr>
					{/each}
					{#if busyFetchingUrls}
						<tr>
							<td class="flex items-center">
								<span class="loading loading-sm mr-2" />
								loading
							</td>
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
			{#if busyFetchingUrls}
				<div class="flex space-between gap-2 flex-wrap px-3 py-1">
					<p>Large websites may take up to 15 minutes to fully scrape.</p>
					<button
						type="button"
						class="btn btn-warning btn-xs btn-outline mb-4"
						on:click={cancelFetchUrlsToScrape}
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
							<path
								fill="currentColor"
								d="M2.22 2.22a.749.749 0 0 1 1.06 0L6 4.939L8.72 2.22a.749.749 0 1 1 1.06 1.06L7.061 6L9.78 8.72a.749.749 0 1 1-1.06 1.06L6 7.061L3.28 9.78a.749.749 0 1 1-1.06-1.06L4.939 6L2.22 3.28a.749.749 0 0 1 0-1.06Z"
							/>
						</svg>
						<span>{!busyFetchingUrls && urls ? 'Clear URLs' : 'Stop Scraping'}</span>
					</button>
				</div>
			{/if}
			<div
				class="alert mb-2"
				class:alert-warning={selectedUrlsTokenCount + existingTokenCount > subscription.max_tocken}
			>
				<p>
					Your selected urls contain {selectedUrlsTokenCount.toLocaleString()} tokens.
					{#if existingTokenCount > 0}{existingTokenCount.toLocaleString()} tokens are already in use.{/if}
					Your plan allows {subscription.max_tocken.toLocaleString()} tokens/bot.
				</p>
				{#if selectedUrlsTokenCount + existingTokenCount > subscription.max_tocken}
					<a href="/account/settings/subscription" class="btn">Upgrade</a>
				{/if}
			</div>
			<button
				class="btn btn-primary"
				on:click={() => createOrUpdateModel()}
				disabled={selectedUrlsTokenCount + existingTokenCount > subscription.max_tocken ||
					selectedUrlsTokenCount == 0 ||
					trainingStatus === 'training' ||
					busyFetchingUrls}
			>
				<span class={trainingStatus === 'training' ? 'loading' : 'invisible'} />
				Train Bot
			</button>
		{/if}
	{/if}
</div>

<Modal title="Training your bot on URLs" id="urlHelp">
	<h3 class="font-bold mb-4">Websites</h3>
	<p>
		Add any public url for a website and we will check it for sub-pages. You can select which pages
		to include/exclude in adding data to your bot.
	</p>

	<h3 class="font-bold mb-4 mt-8">Multiple/Specific URLs</h3>
	<p>You can enter a comma seperated list of urls to scrape. Sub-pages will not be crawled.</p>

	<h3 class="font-bold mb-4 mt-8">Google Docs / Notion / Online PDFs / + more</h3>
	<p>
		Any text based site that is pubically available can be use to train your bot. For Google docs or
		notion, make sure that the content is public and paste the share url here.
	</p>

	<h3 class="font-bold mb-4 mt-8">Sitemaps</h3>
	<p>Add the url of any XML sitemap and we will scrape every url included.</p>
</Modal>
