<script lang="ts">
	export let data;

	let iframeEmbedCode = `<iframe src="/embed/${data.model.id}" width="100%" height="100%" style="border: none;"></iframe>`;

	let top

	$: console.log(top)
</script>

<div class="container h-[calc(100vh_-_10em)]">
	{@html iframeEmbedCode}
</div>