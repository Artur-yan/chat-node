<script lang="ts">
	import { currentBot } from '$lib/stores.js';

	export let data;

	let plan = data.subscription?.plan || 0;
	const plansWithGPT4 = [2, 3, 4, 102, 103, 104];
	let canToggleChatNodeMsgs = true;
	let canOnlyUseGPT3 = false;
	let canUseCustomAPIKey = true;
	let customAPIKeyRequired = false

	$: if (plan > 1000 && plan < 1006) { // Appsumo Users
		if($currentBot.settings.openai_api_key) { // Who have an OpenAI API Key
			canOnlyUseGPT3 = false;
			canToggleChatNodeMsgs = true;
			if ($currentBot.settings.gptVersion != '3.5') { // Who switch to GPT-4
				$currentBot.settings.useChatNodeMsgs = false
				canToggleChatNodeMsgs = false;
			}
		} else { // Who DON'T have an OpenAI API Key
			canOnlyUseGPT3 = true;
			canToggleChatNodeMsgs = false;
			$currentBot.settings.useChatNodeMsgs = true
		}
	} else if ([2,3,4,102,103,104].includes(plan)) { // Pro and Enterprise Users
		if(!$currentBot.settings.openai_api_key) {
			$currentBot.settings.useChatNodeMsgs = true
			canToggleChatNodeMsgs = false;
		} else {
			canToggleChatNodeMsgs = true;
		}
	}  else if (plan === 1006) { // For Agency Users
		canUseCustomAPIKey = true;
		$currentBot.settings.useChatNodeMsgs = false
		canToggleChatNodeMsgs = false;
		customAPIKeyRequired = true
	} else { // For Basic, and Free Users
		canUseCustomAPIKey = false;
		canOnlyUseGPT3 = true;
		canToggleChatNodeMsgs = false;
		$currentBot.settings.useChatNodeMsgs = true
	}

	$: if (canOnlyUseGPT3) $currentBot.settings.gptVersion = '3.5';
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
					class="btn join-item btn-outline" class:btn-disabled={canOnlyUseGPT3}>
					<input
						class="radio radio-sm radio-primary"
						type="radio"
						value="3.5-16"
						bind:group={$currentBot.settings.gptVersion}
						disabled={canOnlyUseGPT3}
					/>
					ChatGPT-16K
				</label>
				<label
					class="btn join-item btn-outline" class:btn-disabled={canOnlyUseGPT3}>
					<input
						class="radio radio-sm radio-primary"
						type="radio"
						value="4"
						bind:group={$currentBot.settings.gptVersion}
						disabled={canOnlyUseGPT3}
					/>
					GPT-4
				</label>
			</div>
			{#if ['3.5-16', '4'].includes($currentBot.settings.gptVersion) && plan < 1000 && !$currentBot.settings.openai_api_key}
				<div class="alert alert-warning font-bold mt-2">
					<div>
						<h3 class="text-xl mb-2">Important!</h3>
						{#if $currentBot.settings.gptVersion === '4'}
							By enabling GPT-4 <strong>every message you send will debit 20 messages</strong> from your monthly allowance.
						{:else}
							By enabling GPT-3.5 16K <strong>every message you send will debit 4 messages</strong> from your monthly allowance.
						{/if}
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
		{#if !canUseCustomAPIKey}
			<div class="alert text-warning mb-2 font-bold">
				This feature is available on the Pro plan or greater.
			</div>
		{/if}
		<div>
			<input
				class="input w-full"
				type="text"
				bind:value={$currentBot.settings.openai_api_key}
				placeholder={
					data.user.user.default_openai_key
						? "Using Default Open AI Key"
						: "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
				}
				class:placeholder:text-success={data.user.user.default_openai_key}
				disabled={!canUseCustomAPIKey}
			/>
			<!-- <p class="mt-2 max-w-md text-sm leading-6">
				Input your own secret api key from OpenAI and when you exhaust your messages in your
				ChatNode account, we will use your OpenAI credits to complete your requests.
			</p> -->
		</div>
		<div class="mt-4">
			<h3 class="text-lg font-bold">Use ChatNode Messages</h3>
			<div class="form-control items-start">
				<label class="cursor-pointer label justify-start gap-4">
					<span class="label-text">OFF</span>
					<input
						type="checkbox"
						class="toggle"
						class:toggle-success={$currentBot.settings.useChatNodeMsgs}
						disabled={!canToggleChatNodeMsgs}
						bind:checked={$currentBot.settings.useChatNodeMsgs}
					/>
					<span class="label-text">ON</span>
				</label>
			</div>
			<p class="mt-2 max-w-md text-sm leading-6">
				If turned on, we will use your ChatNode messages first and then use your OpenAI credits. You
				can turn this off and this bot will only use your OpenAI credits.
			</p>
		</div>
	</div>
</div>
