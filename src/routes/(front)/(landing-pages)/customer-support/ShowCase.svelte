<script>
	let examples = [
		{
			title: 'Example 1',
			text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl ut lacinia luctus, nunc nisl lacinia nunc'
		},
		{
			title: 'Example 2',
			text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl ut lacinia luctus, nunc nisl lacinia nunc'
		},
		{
			title: 'Example 3',
			text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl ut lacinia luctus, nunc nisl lacinia nunc'
		}
	];
</script>

<section class="text-center py-20 container">
	<div class="flex justify-center">
		<h2 class="font-bold text-3xl relative py-4 px-8">
			<div class="dot-corners">
				<div />
				<div />
			</div>
			Customer Support Chatbots Built with ChatNode
		</h2>
	</div>
	<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 my-10">
		{#each examples as example}
			<div class="card bg-neutral">
				<div class="card-body justify-center">
					<div class="card-title text-center justify-center mb-4">
						{example.title}
					</div>
					<p>{example.text}</p>
				</div>
			</div>
		{/each}
	</div>
</section>
