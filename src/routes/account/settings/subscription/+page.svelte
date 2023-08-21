<script lang="ts">
	import { enhance } from '$app/forms';
	import PricingGrid from '$lib/components/PricingGrid.svelte';
	import { alert } from '$lib/stores';

	import tiersMap from '$lib/data/tiers';
	import { invalidateAll } from '$app/navigation';

	export let data;
	export let form;

	let billingTerm = 'monthly';

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
</script>

<svelte:head>
	<title>Account Plan | ChatNode</title>
</svelte:head>

<div class="container mb-20">
	{#if currentPlan > 1000}
		<h1 class="font-bold text-3xl mb-4 mt-10">
			You purchased a lifetime <span class="text-primary">{tier.name}</span> plan
		</h1>

		<p class="font-bold text-secondary text-lg mb-2">Your plan includes:</p>

		<div class="text-lg mb-4 leading-8">
			<p>{data.subscription?.max_bot} Chatbots</p>
			<p>{data.subscription?.max_tocken.toLocaleString()} Tokens/Bot</p>
			<p>{data.subscription?.max_msg} Messages/Month</p>
		</div>

		<div class="text-lg mb-4 leading-8">
			<!-- Conert object to arrtay for looping -->
			{#each Object.entries(tier.features) as [key, value]}
				<p>{value.label}</p>
			{/each}
		</div>

		{#if currentPlan !== 1005}
			<button
				class="btn btn-primary btn-outline"
				on:click={() => (showAppsumoKeysField = !showAppsumoKeysField)}>Upgrade</button
			>

			{#if showAppsumoKeysField}
				<form method="POST" action="?/upgradeAppsumo" use:enhance>
					<label class="label" for="email"><span class="label-text">AppSumo Code(s)</span></label>
					<textarea
						class="textarea textarea-bordered w-full textarea-xs max-w-lg"
						spellcheck="false"
						name="appsumo-codes"
						rows="5"
						placeholder="Enter up to 5 AppSumo codes here each on a new line"
						bind:value={appsumoCodes}
					/>
					{#if form?.success === false}
						<p class="text-error">{form.message || ''}</p>
					{/if}
					<button class="btn btn-primary block">Submit</button>
				</form>
			{/if}
		{/if}
	{:else}
		<PricingGrid {currentPlan} {billingTerm} />
	{/if}
</div>
