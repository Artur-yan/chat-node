<script lang="ts">
	import { alert } from '$lib/stores.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	export let currentPlan: number | undefined = undefined;

	let busyChangingPlan = false;
	let referralCode = ''

	onMount(() => {
		rewardful('ready', function() {
			if(Rewardful.referral) {
				console.log('Current referral ID: ', Rewardful.referral);
				referralCode = Rewardful.referral;
			} else {
				console.log('No referral present.');
			}
		});
	});

	const updatePlan = async (newPlan: number) => {
		try {
			busyChangingPlan = true;
			const res = await fetch('/api/account/plan', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({newPlan, referralCode})
			});
			const data = await res.json();
			if (data.url) {
				goto(data.url);
			} else if (data.status == 'success') {
				currentPlan = newPlan;
				$alert = 'Plan updated successfully';
			}
		} catch (err) {
			console.error(err);
		} finally {
			busyChangingPlan = false;
		}
	};
</script>

<div class="my-10 grid md:grid-cols-3 gap-y-8 lg:gap-y-20">
	<div class="rounded-xl md:rounded-r-none p-8 border border-secondary md:my-4 bg-base-200">
		<div class="flex justify-between mb-8">
			<h2>Free</h2>
			{#if currentPlan !== undefined}
				<button
					on:click={() => updatePlan(0)}
					class="btn btn-outline btn-secondary"
					class:loading={busyChangingPlan}
					disabled={currentPlan === 0}>{currentPlan === 0 ? 'Current plan' : 'Change plan'}</button
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
			<li>Embed on unlimited websites</li>
		</ul>
	</div>
	<div class="border border-secondary p-8 md:-mx-[1px] rounded-2xl bg-base-100 shadow-xl">
		<div class="flex justify-between mb-8">
			<div>
				<h2>Basic</h2>
				<h3 class="text-lg font-bold">
					19€<span class="text-xs opacity-70 ml-1 align-top">/ mo.</span>
				</h3>
			</div>
			{#if currentPlan !== undefined}
				<button
					on:click={() => updatePlan(1)}
					class="btn btn-outline btn-secondary"
					class:loading={busyChangingPlan}
					disabled={currentPlan === 1}>{currentPlan === 1 ? 'Current plan' : 'Change plan'}</button
				>
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
					49€<span class="text-xs opacity-70 ml-1 align-top">/ mo.</span>
				</h3>
			</div>
			{#if currentPlan !== undefined}
				<button
					on:click={() => updatePlan(2)}
					class="btn btn-outline btn-secondary"
					class:loading={busyChangingPlan}
					disabled={currentPlan === 2}>{currentPlan === 2 ? 'Current plan' : 'Change plan'}</button
				>
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
		</ul>
	</div>
	<div class="col-span-full">
		<div class="border border-secondary p-8 rounded-2xl max-w-6xl mx-auto bg-base-200">
			<div class="flex justify-between">
				<div class="flex items-center justify-between mb-8">
					<div>
						<h2>Enterprise</h2>
						<h3 class="text-lg font-bold">
							99€<span class="text-xs opacity-70 ml-1 align-top">/ mo.</span>
						</h3>
					</div>
				</div>
				<div>
					{#if currentPlan !== undefined}
						<button
							on:click={() => updatePlan(3)}
							class="btn btn-outline btn-secondary"
							class:loading={busyChangingPlan}
							disabled={currentPlan === 3}
							>{currentPlan === 3 ? 'Current plan' : 'Change plan'}</button
						>
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

					<li><span class="">Get a customized plan for greater usage</span></li>
				</ul>
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

	.included li::before {
		@apply absolute block h-5 w-5 mr-2;
	}

	.btn:disabled {
		@apply btn-secondary !text-neutral opacity-80;
	}
</style>
