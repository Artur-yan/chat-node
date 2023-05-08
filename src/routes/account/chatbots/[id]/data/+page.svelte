<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_CHAT_API_URL } from '$env/static/public';
	import Icon from '@iconify/svelte';

	export let data;
	let user = data.user.user;

	let busyFetchingUrls = false;
	let files: FileList;
	let text: string;
	let urls: string;
	let fileInput: HTMLInputElement;
	let selectedUrls: Array<string>;
	let activeTab: number;
	let fetchedUrls: Array<string>;

	$: {
		if (files && files[0].size > 500 * 1024 * 1024) {
			alert('This file is too large');
			fileInput.value = '';
		}
	}

	const fetchUrlsToScrape = async () => {
		try {
			busyFetchingUrls = true;
			const res = await fetch(`${PUBLIC_CHAT_API_URL}/scraping-urls`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					urls: [urls],
					user_id: user.userId,
					session_id: data.user.session.sessionId
				})
			});
			fetchedUrls = await res.json();
			selectedUrls = Array.from(fetchedUrls.urls).map((url) => url[0]);
		} catch (err) {
			throw err;
		} finally {
			busyFetchingUrls = false;
		}
	};

	const updateModel = async () => {
		let body = new FormData();
		body.append('user_id', user.userId);
		body.append('session_id', data.user.session.sessionId);
		body.append('chat_key', data.model.id);
		if (files) {
			body.append('file', files[0] /*, optional filename */);
		}
		if (text) {
			body.append('text', text);
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
			if (res.ok) {
				goto(`/account/chatbots/${data.model.id}`);
			}
		} catch (err) {
			console.error(err);
			alert('Something went wrong. Please try again later.');
		}
	};
</script>

<div class="container grid grid-cols-[30rem_auto] gap-10 py-6">
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
				class="file-input file-input-bordered file-input-primary"
				bind:files
				bind:this={fileInput}
				accept=".doc,.docx,.pdf,.txt,.csv,.json"
			/>
			<button class="btn btn-primary" type="submit" on:click={() => updateModel()}>Train Bot</button
			>
			<p class="help">PDF, TXT, CSV, JSON or DOC files only (MAX 50MB)</p>
		{:else if activeTab == 1}
			<div>
				<textarea
					placeholder="Paste your text"
					class="textarea textarea-bordered textarea-sm w-full"
					bind:value={text}
					rows="8"
					maxlength="50000"
					autofocus
				/>
				<p class="help">Max 50,000 characters</p>
				<button class="btn btn-primary mt-10" type="submit" on:click={() => updateModel()}
					>Train Bot</button
				>
			</div>
		{:else if activeTab == 2}
			<form on:submit={fetchUrlsToScrape}>
				<div class="form-control">
					<div class="input-group">
						<input
							type="url"
							placeholder="https://yourwebsite.com"
							class="input input-bordered w-full"
							bind:value={urls}
							required
							autofocus
						/>
						<button class="btn btn-primary" type="submit" class:loading={busyFetchingUrls}>
							Fetch URLs
						</button>
					</div>
				</div>
			</form>
			<p class="help mb-10">Please be sure to include http:// or https://</p>
			{#if fetchedUrls}
				<table class="table table-zebra table-compact w-full">
					<thead>
						<tr>
							<th><input type="checkbox" class="checkbox" /></th>
							<th>URL</th>
							<th>Token count</th>
						</tr>
					</thead>
					<tbody>
						{#each fetchedUrls.urls as url}
							<tr>
								<td>
									<input
										type="checkbox"
										class="checkbox"
										value={url[0]}
										bind:group={selectedUrls}
									/>
								</td>
								<td>{url[0]}</td>
								<td>{url[1]}</td>
							</tr>
						{/each}
					</tbody>
				</table>
				<button class="btn mt-8" on:click={() => updateModel()}>Scrape Urls for data</button>
			{/if}
		{/if}
	</div>

	<div>
		<!-- <h2>Current Data</h2> -->
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<!-- <div tabindex="0" class="collapse collapse-plus border border-base-300 bg-base-100 rounded-box">
			<div class="collapse-title text-xl font-medium">URLs</div>
			<div class="collapse-content">
				<div class="overflow-x-auto">
					<table class="table table-zebra w-full">
						<thead>
							<tr>
								<th>Type</th>
								<th>Job</th>
								<th>Favorite Color</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Cy Ganderton</td>
								<td>Quality Control Specialist</td>
								<td>Blue</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div> -->
	</div>
</div>
