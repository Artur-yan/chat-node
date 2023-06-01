<script lang="ts">
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
	}

	$: data.modelData, restart();
</script>

<svelte:head>
	<title>Data | {data.model.name} | ChatNode</title>
</svelte:head>

<div class="container grid grid-cols-2 gap-10">
	<div>
		{#each unique as key (key)}
			<AddModelData
				bind:modelId
				userId={data.user.user.userId}
				sessionId={data.user.session.sessionId}
				subscription={data.subscription}
				existingTokenCount={data.model.tocken_count}
				bind:trainingStatus
			/>
		{/each}
		<table class="table w-full table-compact my-10">
			<thead>
				<tr>
					<th>Type</th>
					<th class="w-full">Name</th>
				</tr>
			</thead>
			{#each data.modelData as modelData}
				<tr>
					<td>{modelData.source_type}</td>
					<td>{modelData.name}</td>
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
