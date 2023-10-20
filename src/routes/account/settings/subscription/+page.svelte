<script lang="ts">
	import { enhance } from '$app/forms';
	import PricingGrid from '$lib/components/PricingGrid.svelte';
	import { alert } from '$lib/stores';

	import tiersMap from '$lib/data/tiers';
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { h3 } from 'lucia-auth/middleware';

	export let data;
	export let form;

	let billingTerm = 'monthly';
	let busyChangingPlan

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
				body: JSON.stringify({ 'newPlan': 1006, 'referralCode': '' })
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
</script>

<svelte:head>
	<title>Account Plan | ChatNode</title>
</svelte:head>

<div class="container mb-20">
	{#if currentPlan > 1000 && currentPlan < 1006 || (currentPlan === 0 && $page.url.search.includes('appsumo'))}
	<div class="grid grid-cols-[4fr_3fr] my-8 gap-8">
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
					<p>{data.subscription?.max_bot === -1 ? 'Unlimited' : data.subscription?.max_bot} Chatbots</p>
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
				{#if currentPlan !== 1005}
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
							<input type="hidden" name="email" value={data.user.user.email} />
							{#if form?.success === false}
								<p class="text-error">{form.message || ''}</p>
							{/if}
							<button class="btn btn-primary block">Submit</button>
						</form>
					{/if}
				{/if}
			</div>
			<div class="card bg-neutral">
				<div class="card-body">
					<h2 class="text-accent font-bold text-2xl mb-4">Upgrade to Agency</h2>
					<ul class="text-xl mb-4">
						<li><span class="text-accent font-medium">Unlimited</span> Chatbots</li>
						<li><span class="text-accent font-medium">Unlimited</span> Messages</li>
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


					<p class="my-8">Agency Plan <span class="font-bold text-white">requires that you use your own OpenAI API Key.<br><span class="text-error">There are no free messages included.</span></span><br>You may set a default key for all bots and override the key per bot.</p>
					<div class="flex items-center gap-4">
						<button
							class="btn btn-accent"
							type="button"
							on:click={upgradeToAgency}
						>
							Upgrade to Agency
							<span class="badge badge-neutral badge-lg font-bold">
								{#if currentPlan > 1000}
									<s class="mr-2 opacity-80">$399</s>
									${400 - (currentPlan - 1000) * 50}
								{:else}
									$399
								{/if}
							</span>
						</button>
						<div>
						</div>
					</div>
				</div>


			</div>
		</div>
	{:else if currentPlan === 1006}

			<h2 class="font-bold text-2xl mb-4 mt-8">You purchased a lifetime <span class="text-accent">Agency Plan</span></h2>
			<ul class="text-xl mb-4">
				<li><span class="text-accent font-medium">Unlimited</span> Chatbots</li>
				<li><span class="text-accent font-medium">Unlimited</span> Messages</li>
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


			<p class="my-8">Agency Plan <span class="font-bold text-white">requires that you use your own OpenAI API Key.</span><br>You may set a default key for all bots and override the key per bot.</p>
		
	{:else if currentPlan < 1000}
		<PricingGrid {currentPlan} {billingTerm} />
	{/if}
</div>