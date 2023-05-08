<script lang="ts">
	import { PUBLIC_SITE_URL } from '$env/static/public';
	import CopyButton from '$lib/components/CopyButton.svelte';

	export let data;

	const iframeEmbedCode = `<iframe src="${PUBLIC_SITE_URL}/embed/${data.model.id}" width="100%" height="100%" style="visibility: hidden; border: none;" onload="this.style.visibility = 'visible';"></iframe>`;
	const jsEmbedCode = `<script src="${PUBLIC_SITE_URL}/embed.js" data-chatbot-id="${data.model.id}" />`;
</script>

<div class="container grid md:grid-cols-2 gap-x-6 gap-y-2 my-10">
		<div class="card bg-base-300 shadow-xl shadow-secondary/10 p-6">
			<div class="card-title justify-between">
			<h2 class="text-lg font-bold">Javascript floating chatbot</h2>
			<CopyButton textToCopy={jsEmbedCode} />
			</div>
			<pre class="py-8 break-all whitespace-break-spaces"><code>{jsEmbedCode}</code></pre>
		</div>
		<p class="p-6">
			Place this code just before the closing '&lt;/body&gt;' tag. You may also place it in your
			website's '&lt;head&gt;' tag, but it is recommended to use the defer attribute to improve
			loading speed. Learn more <a
				class="link"
				href="https://www.w3schools.com/tags/att_script_defer.asp">here</a
			>.
		</p>

		<div class="card bg-base-300 shadow-xl shadow-secondary/10 p-6 md:row-start-1 md:col-start-2">
			<div class="card-title justify-between">
				<h2 class="text-lg font-bold">Embedded iframe</h2>
				<CopyButton textToCopy={iframeEmbedCode} />
				</div>
			<pre class="py-8 break-all whitespace-break-spaces"><code>{iframeEmbedCode}</code></pre>
		</div>
		<p class="p-6">
			Place this code wherever you'd like within your website where you'd like it to appear.
		</p>
</div>

<style>
	pre::before {
		display: none;
	}
</style>
