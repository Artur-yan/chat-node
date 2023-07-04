<script lang="ts">
	import { alert } from '$lib/stores.js';
	import { goto, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	export let currentPlan: number | undefined = undefined;

	let busyChangingPlan = false;
	let referralCode = '';
	let billingTerm = 'yearly'

	console.log(currentPlan)

	onMount(() => {
		if (rewardful) {
			rewardful('ready', function () {
				if (Rewardful.referral) {
					referralCode = Rewardful.referral;
				}
			});
		}
	});

	const updatePlan = async (newPlan: number) => {
		try {
			busyChangingPlan = true;
			const res = await fetch('/api/account/plan', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ newPlan, referralCode })
			});
			const data = await res.json();
			if (data.url) {
				goto(data.url);
			} else if (data.status == 'success') {
				currentPlan = newPlan;
				$alert = { msg: 'Plan updated successfully', type: 'success' };
			}
		} catch (err) {
			console.error(err);
			$alert = { msg: 'Something went wrong', type: 'error' };
		} finally {
			busyChangingPlan = false;
			invalidateAll();
		}
	};
</script>

<div class="relative">

<div class="text-center my-4 sticky top-20 z-10">
	<div class="join">
		<button class="btn join-item border-primary" class:btn-primary={billingTerm == 'monthly'} on:click={() => billingTerm = 'monthly'}>Monthly</button>
		<button class="btn join-item border-primary" class:btn-primary={billingTerm == 'yearly'} on:click={() => billingTerm = 'yearly'}>Yearly <span class="badge badge-accent capitalize">2 months free</span></button>
	</div>

</div>

