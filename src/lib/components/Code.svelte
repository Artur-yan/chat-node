<script lang="ts">
    export let language = 'javascript';
    export let code: string

    import hljs from 'highlight.js';
	import 'highlight.js/styles/github-dark.css';

    import javascript from 'highlight.js/lib/languages/javascript';

	import CopyButton from '$lib/components/CopyButton.svelte';

    
    if (language === 'javascript') {
        hljs.registerLanguage('javascript', javascript);
    }
</script>

<div class="relative">
    <pre><code>{@html hljs.highlight(code, {language:'javascript'}).value}</code></pre>
    <div class="absolute -right-2 -top-2">
        <CopyButton textToCopy={code} />
    </div>

</div>
