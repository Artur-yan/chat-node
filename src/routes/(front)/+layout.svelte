<script lang="ts">
	import '../../app.postcss';
	import Header from '$lib/components/Header.svelte';
	import type { LayoutData } from './$types';
	import Footer from '$lib/components/Footer.svelte';

	export let data: LayoutData;
</script>

<Header user={data.user} includePageLinks={true} />

<main id="main">
	<slot />
</main>

<Footer />