<div class="my-10 grid md:grid-cols-3 gap-y-8 lg:gap-y-20">
	<div class="rounded-xl md:rounded-r-none p-8 border border-secondary md:my-4 bg-base-200">
		<div class="flex justify-between mb-8">
			<h2>Free</h2>
			{#if currentPlan !== undefined}
				<button
					on:click={() => updatePlan(0)}
					class="btn btn-outline btn-secondary"
					disabled={currentPlan === 0}
				>
					<span class={busyChangingPlan ? 'loading' : 'invisible'} />

					{currentPlan === 0 ? 'Current plan' : 'Change plan'}</button
				>
			{:else}
				<a href="/account/settings/plan" class="btn btn-outline btn-secondary">Sign up</a>
			{/if}
		</div>
		<ul class="included">
			<li>30 messages/month</li>
			<li>1 Chatbot</li>
			<li>
				<div
					class="tooltip border-b border-dotted border-white/30"
					data-tip="approx. 400,000 characters"
				>
					100,000 tokens/bot
				</div>
			</li>
			<li>Add Multiple Data Sources</li>
			<li>Embed on unlimited websites</li>
		</ul>
	</div>
	<div class="border border-secondary p-8 py-12 md:-mx-[1px] rounded-2xl bg-base-100 shadow-xl">
		<div class="flex justify-between mb-8">
			<div>
				<h2>Basic</h2>
				<h3 class="text-lg font-bold">
					{#if billingTerm === 'monthly'}
						<div transition:slide>$19<span class="text-xs opacity-70 ml-1 align-top">/ mo.</span></div>
					{:else}
						<div transition:slide>$190<span class="text-xs opacity-70 ml-1 align-top">/ yr.</span></div>
					{/if}
				</h3>
			</div>
			{#if currentPlan !== undefined}
				{#if billingTerm == 'monthly'}
					<button
						on:click={() => updatePlan(1)}
						class="btn btn-outline btn-secondary"
						disabled={currentPlan === 1}
					>
						<span class={busyChangingPlan ? 'loading' : 'invisible'} />

						{currentPlan === 1 ? 'Current plan' : 'Change plan'}</button
					>
				{:else}
					<button
					on:click={() => updatePlan(101)}
					class="btn btn-outline btn-secondary"
					disabled={currentPlan === 101}
				>
					<span class={busyChangingPlan ? 'loading' : 'invisible'} />

					{currentPlan === 101 ? 'Current plan' : 'Change plan'}</button
				>
				{/if}
			{:else}
				<a href="/account/settings/plan" class="btn btn-outline btn-secondary">Sign up</a>
			{/if}
		</div>
		<ul class="included">
			<li>2,000 messages/month</li>
			<li>Up to 5 Chatbots</li>
			<li>
				<div
					class="tooltip border-b border-dotted border-white/30"
					data-tip="approx. 1,600,000 characters"
				>
					400,000 tokens/bot
				</div>
			</li>
			<li>Add Multiple Data Sources</li>
			<li>Embed on unlimited websites</li>
		</ul>
	</div>
	<div class="p-8 border border-secondary rounded-xl md:rounded-l-none my-4 bg-base-200">
		<div class="flex justify-between mb-8">
			<div>
				<h2>Pro</h2>
				<h3 class="text-lg font-bold">
					{#if billingTerm === 'monthly'}
						<div transition:slide>$49<span class="text-xs opacity-70 ml-1 align-top">/ mo.</span></div>
					{:else}
						<div transition:slide>$490<span class="text-xs opacity-70 ml-1 align-top">/ yr.</span></div>
					{/if}
				</h3>
			</div>
			{#if currentPlan !== undefined}
				{#if billingTerm == 'monthly'}
					<button
						on:click={() => updatePlan(2)}
						class="btn btn-outline btn-secondary"
						disabled={currentPlan === 2}
					>
						<span class={busyChangingPlan ? 'loading' : 'invisible'} />

						{currentPlan === 2 ? 'Current plan' : 'Change plan'}</button
					>
				{:else}
					<button
						on:click={() => updatePlan(102)}
						class="btn btn-outline btn-secondary"
						disabled={currentPlan === 102}
					>
						<span class={busyChangingPlan ? 'loading' : 'invisible'} />

						{currentPlan === 102 ? 'Current plan' : 'Change plan'}</button
					>
				{/if}
			{:else}
				<a href="/account/settings/plan" class="btn btn-outline btn-secondary">Sign up</a>
			{/if}
		</div>
		<ul class="included">
			<li>5,000 messages/month</li>
			<li>10 Chatbots</li>
			<li>
				<div
					class="tooltip border-b border-dotted border-white/30"
					data-tip="approx. 3,200,000 characters"
				>
					800,000 tokens/bot
				</div>
			</li>
			<li>Add Multiple Data Sources</li>
			<li>Embed on unlimited websites</li>
			<ul class="extra">
				<li>Add custom logo</li>
			</ul>
		</ul>
	</div>
	<div class="col-span-full">
		<div class="border border-secondary p-8 rounded-2xl max-w-6xl mx-auto bg-base-200">
			<div class="flex justify-between">
				<div class="flex items-center justify-between mb-8">
					<div>
						<h2>Enterprise</h2>
						<h3 class="text-lg font-bold">
							{#if billingTerm === 'monthly'}
								<div transition:slide>$99<span class="text-xs opacity-70 ml-1 align-top">/ mo.</span></div>
							{:else}
								<div transition:slide>$990<span class="text-xs opacity-70 ml-1 align-top">/ yr.</span></div>
							{/if}
						</h3>
					</div>
				</div>
				<div>
					{#if currentPlan !== undefined}
					{#if billingTerm == 'monthly'}
					<button
						on:click={() => updatePlan(3)}
						class="btn btn-outline btn-secondary"
						disabled={currentPlan === 3}
					>
						<span class={busyChangingPlan ? 'loading' : 'invisible'} />

						{currentPlan === 3 ? 'Current plan' : 'Change plan'}</button
					>
				{:else}
					<button
						on:click={() => updatePlan(103)}
						class="btn btn-outline btn-secondary"
						disabled={currentPlan === 103}
					>
						<span class={busyChangingPlan ? 'loading' : 'invisible'} />

						{currentPlan === 103 ? 'Current plan' : 'Change plan'}</button
					>
				{/if}
					{:else}
						<a href="/account/settings/plan" class="btn btn-outline btn-secondary">Sign up</a>
					{/if}
				</div>
			</div>
			<div>
				<ul class="included grid grid-cols-2">
					<li>10,000 messages/month</li>
					<li>20 Chatbots</li>
					<li>
						<div
							class="tooltip border-b border-dotted border-white/30"
							data-tip="approx. 4,000,000 characters"
						>
							1,000,000 tokens/bot
						</div>
					</li>
					<li>Add Multiple Data Sources</li>
					<li>Embed on unlimited websites</li>
					<li>Add custom logo</li>
				</ul>
				<ul class="extra">
					<li>Access chat history</li>
					<li><span class="">Get a customized plan for greater usage</span></li>
				</ul>
			</div>
		</div>
	</div>
</div>

</div>

<style lang="postcss">
	h2 {
		@apply text-2xl font-bold text-secondary;
	}

	li {
		@apply mb-2 relative pl-8;
	}

	.included li {
		background: url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="16" height="16" viewBox="0 0 24 24"%3E%3Cpath fill="%23818CF8" d="m9 20.42l-6.21-6.21l2.83-2.83L9 14.77l9.88-9.89l2.83 2.83L9 20.42Z"%2F%3E%3C%2Fsvg%3E')
			no-repeat left 2px;
	}

	.extra li {
		background: url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="18" height="18" viewBox="0 0 24 24"%3E%3Cpath fill="%23F470B4" d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z"%2F%3E%3C%2Fsvg%3E')
			no-repeat left 2px;
	}

	li::before {
		@apply absolute block h-5 w-5 mr-2;
	}

	.btn:disabled {
		@apply btn-secondary !text-neutral opacity-80;
	}
</style>
