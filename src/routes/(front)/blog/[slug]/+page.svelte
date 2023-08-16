<script>
	import hljs from 'highlight.js';
	import javascript from 'highlight.js/lib/languages/javascript';

	import 'highlight.js/styles/github-dark.css';

	export let data;
</script>

<svelte:head>
	<title>{data.post.title} | Blog | ChatNode</title>
</svelte:head>

<article id="post" class="container py-10">
	<h1 class="text-3xl font-bold mb-6 max-w-[800px] mx-auto">{data.post.title}</h1>

	{#each data.post.body as block}
	{#if block.component == 'image'}
			<img src="https://cms.chatnode.ai/storage/uploads{block.data.asset.path}" alt="{block.data.asset.description}" />
	{:else if block.component == 'code'}
			{@const code = hljs.highlight(block.data.Code, {language:'javascript'})}
			<div class="mockup-code mx-auto max-w-6xl">

				<pre class=""><code>{@html code.value}</code></pre>
			</div>

		{:else}
			{@html block.data.html}
		{/if}
	{/each}
	<style>
		#post h2{
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
			margin-left: auto;
			margin-right: auto;
			margin-bottom: 1em;
		}
	
		#post p,
		#post img {
			margin-bottom: 3rem;
			max-width: 800px;
			margin-left: auto;
			margin-right: auto;
		}
	
	
		#post ul{
			list-style: disc;
			max-width: 800px;
			margin-left: auto;
			margin-right: auto;
			margin-bottom: 3rem
		}
		#post li {
			margin-bottom: 1rem
		}
	</style>
</article>
