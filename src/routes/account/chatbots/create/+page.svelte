<script lang="ts">
	import ModelSettings from '$lib/components/ModelSettings.svelte';
	import Chat from '$lib/components/Chat.svelte';
	import AddModelData from '$lib/components/AddModelData.svelte';

	export let data;

	let modelId: string;
	let name: string;

	let settings;

	let messages;

	$: if (settings) {
		messages[0].text = settings.greeting;
	}
	let trainingStatus = undefined;
</script>

<svelte:head>
	<title>Create chatbot | ChatNode</title>
</svelte:head>

<div class="container pb-20">
	<div class="text-secondary text-xl pb-6 font-bold">New chatbot</div>

	<div class="grid md:grid-cols-2 gap-10">
		<div>
			{#if trainingStatus == undefined}
				<AddModelData
					bind:modelId
					userId={data.user.user.userId}
					sessionId={data.user.session.sessionId}
					subscription={data.subscription}
					bind:trainingStatus
					bind:name
				/>
			{:else}
				<ModelSettings id={modelId} {name} bind:settings open={true} />
			{/if}
		</div>
		<div>
			<div class="h-[calc(100vh_-_16rem)] sticky top-10 border-4 rounded-xl border-neutral">
				<Chat {modelId} bind:messages {trainingStatus} {settings} />
			</div>
		</div>
	</div>
</div>
