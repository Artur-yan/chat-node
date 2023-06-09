<script lang="ts">
	import { PUBLIC_CHAT_API_URL } from '$env/static/public';
	import { invalidateAll } from '$app/navigation';
	export let data;
	import AddModelData from '$lib/components/AddModelData.svelte';
	import Chat from '$lib/components/Chat.svelte';
	import Icon from '@iconify/svelte';
	import { alert } from '$lib/stores.js';

	let trainingStatus = 'ready';
	let modelId = data.model.id;
	let sourceToDelete: Object
	let unique = [{}]; // every {} is unique, {} === {} evaluates to false

	function restart() {
		unique = [{}];
	}

	$: if (trainingStatus == 'complete') {
		restart();
		invalidateAll()
	}

	$: data.modelData, restart();

	const deleteBotSource = async (s3_key: string) => {
		let body = new FormData()
		body.append('user_id', data.model.user_id);
		body.append('session_id', data.user.session.sessionId);
		body.append('bot_id', data.model.id);
		body.append('s3_key', s3_key);

		const res = await fetch(PUBLIC_CHAT_API_URL + '/api/delete-data', {
			method: 'POST',
			body
		})
		const resData = await res.json()

		if (res.ok) {
			invalidateAll()
			$alert = "Data deleted"
		}


	}
	
</script>

<svelte:head>
	<title>Data | {data.model.name} | ChatNode</title>
</svelte:head>

<div class="container grid grid-cols-2 gap-10">
	<div>
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
			<h2 class="font-bold text-secondary mb-2 mt-8">Data Sources</h2>
			<div class="overflow-x-auto">
				<table class="table w-full table-xs mb-10">
					<thead>
						<tr>
							<th>Type</th>
							<th class="w-full">Name</th>
							<th></th>
						</tr>
					</thead>
					{#each data.modelData as modelData}
						<tr>
							<td><div class="badge badge-neutral badge-sm">{modelData.source_type}</div></td>
							<td>{modelData.name}</td>
							<td><button class="btn btn-sm btn-circle btn-ghost text-error" on:click={() => {sourceToDelete = modelData; deleteDataSourceModal.showModal();}}><Icon icon="mdi:delete-outline" width="16" /></button></td>
						</tr>
					{/each}
				</table>
			</div>
	</div>
	<div>
		<div class="h-[calc(100vh_-_16rem)] sticky top-10 mb-10">
			<Chat {modelId} bind:trainingStatus settings={data.model.settings} />
		</div>
	</div>
</div>

<dialog id="deleteDataSourceModal" class="modal">
	
	<form method="dialog" class="modal-box">
		{#if sourceToDelete && sourceToDelete.api_version > 1}
	  <h3 class="font-bold text-lg">Are you sure you want to delete this data source?</h3>
	  <p class="py-4"></p>
	  <button class="btn">Cancel</button>
	  <button class="btn btn-error" on:click={() => deleteBotSource(sourceToDelete.s3_key)}>Delete</button>
	  {:else}
	  <h3 class="font-bold text-lg text-error">Error</h3>
		<div class="my-4">This data source was added before a major update and cannot be individually removed. You'll need to create a new bot to take advantage of this feature. We apologize for the inconvenience.</div>
	<button class="btn">Ok</button>
	{/if}
</form>
	<form method="dialog" class="modal-backdrop">
	  <button>close</button>
	</form>
</dialog>
