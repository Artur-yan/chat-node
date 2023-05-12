<script lang="ts">
	export let data;
	import Chat from '$lib/components/Chat.svelte';
</script>

<div class="container h-[calc(100vh_-_10em)]">
	<Chat modelId={data.model.id} status={data.model.status} settings={data.model.settings} />
</div>
