<script lang="ts">
	import { currentBot } from '$lib/stores.js';

	export let data;

	let plan = data.subscription.plan;

	const plansWithCustomApiKey = [2, 3, 4, 102, 103, 104, 1001, 1002, 1003, 1004, 1005];
	const plansWithGPT4 = [2, 3, 4, 102, 103, 104];
	let canUseChatNodeMsgs = true;


	$: if (
		plan > 1000 &&
		$currentBot.settings.openai_api_key &&
		['3.5-16', '4'].includes($currentBot.settings.gptVersion)
	) {
		canUseChatNodeMsgs = false
		$currentBot.settings.useChatNodeMsgs = false
	}

	$: if (!$currentBot.settings.openai_api_key) {
		$currentBot.settings.useChatNodeMsgs = true

		if(!plansWithGPT4.includes(plan)) {
			$currentBot.settings.gptVersion = '3.5'
		}
	}

</script>

<div class="card bg-neutral card-compact mb-4">
	<div class="card-body">
		<div class="card-title">
			<h2>GPT Version</h2>
		</div>
		{#if !plansWithGPT4.includes(plan) && plan < 1000}
			<div class="alert text-warning mb-2 font-bold">
				This feature is available on the Pro plan or greater.
			</div>
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
						value="3.5-16"
						bind:group={$currentBot.settings.gptVersion}
						disabled={!plansWithGPT4.includes(plan) && !$currentBot.settings.openai_api_key}
					/>
					ChatGPT-16K
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
			{#if ['3.5', '4'].includes($currentBot.settings.gptVersion) && plan < 1000}
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
		{#if !plansWithCustomApiKey.includes(plan)}
			<div class="alert text-warning mb-2 font-bold">
				This feature is available on the Pro plan or greater.
			</div>
		{/if}
		<div>
			<input
				class="input w-full"
				type="text"
				bind:value={$currentBot.settings.openai_api_key}
				placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
				disabled={!plansWithCustomApiKey.includes(plan)}
			/>
			<!-- <p class="mt-2 max-w-md text-sm leading-6">
				Input your own secret api key from OpenAI and when you exhaust your messages in your
				ChatNode account, we will use your OpenAI credits to complete your requests.
			</p> -->
		</div>
		<div class="mt-4">
				<h3 class="text-lg font-bold">Use ChatNode Messages</h3>
				<div class="form-control">
					<label class="cursor-pointer label justify-start gap-4">
					<span class="label-text">OFF</span> 
					<input type="checkbox" class="toggle" class:toggle-success={$currentBot.settings.useChatNodeMsgs} disabled={!$currentBot.settings.openai_api_key || !canUseChatNodeMsgs} bind:checked={$currentBot.settings.useChatNodeMsgs} />
					<span class="label-text">ON</span> 
					</label>
				</div>
				<p class="mt-2 max-w-md text-sm leading-6">
					If turned on, we will use your ChatNode messages first and then use your OpenAI credits. You can turn this off and this bot will only use your OpenAI credits.
			</div>
	</div>
</div>
