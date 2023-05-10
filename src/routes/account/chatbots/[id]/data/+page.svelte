<script lang="ts">
	import { invalidate } from '$app/navigation';
	export let data;
	import AddModelData from '$lib/components/AddModelData.svelte';
	import Chat from '$lib/components/Chat.svelte';
	let trainingStatus
	let modelId = data.model.id;

	let unique = [{}] // every {} is unique, {} === {} evaluates to false

	function restart() {
		unique = [{}]
	}

	$: if (trainingStatus == 'ready') {
		restart()
	}
</script>

<div class="container grid grid-cols-2 gap-10">
	<div>
		{#each unique as key (key)}
			<AddModelData
				bind:modelId
				userId={data.user.user.userId}
				sessionId={data.user.session.sessionId}
				subscription={data.subscription}
				bind:trainingStatus
			/>
		{/each}
	</div>
	<div>
		<Chat {modelId} {trainingStatus} />
	</div>
</div>
