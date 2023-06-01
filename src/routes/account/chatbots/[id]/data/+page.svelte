<script lang="ts">
	import { PUBLIC_CHAT_API_URL } from '$env/static/public';
	import { invalidateAll } from '$app/navigation';
	export let data;
	import AddModelData from '$lib/components/AddModelData.svelte';
	import Chat from '$lib/components/Chat.svelte';
	let trainingStatus = 'ready';
	let modelId = data.model.id;

	let unique = [{}]; // every {} is unique, {} === {} evaluates to false

	function restart() {
		unique = [{}];
	}

	$: if (trainingStatus == 'complete') {
		restart();
		invalidateAll()
	}

	$: data.modelData, restart();

	console.log(data)


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

		console.log(resData)

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
		<h2 class="font-bold text-secondary text-lg mb-2 mt-8">Data Sources</h2>
			<table class="table w-full table-compact mb-10">
				<thead>
					<tr>
						<th>Type</th>
						<th class="w-full">Name</th>
						<th></th>
					</tr>
				</thead>
				{#each data.modelData as modelData}
					<tr>
						<td>{modelData.source_type}</td>
						<td>{modelData.name}</td>
						<td><button class="btn btn-sm btn-circle btn-ghost text-error" on:click={() => deleteBotSource(modelData.s3_key)}>del</button></td>
					</tr>
				{/each}
			</table>
	</div>
	<div>
		<div class="h-[calc(100vh_-_16rem)] sticky top-10 mb-10">
			<Chat {modelId} bind:trainingStatus settings={data.model.settings} />
		</div>
	</div>
</div>
<!-- 
<button class="btn" onclick="my_modal_2.showModal()">open modal</button>	
<dialog id="my_modal_2" class="modal">
  <form method="dialog" class="modal-box">
    <h3 class="font-bold text-lg">Hello!</h3>
    <p class="py-4">Press ESC key or click outside to close</p>
  </form>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog> -->
