<script lang="ts">
	import ModelSettings from '$lib/components/ModelSettings.svelte';

	export let data;
</script>

<svelte:head>
	<title>Settings | {data.model.name} | ChatNode</title>
</svelte:head>

<div class="container">
	<ModelSettings id={data.model.id} name={data.model.name} settings={data.model.settings} />
</div>
