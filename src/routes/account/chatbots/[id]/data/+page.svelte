<script lang="ts">
	import { PUBLIC_CHAT_API_URL } from '$env/static/public';
	import { invalidateAll } from '$app/navigation';
	import AddModelData from '$lib/components/AddModelData.svelte';
	import Chat from '$lib/components/Chat.svelte';
	import { alert } from '$lib/stores.js';

	export let data;

	let trainingStatus = 'ready';
	let modelId = data.model.id;
	let sourceToDelete: Object;
	let unique = [{}]; // every {} is unique, {} === {} evaluates to false

	function restart() {
		unique = [{}];
	}

	$: if (trainingStatus == 'complete') {
		restart();
	}

	$: data.modelData, restart();

	const deleteBotSource = async (s3_key: string) => {
		let body = new FormData();
		body.append('user_id', data.model.user_id);
		body.append('session_id', data.user.session.sessionId);
		body.append('bot_id', data.model.id);
		body.append('s3_key', s3_key);

		const res = await fetch(PUBLIC_CHAT_API_URL + '/api/delete-data', {
			method: 'POST',
			body
		});
		const resData = await res.json();

		if (res.ok) {
			$alert = { msg: 'Data deleted', type: 'success' };
			invalidateAll();
			restart();
		}
	};

	const retrainUrls = async (s3_keys: Array<string>) => {
		trainingStatus = 'training';
		let body = new FormData();
		body.append('user_id', data.model.user_id);
		body.append('session_id', data.user.session.sessionId);
		body.append('chat_key', data.model.id);
		body.append('source_keys', s3_keys);

		const res = await fetch(PUBLIC_CHAT_API_URL + '/api/retrain-urls', {
			method: 'POST',
			body
		});
		const resData = await res.json();

		if (res.ok) {
			invalidateAll();
			restart();
		}

	};
</script>

<svelte:head>
	<title>Data | {data.model.name} | ChatNode</title>
</svelte:head>

<div class="container grid md:grid-cols-[auto_16rem] lg:grid-cols-[auto_32rem] gap-4 my-4">
	<div>
		<div class="card card-compact bg-neutral mb-4">
			<div class="card-body">
				<div class="card-title">Add Data</div>
				{#key unique}
					<AddModelData
						bind:modelId
						userId={data.user.user.userId}
						sessionId={data.user.session.sessionId}
						subscription={data.subscription}
						existingTokenCount={data.model.tocken_count}
						bind:trainingStatus
					/>
				{/key}
			</div>
		</div>
		<div class="card card-compact bg-neutral">
			<div class="card-body">
				<h2 class="card-title">Data Sources</h2>
				<div class="overflow-x-auto">
					<table class="table w-full table-xs mb-10">
						<thead>
							<tr>
								<th>Type</th>
								<th class="w-full">Name</th>
								<th class="w-full">Token count</th>
								<th />
							</tr>
						</thead>

						{#each data.modelData as modelData}
							<tr class="hover:bg-black/10">
								<td><div class="badge badge-sm">{modelData.source_type}</div></td>
								<td class="overflow-clip">
									{#if modelData.source_type === 'urls'}
										{modelData.name.split(',').join('\n')}
									{:else}
										{modelData.name}
									{/if}
								</td>
								<td>{modelData.token_count}</td>
								<td>
									<button
										class="btn btn-sm btn-circle btn-ghost text-error"
										on:click={() => {
											sourceToDelete = modelData;
											deleteDataSourceModal.showModal();
										}}
									>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12M8 9h8v10H8V9m7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5Z"/></svg>
									</button>
								</td>
								<td>
									{#if modelData.source_type === 'url'}
									<button
										class="btn btn-sm btn-circle btn-ghost"
										on:click={() => {
											retrainUrls([modelData.s3_key]);
										}}
									>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M15 12c0-1.7-1.3-3-3-3s-3 1.3-3 3s1.3 3 3 3s3-1.3 3-3zm2-8.7C13.1 1.1 8.3 1.8 5.1 4.7V3c0-.6-.4-1-1-1s-1 .4-1 1v4.5c0 .6.4 1 1 1h4.5c.6 0 1-.4 1-1s-.4-1-1-1H6.2C7.7 4.9 9.8 4 12 4c4.4 0 8 3.6 8 8c0 .6.4 1 1 1s1-.4 1-1c0-3.6-1.9-6.9-5-8.7zm2.9 12.2h-4.5c-.6 0-1 .4-1 1s.4 1 1 1h2.4C16.3 19.1 14.2 20 12 20c-4.4 0-8-3.6-8-8c0-.6-.4-1-1-1s-1 .4-1 1c0 5.5 4.5 10 10 10c2.6 0 5-1 6.9-2.8V21c0 .6.4 1 1 1s1-.4 1-1v-4.5c0-.6-.5-1-1-1z"/></svg>
									</button>
									{/if}
								</td>
							</tr>
						{/each}
					</table>
				</div>
			</div>
		</div>
	</div>
	<div>
		<div class="h-[calc(100vh_-_16rem)] sticky top-4 mb-10 hidden sm:block rounded-2xl overflow-hidden">
			<Chat
				{modelId}
				bind:trainingStatus
				settings={data.model.settings}
				avatar={data.model.avatar_img}
				userId={data.model.user_id}
			/>
		</div>
	</div>
</div>

<dialog id="deleteDataSourceModal" class="modal">
	<form method="dialog" class="modal-box">
		{#if sourceToDelete && sourceToDelete.api_version > 1}
			<h3 class="font-bold text-lg">Are you sure you want to delete this data source?</h3>
			<p class="py-4" />
			<button class="btn">Cancel</button>
			<button class="btn btn-error" on:click={() => deleteBotSource(sourceToDelete.s3_key)}>
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
