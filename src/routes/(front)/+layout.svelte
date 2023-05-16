<script lang="ts">
	import '../../app.postcss';
	import Header from '$lib/components/Header.svelte';
	import type { LayoutData } from './$types';
	import Footer from '$lib/components/Footer.svelte';

	export let data: LayoutData;
</script>

<svelte:head>
	<script>(function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');</script>
	<script async src='https://r.wdfl.co/rw.js' data-rewardful='1564fe'></script>
</svelte:head>

<Header user={data.user} includePageLinks={true} />

<main id="main">
	<slot />
</main>

<Footer />
