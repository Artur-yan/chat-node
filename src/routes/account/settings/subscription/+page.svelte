<script lang="ts">
	import { enhance } from '$app/forms';
	import { alert } from '$lib/stores';

	import tiersMap from '$lib/data/tiers';
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Testimonials from '$lib/components/Testimonials.svelte';
	import UpdatedPricing from '$lib/components/UpdatedPricing.svelte';
	import Addon from '$lib/components/Addon.svelte';

	export let data;
	export let form;

	let billingTerm = 'yearly';
	let busyChangingPlan;

	let currentPlan = data.subscription.plan;
	$: currentPlan = data.subscription.plan;

	let showAppsumoKeysField = false;

	let appsumoCodes = '';

	if (currentPlan > 100 && currentPlan < 1000) {
		billingTerm = 'yearly';
	}

	let tier = tiersMap[currentPlan];

	$: if (form?.success) {
		$alert = { type: 'success', msg: 'AppSumo Plan Upgraded' };
		invalidateAll();
		tier = tiersMap[currentPlan];
	}

	const upgradeToAgency = async () => {
		try {
			busyChangingPlan = true;
			const res = await fetch('/api/account/plan', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ newPlan: 1006, referralCode: '' })
			});
			const data = await res.json();
			goto(data.url);
		} catch (err) {
			console.error(err);
			$alert = { msg: 'Something went wrong', type: 'error' };
		} finally {
			busyChangingPlan = false;
		}
	};

	onMount(() => {
		invalidateAll();
	});

// Add-ons
	let messagesSubscription;
	let botsSubscription;
	let tokenSubscription;
	let brandingSubscription;

	if (data.subscription?.addons) {
		if (data.subscription?.addons['10001']) {
			messagesSubscription = data.subscription?.addons['10001'];
		}
		if (data.subscription?.addons['10002']) {
			botsSubscription = data.subscription?.addons['10002'];
		}
		if (data.subscription?.addons['10003']) {
			tokenSubscription = data.subscription?.addons['10003'];
		}
		if (data.subscription?.addons['10004']) {
			brandingSubscription = data.subscription?.addons['10004'];
		}
	}
</script>

<svelte:head>
	<title>Account Plan | ChatNode</title>
</svelte:head>

