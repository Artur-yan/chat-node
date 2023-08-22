<script>
	export let data;

	console.log(data);



</script>

<div class="container grid grid-cols-3 gap-10">
	{#each data.posts as post, i}
		<a class="card card-compact bg-neutral overflow-hidden group" href="/blog/{post.slug}">
				{#await data.streamed.postImages }
					<img src="/post-placeholder.png" width="666" height="480" alt={post.img.description} />
				{:then postImages}

					<img src={postImages[i].thumbnail} width="666" height="480" alt="" class="group-hover:scale-105 origin-bottom transition-transform" />

				{/await}
			<div class="card-body">
				<div class="flex justify-between gap-2">
					<div class="flex flex-1 overflow-x-auto gap-2">
						{#each post.tags as tag}
						<span class="badge badge-sm badge-outline badge-primary">{tag}</span>
						{/each}
					</div>
					<span class="text-sm font-light">{new Date(post._modified * 1000).toLocaleDateString()}</span>
				</div>
				<h2 class="card-title group-hover:text-secondary transition-colors">{post.title}</h2>
			</div>
		</a>
	{/each}

</div>
