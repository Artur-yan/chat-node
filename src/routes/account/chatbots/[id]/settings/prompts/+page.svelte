<script lang="ts">
	import { currentBot } from '$lib/stores.js';
	import { defaultSettings } from '$lib/models.js';
	import Modal from '$lib/components/Modal.svelte';
	import CopyButton from '$lib/components/CopyButton.svelte';

	const personalities = {
		default: {
			label: 'Default',
			systemPrompt:
				'You are a helpful assistant named "Assistant Al". You limit your knowledge to the context provided. Never break character. Always answer in the language of my message.'
		},
		airbnb: {
			label: 'AirBnB Host',
			systemPrompt: `I want you to act as a property customer support AI that I am having a conversation with. Your name is "YOUR PROPERTY NAME property AI". You will provide me with answers related to YOUR PROPERTY NAME property. You will be as detailed as possible. Refuse to answer any question not about the text or YOUR PROPERTY NAME property. Never break character. Do NOT say "Based on the given information." Always answer in the language of my message.  Please use simple and clear formatting`
		},
		support: {
			label: 'Customer Support',
			greeting: 'Hello, how can I help you today?',
			supportMessage: 'If you need more help, please contact us at',
			systemPrompt:
				'I want you to act as a customer support AI from YOUR WEBSITE/COMPANY that I am having a conversation with. Your name is "YOUR WEBSITE/COMPANY AI". You will provide me with answers related to <Website/company name>. You will be as detailed as possible. Refuse to answer any question not about the text or <Website/company name>. Never break character. Do NOT say "Based on the given information." Always answer in the language of my message. Please use simple and clear formatting',
			creativity: 0.1
		},
		documentation: {
			label: 'Documentation',
			greeting: 'What can I find for you in the [Your Company] docs?',
			supportMessage: 'If you need more help, please contact us at',
			systemPrompt:
				'I want you to act as a documentation support AI from <Website/company name/documentation name> that I am having a conversation with. Your name is "<Website/company name/documentation name> documentation support AI". You will provide me with answers related to <Website/company name/documentation name> documentation. You will be as detailed as possible. Refuse to answer any question not about the text or <Website/company name/documentation name>. Never break character. Do NOT say "Based on the given information." Always answer in the language of my message. Please use simple and clear formatting',
			creativity: 0.1
		},
		coder: {
			label: 'Coding Assistant',
			greeting: 'What can I find for you in the [Your Company] docs?',
			supportMessage: 'If you need more help, please contact us at',
			systemPrompt:
				'I want you to act as a assistant coder AI from <Website/company name/package name> that I am having a conversation with. Your name is "<Website/company name/package name> assistant coder AI". You will provide me with answers related to <Website/company name/package name> documentation. You will be as detailed as possible. Refuse to answer any question not about the text or <Website/company name/package name>. Never break character. Do NOT say "Based on the given information." Always answer in the language of my message. Please use simple and clear formatting',
			creativity: 0.1
		},
		writer: {
			label: 'Writing Assistant',
			greeting: 'What can I find for you in the [Your Company] docs?',
			supportMessage: 'If you need more help, please contact us at',
			systemPrompt:
				'I want you to act as an assistant writer AI that I am having a conversation with. Your name is "Assistant writer AI". You will help me to write and rephrase text. You will use your context to provide better answer.  Never break character. Do NOT say "Based on the given information." Always answer in the language of my message.  Please use simple and clear formatting',
			creativity: 0.5
		},
		personal: {
			label: 'Personal Brand',
			greeting: 'What can I find for you in the [Your Company] docs?',
			supportMessage: 'If you need more help, please contact us at',
			systemPrompt:
				'I want you to act as “<your personal brand name>”. You are a <lawyer/podcaster/celebrity> that I am having a conversation with. Your name is "<your personal brand name>". You will provide me with answers related to <law/podcast topic> in a <friendly/professional> style. You will be as detailed as possible. Refuse to answer any question not about the text or related to <your personal brand name> topic. Never break character. Do NOT say "Based on the given information." Always answer in the language of my message. Please use simple and clear formatting',
			creativity: 0.5
		}
	};

	// let personality: keyof typeof personalities = $currentBot.settings.personality || 'default';

	// const setPersonality = () => {
	// 	$currentBot.settings.greeting = personailites[personality].greeting;
	// 	$currentBot.settings.supportMessage = personailites[personality].supportMessage;
	// 	$currentBot.settings.systemPrompt = personailites[personality].systemPrompt;
	// 	$currentBot.settings.temperature = personailites[personality].creativity;
	// 	$currentBot.settings.personalityCustomized = false;
	// }

	// const handleAddTemplate = (personality: string) => {
	// 	$currentBot.settings.systemPrompt = personailites[personality].systemPrompt;
	// }
