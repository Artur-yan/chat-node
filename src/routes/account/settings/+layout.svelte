<script lang="ts">
	// import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	// import { alert } from '$lib/stores';
	import { redirectToStripeBilling } from '$lib/account';

	export let data;

	const subscriptionPath = '/account/settings/subscription';
	const settingsPath = '/account/settings';
	const addonsPath = '/account/settings/addons';

	let daysLeftInBillingCycle = Math.ceil(
		(new Date(data.subscription?.next_billing_cycle).getTime() - new Date().getTime()) /
			(1000 * 3600 * 24)
	);
</script>

<div class="bg-neutral py-1">
	<div class="container flex items-center justify-between gap-4 flex-wrap">
		<h1 class="py-1 px-2">Account</h1>
		<div class="tabs tabs-boxed bg-neutral">
			<a href={settingsPath} class="tab" class:tab-active={settingsPath == $page.url.pathname}>
				Settings
			</a>
			<a
				href={subscriptionPath}
				class="tab"
				class:tab-active={subscriptionPath == $page.url.pathname}
			>
				Subscription
			</a>
			<a
				href={addonsPath}
				class="tab"
				class:tab-active={addonsPath == $page.url.pathname}
			>
				Addons
			</a>
			<button on:click={redirectToStripeBilling} class="tab">Billing</button>
		</div>
	</div>
</div>
{#if data.subscription?.next_billing_cycle}
	<div class="container mt-4">
		<div class="card card-compact card-bordered border-neutral mb-4">
			<div class="card-body">
				<div class="flex justify-between">
					<h4>{data.subscription.cancel_at ? 'Cancellaton date' : 'Next Billing Cycle'}</h4>
					<span class="opacity-60">
						{data.subscription?.next_billing_cycle?.toLocaleDateString()}
					</span>
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
