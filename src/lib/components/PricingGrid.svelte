<script lang="ts">
	import { alert } from '$lib/stores.js';
	import { goto } from '$app/navigation';

	export let currentPlan: number | null

	let busyChangingPlan = false;

	$: console.log(currentPlan);

	const updatePlan = async (newPlan: number) => {
		try {
			busyChangingPlan = true;
			const res = await fetch('/api/account/plan', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newPlan)
			});
			const data = await res.json();
			console.log(data);
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

<div class="container my-10 grid md:grid-cols-3 gap-y-20">
	<div class="rounded-l-xl p-8 border border-secondary rounded-r-none my-4 bg-base-200">
		<div class="flex justify-between mb-8">
			<h2>Free</h2>
			{#if currentPlan !== null}
				<button
					on:click={() => updatePlan(0)}
					class="btn btn-outline btn-secondary"
					class:loading={busyChangingPlan}
					disabled={currentPlan === 0}>{currentPlan === 0 ? 'Current plan' : 'Change plan'}</button
				>
			{:else}
				<a href="/register" class="btn btn-outline btn-secondary">Sign up</a>
			{/if}
		</div>
		<ul class="included">
			<li>30 messages / month</li>
			<li>1 Chatbot</li>
			<li>Embed on unlimited websites</li>
			<!-- <ul class="excluded">
			<li>2000 messages / month</li>
			<li>5 Chatbots</li>
			<li>Embed on your website using an iframe or JS plugin</li>
		</ul> -->
		</ul>
	</div>
	<div class="border border-secondary p-8 -mx-[1px] rounded-2xl bg-base-100">
		<div class="flex justify-between mb-8">
			<div>
				<h2>Basic</h2>
				<h3 class="text-lg font-bold">
					30€<span class="text-xs opacity-70 ml-1 align-top">/ mo.</span>
				</h3>
			</div>
			{#if currentPlan !== null}
				<button
					on:click={() => updatePlan(1)}
					class="btn btn-outline btn-secondary"
					class:loading={busyChangingPlan}
					disabled={currentPlan === 1}>{currentPlan === 1 ? 'Current plan' : 'Change plan'}</button
				>
			{:else}
				<a href="/register" class="btn btn-outline btn-secondary">Sign up</a>
			{/if}
		</div>
		<ul class="included">
			<li>2,000 messages / month</li>
			<li>Up to 10 Chatbots</li>
			<li>Embed on unlimited websites</li>
		</ul>
	</div>
	<div class="p-8 border border-secondary rounded-r-xl my-4 bg-base-200">
		<div class="flex justify-between mb-8">
			<div>
				<h2>Pro</h2>
				<h3 class="text-lg font-bold">
					50€<span class="text-xs opacity-70 ml-1 align-top">/ mo.</span>
				</h3>
			</div>
			{#if currentPlan !== null}
				<button
					on:click={() => updatePlan(2)}
					class="btn btn-outline btn-secondary"
					class:loading={busyChangingPlan}
					disabled={currentPlan === 2}>{currentPlan === 2 ? 'Current plan' : 'Change plan'}</button
				>
			{:else}
				<a href="/register" class="btn btn-outline btn-secondary">Sign up</a>
			{/if}
		</div>
		<ul class="included">
			<li>5,000 chat responses / month</li>
			<li>20 Chatbots</li>
			<li>Embed on unlimited websites</li>
		</ul>
	</div>
	<div class="col-span-3">
		<div class="border border-secondary p-8 rounded-2xl shadow-xl max-w-6xl mx-auto bg-base-200">
			<div class="flex justify-between">
				<div class="flex items-center justify-between mb-8">
					<div>
						<h2>Enterprise</h2>
						<h3 class="text-lg font-bold">
							120€<span class="text-xs opacity-70 ml-1 align-top">/ mo.</span>
						</h3>
					</div>
				</div>
				<div>
					{#if currentPlan !== null}
						<button
							on:click={() => updatePlan(4)}
							class="btn btn-outline btn-secondary"
							class:loading={busyChangingPlan}
							disabled={currentPlan === 4}
							>{currentPlan === 4 ? 'Current plan' : 'Change plan'}</button
						>
					{:else}
						<a href="/register" class="btn btn-outline btn-secondary">Sign up</a>
					{/if}
					<div class="btn btn-outline btn-secondary">Contact Us</div>
				</div>
			</div>
			<div>
				<ul class="included grid grid-cols-2">
					<li>12,000 chat responses / month</li>
					<li>40 Chatbots</li>
					<li>Embed on unlimited websites</li>
					<li>Get a customized plan for greater usage</li>
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
		@apply mb-2  relative pl-8;
	}

	.included li {
		background: url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="20" height="20" viewBox="0 0 24 24"%3E%3Cpath fill="%23818CF8" d="m9 20.42l-6.21-6.21l2.83-2.83L9 14.77l9.88-9.89l2.83 2.83L9 20.42Z"%2F%3E%3C%2Fsvg%3E')
			no-repeat left 2px;
	}

	.excluded li {
		@apply opacity-50 text-sm;
		background: url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="%23818CF8" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"%2F%3E%3C%2Fsvg%3E')
			no-repeat left;
	}

	.included li::before {
		@apply absolute block h-5 w-5 mr-2;
	}

	.card-actions {
		@apply mt-8;
	}

	.btn:disabled {
		@apply btn-secondary !text-neutral opacity-80;
	}
</style>
