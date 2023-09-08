<script lang="ts">
	export let data;
	import Chat from '$lib/components/Chat.svelte';

</script>

<svelte:head>
	<title>{data.model.name} | ChatNode</title>
</svelte:head>

<div class="flex flex-col flex-1">
	<Chat
		modelId={data.model.id}
		trainingStatus={data.model.status}
		settings={data.model.settings}
		avatar={data.model?.avatar_img}
		userId={data.user.user.userId}
	/>
</div>
