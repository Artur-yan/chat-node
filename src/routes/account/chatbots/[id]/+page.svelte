<script lang="ts">
	export let data;
	import Chat from '$lib/components/Chat.svelte';
</script>

<svelte:head>
	<title>{data.model.name} | ChatNode</title>
</svelte:head>

<div class="container h-full">
	<Chat modelId={data.model.id} status={data.model.status} settings={data.model.settings} />
</div>
