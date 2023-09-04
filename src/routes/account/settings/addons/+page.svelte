<script lang="ts">
	import Addon from '$lib/components/Addon.svelte';

	export let data;

	let messagesSubscription
	let botsSubscription
	let tokenSubscription
	let brandingSubscription

	if(data.subscription?.addons) {
		if(data.subscription?.addons['10001']) {
			messagesSubscription = data.subscription?.addons['10001']			
		}
		if(data.subscription?.addons['10002']) {
			botsSubscription = data.subscription?.addons['10002']			
		}
		if(data.subscription?.addons['10003']) {
			tokenSubscription = data.subscription?.addons['10003']
		}
		if(data.subscription?.addons['10004']) {
			brandingSubscription = data.subscription?.addons['10004']			
		}
	}
</script>

<div class="container my-10">
	{#if data.subscription?.plan === 0}
		<div class="alert mb-8 text-warning justify-between flex">
			<p>You must have an active subscription to purchase addons.</p>
			<a href="subscription" class="btn btn-warning">Upgrade</a>
		</div>
	{/if}
	
	<div class="grid md:grid-cols-2 gap-8 relative">
		{#if data.subscription?.plan === 0}
			<div class="absolute inset-0 bg-base-100/50 z-10"></div>
		{/if}

		<Addon name="Bots" description="Add individual bots to your plan allowance." price={7} subscription={botsSubscription} addonId="10002" user_id={data.subscription?.user_id} />
		
		<Addon name="Messages" description="Add messages to your plan usable by any of your bots." price={10} bundleQty={1000} subscription={messagesSubscription} addonId="10001" user_id={data.subscription?.user_id} />

		<Addon name="Tokens" description="Add additional tokens to your bots to train on larger data sets." price={7} bundleQty={250000} subscription={tokenSubscription} addonId="10003" user_id={data.subscription?.user_id} />

		<Addon name="No Branding" max1={true} description="Remove the ChatNode branding from all of your bots." price={19} subscription={brandingSubscription} addonId="10004" user_id={data.subscription?.user_id} />

	</div>
</div>
