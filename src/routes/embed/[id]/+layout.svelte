<script>
	import { redirect } from '@sveltejs/kit';
	import './embed.postcss';
</script>

<slot />

<div>
	<style>
		body {
			background-color: transparent !important;
		}
	</style>
</div>
