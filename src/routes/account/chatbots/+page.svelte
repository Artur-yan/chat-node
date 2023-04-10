<script>
	export let data
	console.log(data)
</script>

<div class="container">
	<h1>Account</h1>

	<h2 class="text-3xl mb-2">Chatbots</h2>

	<div class="grid grid-cols-3 gap-4">
		{#each data.bots as bot}
			<a href="/" class="rounded border border-primary-700 hover:no-underline p-4 text-secondary-400 divide-y divide-primary-800">
				<div>
					<span>{bot.id}</span>
				</div>
				<div>
					<h4 class="inline text-primary-300">Trained with:</h4>
					<span>{bot.data_source_type}</span>
				</div>
				<div>
					<h4 class="inline text-primary-300">Created on:</h4>
					<span>{bot.created}</span>
				</div>
			</a>
		{/each }
		<a href="/account/chatbots/create" class="flex items-center justify-center rounded border border-primary-700 hover:no-underline p-4"><span class="text-4xl mr-2">+</span> New bot</a>
	</div>



	
</div>
