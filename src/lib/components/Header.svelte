<script lang="ts">
	import { page } from '$app/stores';
	import LoadingProgress from './LoadingProgress.svelte';

	let links = [
		{
			title: 'Features',
			href: '/#features'
		},
		{
			title: 'Pricing',
			href: '/#pricing'
		},
		{
			title: 'About',
			href: '/about'
		},
		{
			title: 'Blog',
			href: '/blog'
		}
	];

	let scrollY: number;
</script>

<svelte:window bind:scrollY />

<LoadingProgress />

<header id="header" class="py-10">
	<nav class="container">
		<div class="flex flex-wrap justify-between items-center">
			<div class="flex items-end justify-center gap-10 -mt-3">
				<a href="/" class="flex gap-2 items-end">
					<div>
						<svg
							width="32"
							height="32"
							viewBox="0 0 25 25"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M17.5659 9.95206C17.5659 10.6394 17.0087 11.1966 16.3214 11.1966H15.9065C15.2192 11.1966 14.6619 10.6394 14.6619 9.95206L14.6619 2.36802C14.6619 2.03123 14.459 1.726 14.1432 1.60895C12.3471 0.943268 10.4043 0.57959 8.37666 0.57959H2.00814C1.43534 0.57959 0.970996 1.04394 0.970996 1.61674C0.970996 3.63734 0.93996 5.66077 0.964561 7.68162C0.968691 8.02086 1.2456 8.29263 1.58487 8.29263L7.60934 8.29263C8.2967 8.29263 8.85392 8.84985 8.85392 9.53721V9.95206C8.85392 10.6394 8.2967 11.1966 7.60934 11.1966L2.03766 11.1966C1.64592 11.1966 1.35104 11.5545 1.44396 11.9351C1.82599 13.4998 2.42987 14.9774 3.22037 16.333C3.46819 16.7579 3.93069 17.0047 4.42262 17.0047H16.3214C17.0087 17.0047 17.5659 17.5619 17.5659 18.2492V18.6641C17.5659 19.3514 17.0087 19.9087 16.3214 19.9087H7.04882C6.67598 19.9087 6.4984 20.3561 6.78168 20.5985C9.68205 23.0805 13.4486 24.5796 17.5653 24.5796H24.971V17.1739C24.971 11.6855 22.3066 6.81948 18.2007 3.79866C17.9338 3.60233 17.5659 3.7977 17.5659 4.12899L17.5659 9.95206Z"
								fill="#818CF8"
							/>
						</svg>
					</div>

					<span class="text-xl font-bold text-white tracking-wide leading-none">ChatNode</span>
				</a>
				<div class="max-sm:hidden">
					<ul class="flex text-sm space-x-8 font-bold">
						{#each links as { title, href }}
							<li>
								<a {href}>{title}</a>
							</li>
						{/each}
					</ul>
				</div>
			</div>

			<div class="flex items-center lg:order-2 max-sm:hidden">
				<a class="btn btn-sm btn-ghost text-primary mr-2" href="/login">Sign in</a>
				{#if $page.url.pathname === '/'}
					<a class="btn btn-primary" href="#pricing">Sign Up For Free</a>
				{:else}
					<a class="btn btn-sm btn-primary" href="/register" rel="external">Sign Up For Free</a>
				{/if}
			</div>

			<div class="dropdown dropdown-end sm:hidden">
				<label tabindex="0" class="btn m-1">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
						<path
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 17h14M5 12h14M5 7h14"
						/>
					</svg>
				</label>
				<ul tabindex="0" class="dropdown-content z-20 menu p-2 shadow bg-base-100 rounded-box w-52">
					{#each links as { title, href }}
						<li>
							<a class="justify-center py-4" {href}>{title}</a>
						</li>
					{/each}
					<li>
						<a class="text-primary py-4 justify-center" href="/login">Sign in</a>
					</li>
					<li>
							<a class="text-primary py-4 justify-center" href="/pricing">Sign Up For Free</a>
					</li>
				</ul>
			</div>
		</div>
	</nav>
</header>

<header
	id="header-sticky"
	class="fixed py-3 top-0 left-0 right-0 bg-base-300 z-20 -translate-y-full transition-transform"
	class:translate-y-0={scrollY > 500}
>
	<nav class="container">
		<div class="flex flex-wrap justify-between items-center">
			<div class="flex items-center justify-center gap-8">
				<a href="/" class="flex gap-2 items-end">
					<div>
						<svg
							width="24"
							height="24"
							viewBox="0 0 25 25"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M17.5659 9.95206C17.5659 10.6394 17.0087 11.1966 16.3214 11.1966H15.9065C15.2192 11.1966 14.6619 10.6394 14.6619 9.95206L14.6619 2.36802C14.6619 2.03123 14.459 1.726 14.1432 1.60895C12.3471 0.943268 10.4043 0.57959 8.37666 0.57959H2.00814C1.43534 0.57959 0.970996 1.04394 0.970996 1.61674C0.970996 3.63734 0.93996 5.66077 0.964561 7.68162C0.968691 8.02086 1.2456 8.29263 1.58487 8.29263L7.60934 8.29263C8.2967 8.29263 8.85392 8.84985 8.85392 9.53721V9.95206C8.85392 10.6394 8.2967 11.1966 7.60934 11.1966L2.03766 11.1966C1.64592 11.1966 1.35104 11.5545 1.44396 11.9351C1.82599 13.4998 2.42987 14.9774 3.22037 16.333C3.46819 16.7579 3.93069 17.0047 4.42262 17.0047H16.3214C17.0087 17.0047 17.5659 17.5619 17.5659 18.2492V18.6641C17.5659 19.3514 17.0087 19.9087 16.3214 19.9087H7.04882C6.67598 19.9087 6.4984 20.3561 6.78168 20.5985C9.68205 23.0805 13.4486 24.5796 17.5653 24.5796H24.971V17.1739C24.971 11.6855 22.3066 6.81948 18.2007 3.79866C17.9338 3.60233 17.5659 3.7977 17.5659 4.12899L17.5659 9.95206Z"
								fill="#818CF8"
							/>
						</svg>
					</div>
				</a>
				<div class="max-sm:hidden">
					<ul class="flex text-sm space-x-8 font-bold">
						{#each links as { title, href }}
							<li>
								<a {href}>{title}</a>
							</li>
						{/each}
					</ul>
				</div>
			</div>

			<div class="flex items-center lg:order-2 max-sm:hidden">
				<a class="btn btn-xs btn-ghost text-primary mr-2" href="/login">Sign in</a>
				{#if $page.url.pathname === '/'}
					<a class="btn btn-primary" href="#pricing">Sign Up For Free</a>
				{:else}
					<a class="btn btn-sm btn-primary" href="/register" rel="external">Sign Up For Free</a>
				{/if}
			</div>

			<div class="dropdown dropdown-end sm:hidden">
				<label tabindex="0" class="btn m-1">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
						<path
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 17h14M5 12h14M5 7h14"
						/>
					</svg>
				</label>
				<ul
					tabindex="0"
					class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
				>
					{#each links as { title, href }}
						<li>
							<a class="justify-center py-4" {href}>{title}</a>
						</li>
					{/each}
					<li>
						<a class="text-primary py-4 justify-center" href="/login">Sign in</a>
					</li>
					<li>
							<a class="text-primary py-4 justify-center" href="/register">Sign Up For Free</a>
					</li>
				</ul>
			</div>
		</div>
	</nav>
</header>