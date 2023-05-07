<script>
	import { page } from '$app/stores';
</script>

<section class="container text-center py-20">
	<h1 class=" text-error font-bold">Error</h1>
	<p>{$page.error.message}</p>
</section>
