<script lang="ts">
	import '../../app.postcss';
	import Header from '$lib/components/Header.svelte';
	import type { LayoutData } from './$types';
	import Footer from '$lib/components/Footer.svelte';
	import { PUBLIC_SITE_URL } from '$env/static/public';

	export let data: LayoutData;
</script>

<svelte:head>
	<script
	src="{PUBLIC_SITE_URL}/stats/js/script.js"
	data-api="{PUBLIC_SITE_URL}/stats/api/event"
	data-domain="chatnode.ai"
	></script>

	<script>(function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');</script>
	<script async src='https://r.wdfl.co/rw.js' data-rewardful='1564fe'></script>
	<script type="text/javascript">window.$crisp=[];window.CRISP_WEBSITE_ID="2789e290-13a1-4644-a474-4fb2c75db16d";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();</script>
</svelte:head>

<Header user={data.user} includePageLinks={true} />

<main id="main">
	<slot />
</main>

<Footer />
