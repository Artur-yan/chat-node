<script lang="ts">
	import { currentBot } from '$lib/stores.js';

	export let data;

	let plan = data.subscription.plan;

	console.log($currentBot);

	const plansWthCustomApiKey = [2, 3, 4, 102, 103, 104, 1001, 1002, 1003, 1004, 1005];
	const plansWithGPT4 = [2, 3, 4, 102, 103, 104];
</script>

<div class="card bg-neutral card-compact mb-4">
	<div class="card-body">
		<div class="card-title">
			<h2>GPT Version</h2>
		</div>
		{#if plan === 0}
			<div class="alert text-warning mb-2 font-bold">GPT-4 is only available on paid plans.</div>
		{/if}
		<div>
			<div class="join">
				<label class="btn join-item btn-outline btn-neutral aria-checked:bg-primary">
					<input
						class="radio radio-sm radio-primary"
						type="radio"
						value="3.5"
						bind:group={$currentBot.settings.gptVersion}
					/>
					ChatGPT 3.5 Turbo
				</label>
				<label
					class="btn join-item btn-outline {plansWithGPT4.includes(plan) ||
					$currentBot.settings.openai_api_key
						? 'btn-neutral'
						: 'btn-disabled'}"
				>
					<input
						class="radio radio-sm radio-primary"
						type="radio"
						value="4"
						bind:group={$currentBot.settings.gptVersion}
						disabled={!plansWithGPT4.includes(plan) && !$currentBot.settings.openai_api_key}
					/>
					GPT-4
				</label>
			</div>
			{#if $currentBot.settings.gptVersion === '4'}
				<div class="alert alert-warning font-bold mt-2">
					<div>
						<h3 class="text-xl mb-2">Important!</h3>
						By enabling GPT-4 every message you send will debit 20 messages from your monthly allowance.
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<div class="card bg-neutral card-compact mb-4">
	<div class="card-body">
		<div class="card-title">
			<h2>Personal OpenAI API Key</h2>
		</div>
		{#if !plansWthCustomApiKey.includes(plan)}
			<div class="alert text-warning mb-2 font-bold">
				This feature is available on the Pro plan or greater.
			</div>
		{/if}
		<div>
			<input
				class="input w-full max-w-lg"
				type="text"
				bind:value={$currentBot.settings.openai_api_key}
				disabled={!plansWthCustomApiKey.includes(plan)}
			/>
		</div>
	</div>
</div>
