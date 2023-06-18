<script lang="ts">
	export let data;
	import Chat from '$lib/components/Chat.svelte';
	console.log(data);
</script>

<svelte:head>
	<title>{data.model.name} | ChatNode</title>
</svelte:head>

<div class="container h-full mb-10 min-h-[50vh]">
	<Chat
		modelId={data.model.id}
		status={data.model.status}
		settings={data.model.settings}
		avatar={data.model?.avatar_img}
	/>
</div>
