<script>
	import { page } from '$app/stores';
</script>

<div class="flex items-center justify-center">
	<h1 class="font-bold">{$page.error.message}</h1>

	<style>
		body {
			background-color: #000;
		}
		h1 {
			color: #fff;
			font-size: 1rem;
		}
	</style>
</div>
