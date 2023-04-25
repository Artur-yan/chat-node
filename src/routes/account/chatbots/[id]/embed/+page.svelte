<script lang="ts">
	import { PUBLIC_SITE_URL } from '$env/static/public';

	export let data;

	const iframeEmbedCode = `<iframe src="${PUBLIC_SITE_URL}/embed/${data.model.id}" width="100%" height="100%" style="visibility: hidden; border: none;" onload="this.style.visibility = 'visible';"></iframe>`;
	const jsEmbedCode = `<script src="${PUBLIC_SITE_URL}/embed.js" data-chatbot-id="${data.model.id}" />`;
</script>


<div class="container grid md:grid-cols-2 gap-6 my-10">
	<div>
		<h2 class="text-lg font-bold">Javascript floating chatbot</h2>
		<div class="mockup-code h-full">
			<pre class="px-6"><code class=" whitespace-break-spaces">{jsEmbedCode}</code></pre>
		</div>
		<p class="p-4">Place this code just before the closing '&lt;/body&gt;' tag. You may also place it in your website's '&lt;head&gt;' tag, but it is recommended to use the defer attribute to improve loading speed. Learn more <a class="link" href="https://www.w3schools.com/tags/att_script_defer.asp">here</a>.</p>
	</div>
	<div>
		<h2 class="text-lg font-bold">Embedded iframe</h2>
		<div class="mockup-code h-full">
			<pre class="px-6"><code class=" whitespace-break-spaces">{iframeEmbedCode}</code></pre>
		</div>
		<p class="p-4">Place this code whereever you'd like within your website where you'd like it to appear.</p>
	</div>
</div>

<style>
	pre::before{
		display: none;
	}
</style>