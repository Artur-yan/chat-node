<div class="container my-10 grid md:grid-cols-3">
	<div class="rounded-l-xl p-8 border border-secondary rounded-r-none my-4">
		<div class="flex items-center justify-between">
			<h2>Free</h2>
			<div class="btn btn-outline btn-secondary">Sign up</div>
		</div>
		<ul class="included">
			<li>30 chat responses / month</li>
			<li>Up to 3 Chatbots</li>
			<li>Embed on your website using an iframe or JS plugin</li>
		</ul>
		<ul class="excluded">
			<li>2000 chat responses / month</li>
			<li>Up to 10 Chatbots</li>
			<li>Embed on your website using an iframe or JS plugin</li>
		</ul>
		<div class="card-actions">
			<div class="btn btn-outline btn-secondary w-full">Sign up</div>
		</div>
	</div>
	<div class="border border-secondary p-8 -mx-[1px] rounded-2xl shadow-xl">
		<div class="flex items-center justify-between">
			<h2>Pro</h2>
			<div class="btn btn-outline btn-secondary">Sign up</div>
		</div>
		<ul class="included">
			<li>2000 chat responses / month</li>
			<li>Up to 10 Chatbots</li>
			<li>Embed on your website using an iframe or JS plugin</li>
		</ul>
		<ul class="excluded">
			<li>2000 chat responses / month</li>
			<li>Up to 10 Chatbots</li>
			<li>Embed on your website using an iframe or JS plugin</li>
		</ul>
		<div class="card-actions">
			<div class="btn btn-outline btn-secondary w-full">Sign up</div>
		</div>
	</div>
	<div class="p-8 border border-secondary rounded-r-xl my-4">
		<div class="flex items-center justify-between">
			<h2>Enterprise</h2>
			<div class="btn btn-outline btn-secondary">Sign up</div>
		</div>
		<ul>
			<li>30 chat responses / month</li>
			<li>Up to 3 Chatbots</li>
			<li>Embed on your website using an iframe or JS plugin</li>
		</ul>
	</div>
</div>

<style lang="postcss">
	h2 {
		@apply text-2xl font-bold text-secondary;
	}

	.card-title {
		@apply text-2xl mb-8 text-secondary;
	}

	ul {
	}

	.included {
		@apply mt-10;
	}

	.excluded {
		@apply text-secondary/50;
	}

	li {
		@apply mb-2 list-disc ml-4;
	}

	.card-actions {
		@apply mt-8;
	}

	.btn {
		@apply w-40;
	}
</style>
