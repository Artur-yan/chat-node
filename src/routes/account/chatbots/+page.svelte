<script>
	export let data


</script>

<div class="container">
	
	
	<div class="flex justify-between my-4 items-center">
		<div>

			<h1 class="text-sm">Account</h1>
			<h2 class="text-2xl mb-2">Chatbots</h2>
		</div>
		<a href="/account/chatbots/create" class="button">
			+ Create new chatbot
		</a>
	</div>

	<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each data.bots as bot}
			<a href="chatbots/{bot.id}" class="rounded border border-primary-700 hover:no-underline px-4 py-2 text-secondary-400 divide-y divide-primary-800 hover:bg-primary-900">
				<div>
					<h4>id:</h4>
					<p>{bot.id}</p>
				</div>
				<div>
					<h4>Trained with:</h4>
					<p>{bot.data_source_type}</p>
				</div>
				<div>
					<h4>Created on:</h4>
					<p>{bot.created.toLocaleString('en-us')}</p>
				</div>
			</a>
		{/each }
	</div>
	
</div>

<style lang="postcss">
	h4{
		@apply text-primary-600 text-xs;
	}

	.grid div{
		@apply pt-2 pb-6 flex justify-between text-sm;
	}

	.grid p{
	}
</style>