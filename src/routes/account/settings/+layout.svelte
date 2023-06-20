<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { alert } from '$lib/stores';

	export let data;

	const redirectToStripeBilling = async () => {
		try {
			$alert = 'Redirecting you to Stripe billing portal';

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

	let daysLeftInBillingCycle = Math.ceil(
		(new Date(data.subscription?.next_billing_cycle).getTime() - new Date().getTime()) /
			(1000 * 3600 * 24)
	);
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
{#if data.subscription?.next_billing_cycle}
	<div class="container mt-2">
		<div class="card card-compact card-bordered border-neutral mb-4">
			<div class="card-body">
				<div class="flex justify-between">
					<h4>{data.subscription.cancel_at ? 'Cancellaton date' : 'Next Billing Cycle'}</h4>
					<span class="opacity-60"
						>{data.subscription?.next_billing_cycle?.toLocaleDateString()}</span
					>
				</div>
				<progress
					class="progress progress-secondary h-1 w-full bg-neutral"
					class:progress-warning={data.subscription.cancel_at}
					value={31 - daysLeftInBillingCycle}
					max={31}
				/>
			</div>
		</div>
	</div>
{/if}

<slot />
