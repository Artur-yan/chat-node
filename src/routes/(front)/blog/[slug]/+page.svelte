<script>
	export let data;

	import Code from '$lib/components/Code.svelte';
</script>

<svelte:head>
	<title>{data.post.title} | Blog | ChatNode</title>
</svelte:head>

<article id="post" class="container py-10">
	<h1 class="text-3xl font-bold mb-6 max-w-[800px]">{data.post.title}</h1>

	{#each data.post.body as block}
		{#if block.component == 'image' && block.data.asset?.path}
			<img
				src="https://cms.chatnode.ai/storage/uploads{block.data.asset.path}"
				alt={block.data.asset.description}
			/>
		{:else if block.component == 'code'}
			<div class="max-w-6xl">
				<Code code={block.data.Code} />
			</div>
		{:else}
			{@html block.data.html}
		{/if}
	{/each}
	<style>
		#post h2 {
			margin-bottom: 1rem;
			font-size: 1.5rem;
			font-weight: bold;
		}
		#post h2,
		#post h3,
		#post h4,
		#post h5,
		#post h6 {
			max-width: 800px;
			margin-bottom: 1em;
		}

		#post p,
		#post img {
			margin-bottom: 3rem;
			max-width: 800px;
		}

		#post ul {
			list-style: disc;
			max-width: 800px;
			margin-bottom: 3rem;
		}
		#post li {
			margin-bottom: 1rem;
		}
	</style>
</article>
