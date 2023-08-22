<script>
	import '../app.postcss';
	import { page } from '$app/stores';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<Header />

<section class="container text-center py-20 flex-1 flex items-center justify-center">
	<h1 class="text-3xl font-extralight">{$page.error.message}</h1>
</section>

<Footer />
