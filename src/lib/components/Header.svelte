<script>
	export let user;

	import { Dropdown } from 'flowbite-svelte';

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
					<a href="/account/chatbots">My chatbots</a>
					<!-- <button class="text-primary-400" on:click={() => accountDropdownIsOpen = !accountDropdownIsOpen }>
						<Icon icon="mdi:account-circle-outline" width="32" />
					</button>
					<Dropdown triggeredBy=".acs" frameClass="bg-primary-900 px-6 py-4" placement="bottom-end">
						<div slot="header" class="px-4 py-2">
					<span class="block truncate text-sm font-medium"> name@flowbite.com </span>
				  </div>
						<div class="space-y-2">
							<a href="/account">account settings</a>

							<form action="/logout" method="POST">
								<button type="submit">sign out</button>
							</form>
						</div>
					</Dropdown>  -->
					<div class="dropdown dropdown-end">
						<label tabindex="0" class="btn m-1"><Icon icon="mdi:account-circle-outline" width="32" /></label>
						<ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
						  <li><a>Item 1</a></li>
						  <li><a>Item 2</a></li>
						</ul>
					  </div>
				{/if}
			</div>
		</div>
	</nav>
</header>
