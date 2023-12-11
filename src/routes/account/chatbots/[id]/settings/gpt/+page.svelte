<script lang="ts">
	import { currentBot } from '$lib/stores';
	import VersionLabel from './versionLabel.svelte';

	export let data;

	let plan: number = data.subscription?.plan || 0;
	const plansWithGPT4: number[] = [2, 3, 4, 102, 103, 104];

	let onFreePlan: boolean = plan === 0;
	let onBasicPlan: boolean = plan === 1 || plan === 101;

	let canToggleChatNodeMsgs: boolean = true;
	let canUseCustomAPIKey: boolean = true;
	let customAPIKeyRequired: boolean = false;
	$: appSumoUserWithoutKey = plan > 1000 && plan < 1006 && !$currentBot.settings.openai_api_key;
	console.log('plan --->', plan);

	$: if (plan > 1000 && plan < 1006) {
			// Appsumo Users
			if ($currentBot.settings.openai_api_key) {
				// Who have an OpenAI API Key
				canToggleChatNodeMsgs = true;
				if (!['3.5', '3.5-june', 'azure-3.5'].includes($currentBot.settings.gptVersion)) {
					// Who switch to GPT-4
					$currentBot.settings.useChatNodeMsgs = false;
					canToggleChatNodeMsgs = false;
				}
			} else {
				// Who DON'T have an OpenAI API Key
				canToggleChatNodeMsgs = false;
				$currentBot.settings.useChatNodeMsgs = true;
			}
	} else if ([2, 3, 4, 102, 103, 104].includes(plan)) {
		// Pro and Enterprise Users
		if (!$currentBot.settings.openai_api_key) {
			$currentBot.settings.useChatNodeMsgs = true;
			canToggleChatNodeMsgs = false;
		} else {
			canToggleChatNodeMsgs = true;
		}
	} else if (plan === 1006) {
		// For Agency Users
		canUseCustomAPIKey = true;
		$currentBot.settings.useChatNodeMsgs = false;
		canToggleChatNodeMsgs = false;
		customAPIKeyRequired = true;
	} else {
		// For Basic, and Free Users
		canUseCustomAPIKey = false;
		canToggleChatNodeMsgs = false;
		$currentBot.settings.useChatNodeMsgs = true;
	}

	// Safe Gaurd Paid Plans
	$: if(onFreePlan && !['3.5', '3.5-june', 'azure-3.5'].includes($currentBot.settings.gptVersion)) {
		$currentBot.settings.gptVersion = '3.5';
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
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<VersionLabel title="ChatGPT 3.5 Turbo" value="3.5" />
				<VersionLabel title="ChatGPT 3.5 (June)" value="3.5-june" />
				<!-- <VersionLabel title={"Azure-GPT 3.5"} value={"azure-3.5"} /> -->
				<VersionLabel title="ChatGPT 16K" value="3.5-16" disabled={onFreePlan || onBasicPlan} />
				<VersionLabel title="GPT 4" value="4" disabled={onFreePlan || onBasicPlan || appSumoUserWithoutKey} />
				<VersionLabel title="GPT 4 Preview" value="4-preview" disabled={onFreePlan || appSumoUserWithoutKey} />
				<!-- <VersionLabel title={"Azure-GPT 4"} value={"azure-4"} disabled={onFreePlan  || onBasicPlan} /> -->
			</div>
	
			{#if ['3.5-16', '4', '4-preview', 'azure-4'].includes($currentBot.settings.gptVersion) && !$currentBot.settings.openai_api_key}
				<div class="alert alert-warning font-bold mt-2">
					<div>
						<h3 class="text-xl mb-2">Important!</h3>
						{#if $currentBot.settings.gptVersion === '4'}
							By enabling GPT-4 <strong>every message you send will debit 20 messages</strong>
							 from your monthly allowance.
						{:else if $currentBot.settings.gptVersion === '4-preview'}
						By enabling GPT-4 Preview <strong>every message you send will debit 20 messages</strong>
						from your monthly allowance.
						{:else if $currentBot.settings.gptVersion === '3.5-16'}
							By enabling GPT-3.5 16K <strong>every message you send will debit 4 messages</strong>
							 from your monthly allowance.
						{:else if $currentBot.settings.gptVersion === 'azure-4'}
							By enabling Azure-4 <strong>every message you send will debit 20 messages</strong>
							 from your monthly allowance.
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
				placeholder={data.user.default_openai_key
					? 'Using Default Open AI Key'
					: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'}
				class:placeholder:text-success={data.user.default_openai_key}
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

<div class="card bg-neutral card-compact mb-4">
	<div class="card-body">
		<div class="card-title">
			<h2>Enable Message Limit</h2>
		</div>
		<p class="text-sm leading-6">
			Limit the number of messages this bot can send within each usage period.
		</p>
		<div>
			<div class="form-control items-start">
				<label class="cursor-pointer label justify-start gap-4">
					<span class="label-text">OFF</span>
					<input
					type="checkbox"
					class="toggle"
					class:toggle-success={$currentBot.settings.msgLimitEnabled !== -1}
					bind:checked={$currentBot.settings.msgLimitEnabled}
					/>
					<span class="label-text">ON</span>
				</label>
			</div>
		</div>
		{#if $currentBot.settings.msgLimitEnabled}
			<div>
				<label class="label" for="msg-limit">Number of Messages</label>
				<input
					name="msg-limit"
					class="input w-full"
					type="number"
					bind:value={$currentBot.settings.msgLimit}
				/>
			</div>
		{/if}
	</div>
</div>
