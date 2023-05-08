<script>
	export let user;
	export let includePageLinks = false;

	import Icon from '@iconify/svelte';

	let links = [
		{
			title: 'How it works',
			href: '/#how-it-works'
		},
		{
			title: 'Pricing',
			href: '/#pricing'
		}
	];
</script>

<header class="py-2">
	<nav class="container">
		<div class="flex flex-wrap justify-between items-center">
			<div class="flex items-center justify-center gap-10">
				<a href="/" class="py-4 flex gap-3 items-center">
					<span class="inline-block w-6 h-6 rounded-full bg-secondary" />
					<span class="text-sm font-bold">GPTchatbot.ai</span>
				</a>
				{#if includePageLinks}
					<div class="hidden lg:flex">
						<ul class="flex flex-col mt-4 lg:flex-row text-sm lg:space-x-8 lg:mt-0 font-bold">
							{#each links as { title, href }}
								<li>
									<a {href}>{title}</a>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>

			<div class="flex items-center lg:order-2">
				{#if !user.session}
					<a class="link link-primary mr-4" href="/login">Sign in</a>
					<a class="btn btn-primary" href="/register">Try for free</a>
				{:else}
					<a class="btn btn-ghost text-primary" href="/account/chatbots">My chatbots</a>
					<div class="dropdown dropdown-end">
						<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
						<!-- svelte-ignore a11y-label-has-associated-control -->
						<label tabindex="0" class="btn btn-ghost btn-circle text-primary"
							><Icon icon="mdi:account-circle-outline" width="28" /></label
						>
						<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
						<ul tabindex="0" class="dropdown-content menu p-2 shadow bg-neutral rounded-box w-64">
							<li><a href="/account/settings">Account Settings</a></li>
							<form action="/logout" method="POST">
								<li>
									<button type="submit">Sign out</button>
								</li>
							</form>
						</ul>
					</div>
				{/if}
			</div>
		</div>
	</nav>
</header>
