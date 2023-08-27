<script>
	export let data;
</script>

<svelte:head>
	<title>Roadmap | ChatNode</title>
	<meta name="description" content="See what features we have planned next and what we've recently launched." />
</svelte:head>

<div class="container">
	<h1 class="text-2xl font-bold mb-4">Roadmap</h1>

	<div class="grid md:grid-cols-3 gap-4 lg:gap-8">
		{#each data.roadmap as item}
			{#if !item._pid}
				<div class="card bg-neutral">
					<div class="card-body p-4 text-sm lg:p-8">
						<h2 class="card-title">{item.Title}</h2>
						{#each data.roadmap as subItem}
							{#if subItem._pid == item._id}
								<h3 class="alert justify-start">{subItem.Title}</h3>
							{/if}
						{/each}
					</div>
				</div>
			{/if}
		{/each}
	</div>
</div>
