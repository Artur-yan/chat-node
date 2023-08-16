<script>
	export let data;
</script>

<svelte:head>
	<title>{data.post.title} | Blog | ChatNode</title>
</svelte:head>

<article class="container py-10 !max-w-4xl">
	<h1 class="text-3xl font-bold mb-6">{data.post.title}</h1>

	{#each data.post.body as block}
	{#if block.component == 'image'}
			<img src="https://cms.chatnode.ai/storage/uploads{block.data.asset.path}" alt="{block.data.asset.description}" />
		{:else}
			{@html block.data.html}
		{/if}
	{/each}

	<style>
		article h2 {
			margin-bottom: 1rem;
			font-size: 1.5rem;
			font-weight: bold;
		}

		article p,
		article img {
			margin-bottom: 3rem;
		}

		article ul{
			list-style: disc;
		}
		article li {
			margin-bottom: 1rem
		}
	</style>
</article>
