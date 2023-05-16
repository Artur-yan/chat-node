<script lang="ts">
	import ModelSettings from '$lib/components/ModelSettings.svelte';
	import Chat from '$lib/components/Chat.svelte';

	export let data;

	let settings =  data.model.settings;
</script>

<svelte:head>
	<title>Settings | {data.model.name} | ChatNode</title>
</svelte:head>

<div class="container grid grid-cols-2 gap-10">
	<div>
		<ModelSettings id={data.model.id} name={data.model.name} bind:settings />
	</div>
	<div>
		<Chat modelId={data.model.id} {settings} />
	</div>
</div>
