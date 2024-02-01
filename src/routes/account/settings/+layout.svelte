<script lang="ts">
	// import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	// import { alert } from '$lib/stores';
	import { redirectToStripeBilling } from '$lib/account';
	import { PUBLIC_CHAT_API_URL } from '$env/static/public';

	export let data;

	let busyChangingPlan: boolean = false;
	const isTrialing: boolean = data.subscription?.status === 'trialing';
	let confirming: boolean = false;

	const subscriptionPath = '/account/settings/subscription';
	const settingsPath = '/account/settings';
	const addonsPath = '/account/settings/addons';

	let daysLeftInBillingCycle = Math.ceil(
		(new Date(data.subscription?.next_billing_cycle).getTime() - new Date().getTime()) /
			(1000 * 3600 * 24)
	);

	const handleFullAccess = async () => {
		try {
			const res = await fetch(`${PUBLIC_CHAT_API_URL}/api/update-plan`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				user_id: data.user.userId,
				plan: data.subscription?.plan,
				end_trial: true
			})
		});

		window.location.reload();
		console.log(res);
		} catch (error) {
			console.log(error);
		}
	};

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
			<button on:click={redirectToStripeBilling} class="tab">Billing</button>
		</div>
	</div>
</div>

{#if data.subscription.cancel_at}
<div role="" class="flex justify-center md:w-1/3 mx-auto mt-4 btn bg-red-600">
	<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
	<span class="font-bold text-xl">Cancelation in {daysLeftInBillingCycle} days</span>
</div>
{:else if isTrialing}
	{#if confirming}
		<div role="alert" class="flex justify-center md:w-2/5 mx-auto mt-4 alert alert-warning">
			<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
			<span class="font-bold text-xl">You will be billed immediately</span>
			<button 
				on:click={() => {
					handleFullAccess();
					busyChangingPlan = true;
				}}
				class="btn btn-neutral border-indigo-500"
			>{busyChangingPlan ? 'Updating...' : 'Confirm'}</button>
		</div>
	{:else}
		<div role="alert" class="flex justify-center md:w-1/3 mx-auto mt-4 alert alert-warning">
			<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
			<span class="font-bold text-xl">Trial ends in {daysLeftInBillingCycle} days</span>
			<button 
				on:click={() => confirming = true}
				class="btn btn-neutral"
			>Full Access</button>
		</div>
	{/if}
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
