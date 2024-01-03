<script lang="ts">
	// import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	// import { alert } from '$lib/stores';
	import { redirectToStripeBilling } from '$lib/account';

	export let data;
	const isTrialing = data.subscription?.status === 'trialing';

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
			<!-- <a href={addonsPath} class="tab" class:tab-active={addonsPath == $page.url.pathname}>
				Addons
			</a> -->
			<button on:click={redirectToStripeBilling} class="tab">Billing</button>
		</div>
	</div>
</div>
{#if isTrialing}
	<!-- <div class="container mt-4">
		<div class="badge badge-warning bg-white bg-opacity-50 p-4 font-semibold text-lg text-yellow-500">
			Trial ends in 
			<span class="text-yellow-500 mx-1"> {daysLeftInBillingCycle} </span> 
			days
		</div>
	</div> -->
	<div role="alert" class="md:w-1/4 mx-auto mt-4 alert alert-warning">
		<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
		<span class="font-bold tex-lg">Trail ends in {daysLeftInBillingCycle} days</span>
	</div>
{:else if data.subscription?.next_billing_cycle}
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
