<script lang="ts">
	import { PUBLIC_CHAT_API_URL } from '$env/static/public';
	import AddModelData from '$lib/components/AddModelData.svelte';
	import { alert, currentBot } from '$lib/stores.js';
	import Accordian from '$lib/components/Accordian.svelte';
	import { getText, updateText } from '$lib/textSource';
	import { onMount } from 'svelte';
	import { PUBLIC_EMBED_URL } from '$env/static/public';
	import BotStatus from '$lib/components/BotStatus.svelte';

	export let data;

	let { urls } = data.modelData;
	let trainingStatus: any = undefined;
	let modelId = data.model.id;
	let sourceToDelete: Object;
	let activeDataTab: string;
	let textSourceToEdit: Object;
	let textSourceValue: string;
	let selectedUrls: Array<string> = [];
	let trainingOnLoad = data.modelData.areTraining.length > 0;

	if (Object.keys(urls).length) {
		activeDataTab = 'urls';
	} else if (data.modelData?.files.length) {
		activeDataTab = 'files';
	} else if (data.modelData?.texts.length) {
		activeDataTab = 'text';
	} else if (data.modelData?.legacyUrls.length) {
		activeDataTab = 'legacy-urls';
	}

	function gatherSubUrlsS3Keys(base_url: string) {
		let s3Keys = [];
		data.modelData?.urls[base_url].forEach((urlObj) => {
			s3Keys.push(urlObj.s3_key);
		});

		return s3Keys;
	}

	function sanitizeS3KeyAsId(s3_key: string) {
		return 'id-' + s3_key.replace(/\//g, '--');
	};

	async function deleteBotSource(s3_keys: Array<string>, base_url: string | undefined) {
		let body = new FormData();
		body.append('user_id', data.model.user_id);
		body.append('session_id', data.session.sessionId);
		body.append('bot_id', data.model.id);
		body.append('s3_keys', s3_keys);

		const res = await fetch(PUBLIC_CHAT_API_URL + '/api/delete-data', {
			method: 'POST',
			body
		});

		if (res.ok) {
			$alert = { msg: 'Data deleted', type: 'success' };

			if (base_url) {
				const elem = document.getElementById(base_url);
				elem.remove();
			} else {
				const elem = document.getElementById(sanitizeS3KeyAsId(sourceToDelete.s3_key));
				elem.remove();
			}
		}
	}

	async function updateBotSources(s3_keys: Array<string>) {
		console.log('updating sources', s3_keys);
		if (s3_keys.length === 0) {
			trainingStatus = 'ready';
			console.log('no sources to update');
			return;
		}
		trainingStatus = 'training';

		let incompleteSourcesS3Keys: Array<string> = [];

		let res = await fetch('/api/data-sources/update', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				s3_keys
			})
		});

		let updatedDataSources = await res.json();

		updatedDataSources.forEach((source) => {
			const row = document.getElementById(sanitizeS3KeyAsId(source.s3_key));
			row.setAttribute('data-training-status', source.status);
			row.querySelector('.training-status').innerHTML = source.status || 'error';
			row.querySelector('.token-count').innerHTML = source.token_count || '-';
			if (source.status !== 'trained') {
				incompleteSourcesS3Keys.push(source.s3_key);
			}
		});

		await new Promise((r) => setTimeout(r, 3000));

		updateBotSources(incompleteSourcesS3Keys);
	}

	async function editTextSource(textObj) {
		textSourceToEdit = null;
		textSourceValue = null;
		editTextSourceModal.showModal();

		const res = await getText(
			textObj.id,
			new Array(textObj.s3_key),
			data.model.user_id,
			data.session.sessionId
		);
		textSourceToEdit = res;
		textSourceValue = Object.values(res)[0];
	}

	async function handleTextUpdate(source_key: string, text: string) {
		await updateText(source_key, data.model.id, text, data.model.user_id, data.session.sessionId);
		updateBotSources([source_key])
	}

	async function retrainUrls(s3_keys: Array<string>) {
		s3_keys.forEach((s3_key) => {
			const row = document.getElementById(sanitizeS3KeyAsId(s3_key));
			row?.setAttribute('data-training-status', 'starting');
			row.querySelector('.training-status').innerHTML = 'starting';
		});

		let body = new FormData();
		body.append('user_id', data.model.user_id);
		body.append('session_id', data.session.sessionId);
		body.append('chat_key', data.model.id);
		body.append('source_keys', s3_keys);

		const res = await fetch(PUBLIC_CHAT_API_URL + '/api/retrain-urls', {
			method: 'POST',
			body
		});

		if (res.ok) {
			updateBotSources(s3_keys);
		}
	}

	onMount(() => {
		if('pinecone instance' && 'etc') {
			my_modal_1.showModal();
		}

		const objsToCheck = Object.values(data.modelData?.urls)
		const urlsToCheck = objsToCheck.map((obj) => {
			return obj.map((urlObj) => {
				return urlObj.s3_key;
			});
		}).flat();

		if(data.modelData?.areTraining.length > 0) {
			updateBotSources(urlsToCheck);
		} else {
			trainingStatus = 'ready';
		}
	});
