<script>
	export let user;


	import Icon from '@iconify/svelte';

	let links = [
		{
			title: 'Features',
			href: '/'
		},
		{
			title: 'Company',
			href: '/'
		},
		{
			title: 'Contact',
			href: '/'
		}
	];

	let accountDropdownIsOpen = false;
</script>

<header class="py-2">
	<nav class="container">
		<div class="flex flex-wrap justify-between items-center">
			<div class="flex items-center gap-10">
				<a href="/" class="py-4">
					<span class="text-xl">GPTchatbot.ai</span>
				</a>
				<div class="hidden lg:flex">
					<ul class="flex flex-col mt-4 lg:flex-row text-sm lg:space-x-8 lg:mt-0">
						{#each links as { title, href }}
							<li>
								<a {href} class="block hover:bg-gray-5">{title}</a>
							</li>
						{/each}
					</ul>
				</div>
			</div>

			<div class="flex items-center lg:order-2">
				{#if !user.session}
					<a class="link link-primary mr-4" href="/login">Sign in</a>
					<a class="btn btn-primary" href="/register">Register</a>
				{:else}
					<a class="link-primary" href="/account/chatbots">My chatbots</a>
					<div class="dropdown dropdown-end">
						<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
						<!-- svelte-ignore a11y-label-has-associated-control -->
						<label tabindex="0" class="btn btn-ghost ml-2 text-primary"
						><Icon icon="mdi:account-circle-outline" width="32" /></label
						>
						<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
						<ul tabindex="0" class="dropdown-content menu p-2 shadow bg-neutral rounded-box w-64">
							<li><a href="/account">Dashboard</a></li>
							<li><a href="/account/settings">Account Settings</a></li>
							<li>
								<form action="/logout" method="POST">
									<button type="submit">Sign out</button>
								</form>
							</li>
						</ul>
					</div>
				{/if}
			</div>
		</div>
	</nav>
</header>
