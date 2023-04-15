<script>
	import { page } from '$app/stores';
</script>

<div>
	<h1>{$page.error.message}</h1>

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
