<script lang="ts">
	export let data;
	import Chat from '$lib/components/Chat.svelte';

	// let iframeEmbedCode = `<iframe src="/embed/${data.model.id}" width="100%" height="100%" style="visibility: hidden; border: none;" onload="this.style.visibility = 'visible';"></iframe>`;

</script>

<div class="container h-[calc(100vh_-_10em)]">
	<Chat modelId={data.model.id} settings={data.model.settings} status={data.model.status} />
</div>