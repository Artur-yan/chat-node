<script>
	export let user;

	import {
		Button,
		Dropdown,
		DropdownItem,
		Avatar,
		DropdownHeader,
		DropdownDivider
	} from 'flowbite-svelte';
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
</script>

<header class="py-2">
	<nav class="container">
		<div class="flex flex-wrap justify-between items-center">
			<div class="flex items-center gap-10">
				<a href="/" class="py-4">
					<span class="text-xl">My.AI</span>
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

			<div class="flex items-center lg:order-2 gap-6">
				{#if !user.session}
					<a href="/login">Sign in</a>
					<a class="button" href="/register">Register</a>
				{:else}
					<a
						href="/account/chatbots/create"
						class="text-white bg-primary-500 hover:bg-secondary-300 hover:text-primary-600 focus:ring-4 focus:ring-primary-300 rounded text-sm px-4 py-3 lg:px-5 focus:outline-none transition-colors"
						>+ Chatbot</a
					>
					<button class="acs">
						<Icon icon="mdi:account-circle-outline" width="32" />
					</button>
					<Dropdown triggeredBy=".acs" frameClass="bg-primary-900 px-6 py-4" placement="bottom-end">
						<!-- <div slot="header" class="px-4 py-2">
					<span class="block truncate text-sm font-medium"> name@flowbite.com </span>
				  </div> -->
				  		<div class="space-y-2">
							<a href="/account/chatbots">Dashboard</a>

							<form action="/logout" method="POST">
								<button type="submit">Logout</button>
							</form>
						</div>
					</Dropdown>
				{/if}
			</div>
		</div>
	</nav>
</header>
