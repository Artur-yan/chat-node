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
	<div class="grid grid-cols-4 gap-8 my-10">
		{#each ['Michael made an Air BnB assistant to answer his guests questions about checkin/out, hosue rules, the neighborhood and more.', 'Joanne is answering fewer questions about the products in her ecommerce store after feeding all of her customer support emails into her bot.', "Eric is finding missing info on his marketing websites after reviewing answers to basic questions about the site's purpose.", 'Simba is asking questions about her own notes shes taken in meetings to help her remember what was said.	'] as _, i}
			<div class="card bg-neutral">
				<div class="card-body justify-center">
					<div class="card-title">
						{_}
					</div>
				</div>
			</div>
		{/each}
	</div>
	<p class="text-xl mb-10 max-w-[26rem] mx-auto leading-8">
		Our most creative member each month gets a free upgrade and a free month on us.
	</p>
	<button class="btn btn-primary btn-outline">What are yours?</button>
	<a href="twitter.com" class="block text-xs text-primary/80 mt-2">@ChatNode</a>
</section>
