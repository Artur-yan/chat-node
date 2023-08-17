<script lang="ts">
	export let code: string;

	import hljs from 'highlight.js';
	import 'highlight.js/styles/github-dark.css';

	import CopyButton from '$lib/components/CopyButton.svelte';
</script>

<div class="rounded-lg bg-neutral relative">
	<pre class="overflow-x-auto p-4 lg:p-8"><code>{@html hljs.highlightAuto(code).value}</code></pre>
	<div class="absolute right-1 top-1">
		<CopyButton textToCopy={code} />
	</div>
</div>
