<script lang="ts">
	export let data;

	let iframeEmbedCode = `<iframe src="/embed/${data.model.id}" width="100%" height="100%" style="border: none;"></iframe>`;
</script>

<div class="container h-full">
	{@html iframeEmbedCode}
</div>