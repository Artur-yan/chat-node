<script>
	import '../app.postcss';
	import { page } from '$app/stores';
</script>

<section class="container text-center py-20 flex-1 flex items-center justify-center">
	<h1 class="text-3xl font-extralight">{$page.error.message}</h1>
</section>