</script>

<form>
	<!-- <div class="card bg-neutral mb-4">
		<div class="card-body">
			<h2 class="card-title">Personality</h2>
			<p>Choose a personality from the dropdown as a starting point for your bot with pre-defined prompts, then customize however you like.</p>
			<select class="select" bind:value={personality} on:change={setPersonality} >
				{#each Object.entries(personailites) as [key, value]}
					<option value={key}>{value.label}</option>
				{/each}
			</select>
			{#if $currentBot.settings.personalityCustomized}
			<div>
				<span class="badge badge-secondary">Customized</span>
				<button class="btn btn-xs btn-ghost btn-warning" on:click={setPersonality}>Reset to {personailites[personality].label}</button>
			</div>
			{/if}
		</div>
	</div> -->
	<div>
		<label for="greeting" class="label">
			<span class="label-text">
				Greeting <span
					class="tooltip tooltip-right badge"
					data-tip="Your trained model will include this greeting and help it to answer the first question more naturally"
				>
					?
				</span>
			</span>
		</label>
		<input type="text" bind:value={$currentBot.settings.greeting} class="input w-full mb-2" />
	</div>
	<div>
		<label for="system-prompt" class="label">
			<span class="label-text">
				System Prompt <span
					class="tooltip tooltip-right badge"
					data-tip="The system prompt helps set the behavior of the assistant. If properly crafted, the system prompt can be used to set the tone and the kind of response by the model. The default system prompt prevents hallucination from the assistant and replies only based on the trained data"
				>
					?
				</span>
			</span>
			<button
				type="button"
				class="btn btn-xs text-secondary"
				on:click={() => personalityTemplates.showModal()}
			>
				+ Add Template
			</button>
			<!-- <button
				class="btn btn-xs btn-circle btn-ghost tooltip tooltip-left"
				data-tip="Reset to default"
				on:click|preventDefault={() =>
					($currentBot.settings.systemPrompt = defaultSettings.systemPrompt)}
				><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
					><path
						fill="currentColor"
						d="M20 13.5a6.5 6.5 0 0 1-6.5 6.5H6v-2h7.5c2.5 0 4.5-2 4.5-4.5S16 9 13.5 9H7.83l3.08 3.09L9.5 13.5L4 8l5.5-5.5l1.42 1.41L7.83 7h5.67a6.5 6.5 0 0 1 6.5 6.5Z"
					/></svg
				></button
			> -->
		</label>

		<textarea
			bind:value={$currentBot.settings.systemPrompt}
			on:input={() => ($currentBot.settings.personalityCustomized = true)}
			class="textarea w-full leading-normal"
			name="prompt"
			rows="10"
			maxlength="3200"
		/>
	</div>
	{#if $currentBot.settings.userPrompt}
		<div>
			<label for="user-prompt" class="label">
				<span class="label-text">
					User Prompt <span
						class="tooltip tooltip-right badge"
						data-tip="The user prompt is a message put right before the context (your data) and the user message. It can help to steer the model more strongly than the system message. Use with caution, it can be quite powerful"
					>
						?
					</span>
				</span>
			</label>
			<textarea
				bind:value={$currentBot.settings.userPrompt}
				class="textarea textarea-bordered w-full"
				name="user-prompt"
				maxlength="2400"
			/>
		</div>
	{/if}
	<div>
		<label for="temp" class="label">
			<span class="label-text">Creativity</span>
		</label>
		<input
			type="range"
			min={0}
			max={2.0}
			class="range range-xs range-primary"
			step={0.1}
			name="temp"
			bind:value={$currentBot.settings.temperature}
		/>

		<div class="label">
			<span class="label-text-alt">More Focused</span>
			<span class="badge badge-primary">{$currentBot.settings.temperature}</span>
			<span class="label-text-alt">More Creative</span>
		</div>
	</div>
</form>

<Modal id="personalityTemplates" title="Templates" maxWidth="1200px">
	<div class="space-y-10">
		{#each Object.entries(personalities) as [key, personality]}
			<div>
				<h2 class="text-secondary font-bold mb-2">
					{personality.label}
					<CopyButton textToCopy={personality.systemPrompt} />
				</h2>
				<p>{@html personality.systemPrompt}</p>
			</div>
		{/each}
	</div>
</Modal>
