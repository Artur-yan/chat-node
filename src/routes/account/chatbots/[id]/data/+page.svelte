<script lang="ts">
	import { PUBLIC_CHAT_API_URL } from '$env/static/public';
	import { invalidateAll } from '$app/navigation';
	import AddModelData from '$lib/components/AddModelData.svelte';
	import Chat from '$lib/components/Chat.svelte';
	import Icon from '@iconify/svelte';
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
</script>

<svelte:head>
	<title>Data | {data.model.name} | ChatNode</title>
</svelte:head>

<div class="container grid md:grid-cols-[auto_32rem] gap-4 my-4">
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
						<th />
					</tr>
				</thead>

				{#each data.modelData as modelData}
					<tr>
						<td><div class="badge badge-sm">{modelData.source_type}</div></td>
						<td class="overflow-clip">
							{#if modelData.source_type === 'urls'}
								{modelData.name.split(',').join('\n')}
							{:else}
								{modelData.name}
							{/if}
						</td>
						<td
							><button
								class="btn btn-sm btn-circle btn-ghost text-error"
								on:click={() => {
									sourceToDelete = modelData;
									deleteDataSourceModal.showModal();
								}}><Icon icon="mdi:delete-outline" width="16" /></button
							></td
						>
					</tr>
				{/each}
			</table>
		</div>
		</div>
		</div>
	</div>
	<div>
		
		<div class="h-[calc(100vh_-_16rem)] sticky top-4 mb-10">
			<Chat {modelId} bind:trainingStatus settings={data.model.settings} />
		</div>
	</div>
</div>

<dialog id="deleteDataSourceModal" class="modal">
	<form method="dialog" class="modal-box">
		{#if sourceToDelete && sourceToDelete.api_version > 1}
			<h3 class="font-bold text-lg">Are you sure you want to delete this data source?</h3>
			<p class="py-4" />
			<button class="btn">Cancel</button>
			<button class="btn btn-error" on:click={() => deleteBotSource(sourceToDelete.s3_key)}
				>Delete</button
			>
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
