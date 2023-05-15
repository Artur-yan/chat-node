<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { alert } from '$lib/stores';

	const redirectToStripeBilling = async () => {
		try {
			const res = await fetch('/api/account/billing', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: ''
			});
			if (res.status == 200) {
				const url = await res.json();
				goto(url);
			} else {
				$alert = 'Failed to redirect to Stripe billing portal';
			}
		} catch (err) {
			console.error(err);
		}
	};

	const planPath = '/account/settings/plan';
	const settingsPath = '/account/settings';
</script>

<div class="container flex items-center gap-4 flex-wrap">
	<h1 class="font-bold text-lg text-secondary">Account</h1>
	<div class="tabs tabs-boxed">
		<a href={settingsPath} class="tab" class:tab-active={settingsPath == $page.url.pathname}
			>Settings</a
		>
		<a href={planPath} class="tab" class:tab-active={planPath == $page.url.pathname}>Change plan</a>
		<button on:click={redirectToStripeBilling} class="tab">Billing</button>
	</div>
</div>

<slot />
