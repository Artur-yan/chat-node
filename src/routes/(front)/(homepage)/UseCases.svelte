<script>
	let examples = [
		{
			text: "Create a virtual AirBnB host that can answer guests' questions about check-in/check-out, house rules, the neighborhood etc."
		},
		{
			text: "Quickly respond to questions about the products in an ecommerce store by feeding customer support emails into a bot."
		},
		{
			text: "Find missing info in marketing materials after reviewing answers to basic questions about the materials."
		},
		{
			text: 'Review transcriptions from meetings, board minutes, or lecture notes.'
		},
		{
			text: 'Create a custom coding aid by providing specific examples or documentation for a programming language.',
		},
		{
			text:'Distill short responses from huge archives of blog posts or wikis.'
		},

		// 'Quickly respond to questions about the products in an ecommerce store by feeding customer support emails into a bot.',
		// "Find missing info in marketing materials after reviewing answers to basic questions about the materials.",
		// 'Review transcriptions from meetings, board minutes, or lecture notes.',
		// 'Create a custom coding aid by providing specific examples or documentation for a programming language.',
		// 'Distill short responses from huge archives of blog posts or wikis.'
	]
</script>
<section class="text-center py-20 container">
	<div class="flex justify-center">
		<h2 class="font-bold text-3xl relative py-4 px-8">
			<div class="dot-corners">
				<div />
				<div />
			</div>
			Some Use Cases
		</h2>
	</div>
	<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 my-10">
		{#each examples as example}
			<div class="card bg-neutral">
				<div class="card-body justify-center">
					<div class="card-title">
						{example.text}
					</div>
				</div>
			</div>
		{/each}
	</div>
	<div class="rounded-xl border-neutral border lg:mx-10 text-left flex-wrap gap-6 p-6 flex items-center justify-between">
		<h3 class="text-2xl font-bold">What have you built?</h3>
		<p class="text-lg font-light">
			Our most creative members get a free month on us.
		</p>
		<button class="btn btn-primary btn-sm btn-outline">Tell us</button>
	</div>
</section>