<div class="container mb-20">
	{#if currentPlan > 1000 || currentPlan === 0 && $page.url.search.includes('agency-c7433')}
		<div class="grid md:grid-cols-[4fr_3fr] my-8 gap-8">
			<div>
				<h1 class="font-bold text-3xl mb-4">
					{#if currentPlan > 1000}
						You purchased a lifetime <span class="text-primary">{tier.name}</span>
						plan
					{:else}
						You're currently on the <span class="text-primary">Free Trial</span>
					{/if}
				</h1>
				<p class="font-bold text-secondary text-lg mb-2">Your plan includes:</p>
				<div class="text-lg mb-4 leading-8">
					<p>
						{data.subscription?.max_bot === -1 ? 'Unlimited' : data.subscription?.max_bot} Chatbots
					</p>
					<p>{data.subscription?.max_tocken.toLocaleString()} Tokens/Bot</p>
					<p>{data.subscription?.max_msg} Messages/Month</p>
				</div>
				<div class="text-lg mb-4 leading-8">
					<!-- Convert object to array for looping -->
					{#each Object.entries(tier.features) as [key, value]}
						{#if value.included}
							<p>{value.label}</p>
						{/if}
					{/each}
				</div>
				{#if currentPlan < 1006}
					<button
						class="btn btn-primary btn-outline mr-2"
						on:click={() => (showAppsumoKeysField = !showAppsumoKeysField)}
					>
						Add Appumo Codes
					</button>
					{#if showAppsumoKeysField}
						<form method="POST" action="?/upgradeAppsumo" use:enhance>
							<label class="label" for="appsumo-codes">
								<span class="label-text">AppSumo Code(s)</span>
							</label>
							<textarea
								class="textarea textarea-bordered w-full textarea-xs max-w-lg"
								spellcheck="false"
								name="appsumo-codes"
								rows="7"
								placeholder="Enter up to 5 AppSumo codes here each on a new line"
								bind:value={appsumoCodes}
							/>
							<input type="hidden" name="email" value={data.user.email} />
							{#if form?.success === false}
								<p class="text-error">{form.message || ''}</p>
							{/if}
							<button class="btn btn-primary block">Submit</button>
						</form>
					{/if}
				{/if}
			</div>
			{#if $page.url.search.includes('agency-c7433')}
				<div class="card bg-neutral">
					<div class="card-body">
						<h2 class="text-accent font-bold text-2xl mb-4">
							Upgrade to Agency <span class="badge">Lifetime Deal</span>
						</h2>
						<ul class="text-xl mb-4">
							<li>
								<span class="text-accent font-medium">Unlimited</span>
								Chatbots
							</li>
							<li>
								<span class="text-accent font-medium">Unlimited</span>
								Messages
							</li>
							<li>{new Number(8000000).toLocaleString()} Tokens/Bot</li>
						</ul>
						<ul class="text-lg mb-6 text-white font-bold">
							<li>
								Bring your own domain using CNAME
								<span class="badge ml-2 badge-outline">Customize per Bot</span>
							</li>
						</ul>

						<h3 class="font-bold text-white">Plus everything from Enterprise</h3>
						<ul>
							<li>Slack Integration</li>
							<li>ChatNode API</li>
							<li>Remove ChatNode Branding</li>
							<li>60 Day Chat History</li>
						</ul>

						<p class="my-8">
							Agency Plan <span class="font-bold text-white">
								requires that you use your own OpenAI API Key.
								<br />
								<span class="text-error">There are no free messages included.</span>
							</span>
							<br />
							You may set a default OpenAI key for all bots and specify a different OpenAI key per
							bot.
						</p>
						<div class="flex items-center gap-4 flex-wrap">
							<button class="btn btn-accent flex-wrap" type="button" on:click={upgradeToAgency}>
								Upgrade to Agency
							</button>
							<span class="badge badge-accent badge-lg font-bold">
								{#if currentPlan > 1000}
									<s class="mr-2 opacity-80">$399</s>
									${400 - (currentPlan - 1000) * 50}
								{:else}
									$399
								{/if}
							</span>
							<span class="badge font-bold">One-Time Fee</span>
							<div />
						</div>
					</div>
				</div>
			{/if}
		</div>
	{:else if currentPlan === 1006}
		<h2 class="font-bold text-2xl mb-4 mt-8">
			You purchased a lifetime <span class="text-accent">Agency Plan</span>
		</h2>
		<ul class="text-xl mb-4">
			<li>
				<span class="text-accent font-medium">Unlimited</span>
				 Chatbots
			</li>
			<li>
				<span class="text-accent font-medium">Unlimited</span>
				 Messages
			</li>
			<li>{new Number(8000000).toLocaleString()} Tokens/Bot</li>
		</ul>
		<ul class="text-lg mb-6 text-white font-bold">
			<li>Bring your own domain using CNAME</li>
		</ul>

		<h3 class="font-bold text-white">Plus everything from Enterprise</h3>
		<ul>
			<li>Slack Integration</li>
			<li>ChatNode API</li>
			<li>Remove ChatNode Branding</li>
			<li>60 Day Chat History</li>
		</ul>

		<p class="my-8">
			Agency Plan <span class="font-bold text-white">
				requires that you use your own OpenAI API Key.
			</span>
			<br />
			You may set a default key for all bots and override the key per bot.
		</p>
	{:else if currentPlan < 1000}
		<UpdatedPricing 
			includeMarketing={false} 
			userId={data.user.userId}
			currentPlan={currentPlan}
		/>
	{/if}

	<div class="container bg-transparent bg-opacity-500">
		{#if data.subscription?.plan === -1}
			<div class="alert mb-8 text-warning justify-between flex">
				<p>You must have an active subscription to purchase addons.</p>
			</div>
		{/if}
	
		<div class="grid md:grid-cols-4 gap-8 relative">
			{#if data.subscription?.plan === -1}
				<div class="absolute inset-0 bg-base-100/50 z-10" />
			{/if}
	
			<Addon
				name="Extra Messages"
				description="Add messages to your plan usable by any of your bots."
				price={10}
				bundleQty={1000}
				subscription={messagesSubscription}
				addonId="10001"
				user_id={data.subscription?.user_id}
			/>
	
			<Addon
				name="Extra Tokens"
				description="Add additional tokens to your bots to train on larger data sets."
				price={7}
				bundleQty={250000}
				subscription={tokenSubscription}
				addonId="10003"
				user_id={data.subscription?.user_id}
			/>

			<Addon
				name="Extra Bots"
				description="Add individual bots to your plan allowance."
				price={7}
				subscription={botsSubscription}
				addonId="10002"
				user_id={data.subscription?.user_id}
			/>

			<Addon
				name="Custom Domain"
				max1={true}
				description='Have your chatbot 100% white label with your own domain'
				price={59}
				subscription={brandingSubscription}
				addonId="10005"
				user_id={data.subscription?.user_id}
			/>
		</div>
	</div>
</div>

<Testimonials testimonials={data.streamed?.testimonials} />
