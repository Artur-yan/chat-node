<script>
	export let data;
</script>

<div class="container py-10 !max-w-4xl">
	<h1>{data.post.title}</h1>
	{@html data.post.body}

	<style>
		h2 {
			margin-top: 2.5rem;
		}
	</style>
</div>
