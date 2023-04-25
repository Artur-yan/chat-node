<script lang="ts">
	import ModelSettings from '$lib/components/ModelSettings.svelte';
	import { PUBLIC_SITE_URL } from '$env/static/public';

	export let data;

	const iframeEmbedCode = `<iframe src="/embed/${data.model.id}" width="100%" height="100%" style="visibility: hidden; border: none;" onload="this.style.visibility = 'visible';"></iframe>`;
	const jsEmbedCode = `<script src="${PUBLIC_SITE_URL}/embed.js" data-chatbot-id="${data.model.id}" />`;
</script>


<div class="container grid md:grid-cols-2 gap-6">
	<div>
		<h2>Javascript floating chatbot</h2>
		<div class="mockup-code bg-primary text-primary-content">
			<pre class="px-6"><code class=" whitespace-break-spaces">{jsEmbedCode}</code></pre>
		</div>
	</div>
	<div>
		<h2>Embedded iframe</h2>
		<div class="mockup-code bg-primary text-primary-content">
			<pre class="px-6"><code class=" whitespace-break-spaces">{iframeEmbedCode}</code></pre>
		</div>
	</div>
</div>

<style>
	pre::before{
		display: none;
	}
</style>