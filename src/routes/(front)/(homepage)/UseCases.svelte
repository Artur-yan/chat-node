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
		<a class="btn btn-primary btn-sm btn-outline" href="https://discord.gg/R3M5fDk8Rd" target="_blank">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z"/></svg>
			Tell us</a>
	</div>
</section>
