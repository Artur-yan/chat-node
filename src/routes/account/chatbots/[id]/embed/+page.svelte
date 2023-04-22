<script lang="ts">
	import ModelSettings from '$lib/components/ModelSettings.svelte';
	import { PUBLIC_SITE_URL } from '$env/static/public';

	export let data;

	let iframeEmbedCode = `<iframe src="/embed/${data.model.id}" width="100%" height="100%" style="visibility: hidden; border: none;" onload="this.style.visibility = 'visible';"></iframe>`;
</script>


<div class="container">
	<div class="mockup-code bg-primary text-primary-content">
		<pre class="px-6"><code class=" whitespace-break-spaces">{iframeEmbedCode}</code></pre>
	</div>
</div>

<style>
	pre::before{
		display: none;
	}
</style>