</script>

<svelte:head>
	<title>Data | {data.model.name} | ChatNode</title>
</svelte:head>

<!-- Modal that cannot close-->
<dialog id="my_modal_1" class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg text-warning">Data Migration</h3>
    <p class="py-4">We are currently migrating your chatbot's data for improved performance. Please check back soon. Thank you for your patience! </p>
    <div class="modal-action">
      <form method="dialog">
        <!-- if there is a button in form, it will close the modal -->
      </form>
    </div>
  </div>
</dialog>

<div class="container grid md:grid-cols-[auto_16rem] lg:grid-cols-[auto_32rem] gap-4 my-4">
	<div>
		<div class="card card-compact bg-neutral border-primary border mb-4">
			<div class="card-body">
				<div class="card-title">Add Data</div>
				<AddModelData
					bind:modelId
					userId={data.user.userId}
					sessionId={data.session.sessionId}
					subscription={data.subscription}
					existingTokenCount={data.model.tocken_count}
					bind:trainingStatus
				/>
			</div>
		</div>
		<div class="card card-compact bg-neutral">
			<div class="card-body">
				<div class="flex">
					<h2 class="card-title">Trained Data Sources</h2>
					{#if trainingOnLoad}
						<BotStatus id={modelId} bind:trainingStatus />
					{/if}
				</div>
				<div class="flex">
					<div class="tabs tabs-boxed gap-2">
						{#if Object.keys(urls).length}
							<button
								class="tab"
								on:click={() => (activeDataTab = 'urls')}
								class:tab-active={activeDataTab === 'urls'}
							>
								URLs
							</button>
						{/if}
						{#if data.modelData?.files.length}
							<button
								class="tab"
								on:click={() => (activeDataTab = 'files')}
								class:tab-active={activeDataTab === 'files'}
							>
								Files
							</button>
						{/if}
						{#if data.modelData?.texts.length}
							<button
								class="tab"
								on:click={() => (activeDataTab = 'text')}
								class:tab-active={activeDataTab === 'text'}
							>
								Text
							</button>
						{/if}
						{#if data.modelData?.legacyUrls.length}
							<button
								class="tab"
								on:click={() => (activeDataTab = 'legacy-urls')}
								class:tab-active={activeDataTab === 'legacy-urls'}
							>
								Legacy URLs
							</button>
						{/if}
					</div>
				</div>

				{#if activeDataTab === 'urls'}
					<div class="space-y-4">
						{#each Object.entries(urls) as [baseUrl, items]}
							<Accordian id={baseUrl} open={true}>
								<h2 slot="title" class="w-full">
									{baseUrl}
								</h2>
								<div class="text-right mb-4">
									<button
										class="btn btn-xs btn-outline text-error"
										on:click|stopPropagation={() => {
											sourceToDelete = baseUrl;
											deleteEntireWebsiteModal.showModal();
										}}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
										>
											<path
												fill="currentColor"
												d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12M8 9h8v10H8V9m7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5Z"
											/>
										</svg>
										Delete All
									</button>
								</div>
								<table class="table w-full table-xs">
									<thead>
										<tr>
											<th class="w-full">Name</th>
											<th class="w-full">Date</th>
											<th class="w-full">Tokens</th>
											<th />
										</tr>
									</thead>
									{#each items as url}
										<tr id={sanitizeS3KeyAsId(url.s3_key)} class="hover" data-training-status={url.status}>
											<td class="break-all">
												<div
													class="training-status badge font-bold uppercase badge-xs badge-warning"
												>
													{url.status}
												</div>
												{url.name}
											</td>
											<td>
												<div
													class="tooltip tooltip-info tooltip-left"
													data-tip={url.created_at.toLocaleTimeString([], {
														minute: '2-digit',
														hour: '2-digit'
													})}
												>
													<h3 class="text-xs">{url.created_at.toLocaleDateString()}</h3>
												</div>
											</td>
											<td class="token-count">{url.token_count === 0 ? '-' : url.token_count}</td>
											<td class="flex gap-2">
												<div class="tooltip tooltip-left" data-tip="Re-Train">
													<button
														class="btn btn-sm btn-circle btn-ghost"
														on:click={() => {
															retrainUrls([url.s3_key]);
														}}
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="16"
															height="16"
															viewBox="0 0 24 24"
														>
															<path
																fill="currentColor"
																d="M15 12c0-1.7-1.3-3-3-3s-3 1.3-3 3s1.3 3 3 3s3-1.3 3-3zm2-8.7C13.1 1.1 8.3 1.8 5.1 4.7V3c0-.6-.4-1-1-1s-1 .4-1 1v4.5c0 .6.4 1 1 1h4.5c.6 0 1-.4 1-1s-.4-1-1-1H6.2C7.7 4.9 9.8 4 12 4c4.4 0 8 3.6 8 8c0 .6.4 1 1 1s1-.4 1-1c0-3.6-1.9-6.9-5-8.7zm2.9 12.2h-4.5c-.6 0-1 .4-1 1s.4 1 1 1h2.4C16.3 19.1 14.2 20 12 20c-4.4 0-8-3.6-8-8c0-.6-.4-1-1-1s-1 .4-1 1c0 5.5 4.5 10 10 10c2.6 0 5-1 6.9-2.8V21c0 .6.4 1 1 1s1-.4 1-1v-4.5c0-.6-.5-1-1-1z"
															/>
														</svg>
													</button>
												</div>
												<button
													class="btn btn-sm btn-circle btn-ghost text-error"
													on:click={() => {
														sourceToDelete = url;
														deleteDataSourceModal.showModal();
													}}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="16"
														height="16"
														viewBox="0 0 24 24"
													>
														<path
															fill="currentColor"
															d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12M8 9h8v10H8V9m7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5Z"
														/>
													</svg>
												</button>
											</td>
										</tr>
									{/each}
								</table>
							</Accordian>
						{/each}
					</div>
				{:else if activeDataTab === 'files'}
					<table class="table w-full table-xs">
						<thead>
							<tr>
								<th class="w-full">Name</th>
								<th class="w-full">Date</th>
								<th class="w-full">Tokens</th>
								<th />
							</tr>
						</thead>
						{#each data.modelData.files as file}
							<tr id={sanitizeS3KeyAsId(file.s3_key)} data-training-status={file.status}>
								<td>
									<div
										class="training-status badge font-bold uppercase badge-xs badge-warning"
									>
										{file.status}
									</div>
									{file.name}
								</td>
								<td>
									<div
										class="tooltip tooltip-info tooltip-left"
										data-tip={file.created_at.toLocaleTimeString([], {
											minute: '2-digit',
											hour: '2-digit'
										})}
									>
										<h3 class="text-xs">{file.created_at.toLocaleDateString()}</h3>
									</div>
								</td>
								<td>{file.token_count}</td>
								<td class="flex">
									<button
										class="btn btn-sm btn-circle btn-ghost text-error"
										on:click={() => {
											sourceToDelete = file;
											deleteDataSourceModal.showModal();
										}}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
										>
											<path
												fill="currentColor"
												d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12M8 9h8v10H8V9m7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5Z"
											/>
										</svg>
									</button>
								</td>
							</tr>
						{/each}
					</table>
				{:else if activeDataTab === 'text'}
					<table class="table w-full table-xs">
						<thead>
							<tr>
								<th class="w-full">Name</th>
								<th class="w-full">Date</th>
								<th class="w-full">Tokens</th>
								<th />
							</tr>
						</thead>
						{#each data.modelData.texts as text}
							<tr id={sanitizeS3KeyAsId(text.s3_key)} data-training-status={text.status}>
								<td>
									<div
										class="training-status badge font-bold uppercase badge-xs badge-warning"
									>
										{text.status}
									</div>
									<div class="name inline-block">{text.name}</div>
								</td>
								<td>
									<div
										class="tooltip tooltip-info tooltip-left"
										data-tip={text.created_at.toLocaleTimeString([], {
											minute: '2-digit',
											hour: '2-digit'
										})}
									>
										<h3 class="text-xs">{text.created_at.toLocaleDateString()}</h3>
									</div>
								</td>
								<td class="token-count">{text.token_count === 0 ? '-' : text.token_count}</td>
								<td class="flex gap-2">
									<button
										class="btn btn-sm btn-circle btn-ghost text-error"
										on:click={() => {
											sourceToDelete = text;
											deleteDataSourceModal.showModal();
										}}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
										>
											<path
												fill="currentColor"
												d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12M8 9h8v10H8V9m7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5Z"
											/>
										</svg>
									</button>
									<button
										class="btn btn-sm btn-circle btn-ghost text-success"
										on:click={() => editTextSource(text)}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="18"
											height="18"
											viewBox="0 0 24 24"
										>
											<path
												fill="currentColor"
												d="M3 17.46v3.04c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15L17.81 9.94l-3.75-3.75L3.15 17.1c-.1.1-.15.22-.15.36zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75l1.83-1.83z"
											/>
										</svg>
									</button>
								</td>
							</tr>
						{/each}
					</table>
				{:else if activeDataTab === 'legacy-urls'}
					<table class="table w-full table-xs">
						<thead>
							<tr>
								<th class="w-full">Name</th>
								<th class="w-full">Tokens</th>
								<th />
							</tr>
						</thead>
						{#each data.modelData?.legacyUrls as url}
							<tr id={sanitizeS3KeyAsId(url.s3_key)}>
								<td>
									{@html url.name.replace(/,/g, '<br>')}

									<!-- replace all commas with a line break -->
								</td>
								<td>{url.token_count || ''}</td>
								<td class="flex">
									<button
										class="btn btn-sm btn-circle btn-ghost text-error"
										on:click={() => {
											sourceToDelete = url;
											deleteDataSourceModal.showModal();
										}}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
										>
											<path
												fill="currentColor"
												d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12M8 9h8v10H8V9m7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5Z"
											/>
										</svg>
									</button>
								</td>
							</tr>
						{/each}
					</table>
				{/if}
			</div>
		</div>
	</div>
	<div>
		<div
			class="h-[calc(100vh_-_16rem)] sticky top-4 mb-10 hidden sm:block rounded-2xl overflow-hidden"
		>
		<iframe class="w-full h-full" src="{PUBLIC_EMBED_URL}/{$currentBot.id}" frameborder="0" allow="clipboard-read; clipboard-write"></iframe>
		</div>
	</div>
</div>

<dialog id="deleteDataSourceModal" class="modal">
	<form method="dialog" class="modal-box">
		{#if sourceToDelete && sourceToDelete.api_version > 1}
			<h3 class="font-bold text-lg">Are you sure you want to delete this data source?</h3>
			<p class="py-4" />
			<button class="btn">Cancel</button>
			<button class="btn btn-error" on:click={() => deleteBotSource([sourceToDelete.s3_key])}>
				Delete
			</button>
		{:else}
			<h3 class="font-bold text-lg text-error">Error</h3>
			<div class="my-4">
				This data source was added before a major update and cannot be individually removed. You'll
				need to create a new bot to take advantage of this feature. We apologize for the
				inconvenience.
			</div>
			<button class="btn">Ok</button>
		{/if}
	</form>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<dialog id="deleteEntireWebsiteModal" class="modal">
	<form method="dialog" class="modal-box">
		<h3 class="font-bold text-lg">
			This will delete all sub-urls. Are you sure you want to continue?
		</h3>
		<p class="py-4" />
		<button class="btn">Cancel</button>
		<button
			class="btn btn-error"
			on:click={() => deleteBotSource(gatherSubUrlsS3Keys(sourceToDelete), sourceToDelete)}
		>
			Delete
		</button>
	</form>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<dialog id="editTextSourceModal" class="modal">
	<form
		method="dialog"
		class="modal-box max-w-none absolute inset-4 md:inset-8 lg:inset-10 w-auto flex flex-col justify-between gap-4"
	>
		<div class="flex-1">
			{#if textSourceToEdit}
				<textarea class="w-full textarea h-full" bind:value={textSourceValue} />
			{:else}
				<div class="flex items-center justify-center h-full">
					<span class="loading loading-spinner loading-xs mr-2" />
					Loading Text...
				</div>
			{/if}
		</div>
		<div class="flex justify-between gap-2">
			<button class="btn">Cancel</button>
			<button
				class="btn btn-success"
				on:click={() => handleTextUpdate(Object.keys(textSourceToEdit)[0], textSourceValue)}
			>
				Save
			</button>
		</div>
	</form>
</dialog>

<style lang="postcss">
	tr[data-training-status='trained'] .training-status {
		@apply hidden;
	}
	tr[data-training-status='training'] .training-status {
		@apply badge-primary;
	}
	tr:is([data-training-status='training'], [data-training-status='scraping']) .training-status {
		@apply animate-pulse;
	}
	tr[data-training-status='failed'] .training-status {
		@apply !badge-error;
	}
</style>
