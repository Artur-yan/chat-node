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
	let trainingStatus = 'not started';
</script>

<svelte:head>
	<title>Create chatbot | {data.model.name} | ChatNode</title>
</svelte:head>

<div class="container pb-20">
	<div class="text-sm breadcrumbs text-secondary pb-6 font-bold">
		<ul>
			<li><a href="/account/chatbots">&larr; Chatbots</a></li>
			<li>Create</li>
		</ul>
	</div>

	<div class="grid md:grid-cols-2 gap-10">
		<div>
			{#if trainingStatus == 'not started'}
				<AddModelData
					bind:modelId
					userId={data.user.user.userId}
					sessionId={data.user.session.sessionId}
					subscription={data.subscription}
					bind:trainingStatus
					bind:name
				/>
			{/if}
			{#if trainingStatus == 'ready'}
				<ModelSettings id={modelId} {name} bind:settings />
			{/if}
		</div>
		<div>
			<div class="h-[calc(100vh_-_16rem)] sticky top-10">
				<Chat {modelId} bind:messages {trainingStatus} {settings} />
			</div>
		</div>
	</div>
</div>
