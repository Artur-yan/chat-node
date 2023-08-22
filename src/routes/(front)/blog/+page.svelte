<script>
	export let data;
</script>

<div class="container grid grid-cols-3 gap-10">
	{#each data.posts as post}
		<a class="card card-compact bg-neutral overflow-hidden" href="/blog/{post.slug}">
			<img src={post.thumbnail} width="666" height="480" />
			<div class="card-body">
				<h2 class="card-title">{post.title}</h2>
			</div>
		</a>
	{/each}
</div>
