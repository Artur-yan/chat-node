<script lang="ts">
	import type { LayoutData } from './$types';

	import '../../app.postcss';
	import Header from '$lib/components/Header.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import Footer from '$lib/components/Footer.svelte';

	export let data: LayoutData;
</script>

<Header user={data.user} />

<main class="flex flex-col basis-full bg-base-100">
	<slot />
</main>

<Footer />

<Toast />
