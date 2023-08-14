<script lang="ts">
	import { currentBot } from '$lib/stores.js';
	import { defaultSettings } from '$lib/models.js';

	const personailites = {
		'default': {
			greeting: 'Hello, how can I help you today????',
			supportMessage: `If the answer is not included, say exactly "Hmm, I don't know" and stop after that.`,
			systemPrompt: '???I want you to act as a document that I am having a conversation with. Your name is "AI Assistant". You will provide me with answers from the given info. Refuse to answer any question not about the text. Never break character. Do NOT say "Based on the given information." Always answer in the language of my message.'
		},
		'airbnb': {
			greeting: 'Do you have question about your rental?',
			supportMessage: 'If you need more help, please contact us at',
			systemPrompt: 'If you need more help, please contact us at'
		},
		'support': {
			greeting: 'Hello, how can I help you today?',
			supportMessage: 'If you need more help, please contact us at',
			systemPrompt: 'If you need more help, please contact us at'
		},
		'documentation': {
			greeting: 'What can I find for you in the [Your Company] docs?',
			supportMessage: 'If you need more help, please contact us at',
			systemPrompt: 'If you need more help, please contact us at'
		},
		'custom': {
			greeting: '',
			supportMessage: '',
			systemPrompt: ''
		}
	}

	let personality: keyof typeof personailites = 'default';

	const setPersonality = () => {
		$currentBot.settings.greeting = personailites[personality].greeting;
		$currentBot.settings.supportMessage = personailites[personality].supportMessage;
		$currentBot.settings.systemPrompt = personailites[personality].systemPrompt;
	}

</script>

<div>
	<div class="card bg-neutral mb-4">
		<div class="card-body">
			<h2 class="card-title">Personality</h2>
			<p>Choose a personality from the dropdown as a starting point for your bot with pre-defined prompts, then customize however you like.</p>
			<select class="select" bind:value={personality} on:change={setPersonality} >
				<option value="default">Default</option>
				<option value="airbnb">🏠 AirBnB Host</option>
				<option value="support">🧑‍🔧 Customer Support</option>
				<option value="documentation">📃 Documentation</option>
				<option value="coding">👩‍💻 Coding Assistant</option>
				<option value="custom">Custom</option>
			</select>
		</div>
	</div>
	<div>
		<label for="greeting" class="label">
			<span class="label-text"
				>Greeting <span
					class="tooltip tooltip-right badge"
					data-tip="Your trained model will include this greeting and help it to answer the first question more naturally"
					>?</span
				></span
			>
		</label>
		<input type="text" bind:value={$currentBot.settings.greeting} class="input w-full mb-2" />
	</div>
	<div>
		<label for="support-message" class="label">
			<span class="label-text"
				>Support Prompt <span
					class="tooltip tooltip-right badge"
					data-tip="The support prompt is a message that we put at the end of your system prompt. It is usually an instruction to tell the assistant what to do if the question is outside the data scope or it just doesn't know the answer. You can change that to allow more or less flexibility in your chatbot knowledge domain answer."
					>?</span
				></span
			>
			<button
				class="tooltip tooltip-left btn btn-xs btn-circle btn-ghost"
				data-tip="Reset to default"
				on:click|preventDefault={() =>
					($currentBot.settings.supportMessage = defaultSettings.supportMessage)}
				><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
					><path
						fill="currentColor"
						d="M20 13.5a6.5 6.5 0 0 1-6.5 6.5H6v-2h7.5c2.5 0 4.5-2 4.5-4.5S16 9 13.5 9H7.83l3.08 3.09L9.5 13.5L4 8l5.5-5.5l1.42 1.41L7.83 7h5.67a6.5 6.5 0 0 1 6.5 6.5Z"
					/></svg
				></button
			>
		</label>
		<textarea
			bind:value={$currentBot.settings.supportMessage}
			class="textarea w-full leading-normal"
			rows="2"
			maxlength="800"
		/>
	</div>
	<div>
		<label for="system-prompt" class="label">
			<span class="label-text"
				>System Prompt <span
					class="tooltip tooltip-right badge"
					data-tip="The system prompt helps set the behavior of the assistant. If properly crafted, the system prompt can be used to set the tone and the kind of response by the model. The default system prompt prevents hallucination from the assistant and replies only based on the trained data"
					>?</span
				></span
			>
			<button
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
			>
		</label>

		<textarea
			bind:value={$currentBot.settings.systemPrompt}
			class="textarea w-full leading-normal"
			name="prompt"
			rows="5"
			maxlength="3200"
		/>
	</div>
	{#if $currentBot.settings.userPrompt}
	<div>
		<label for="user-prompt" class="label">
			<span class="label-text"
				>User Prompt <span
					class="tooltip tooltip-right badge"
					data-tip="The user prompt is a message put right before the context (your data) and the user message. It can help to steer the model more strongly than the system message. Use with caution, it can be quite powerful"
					>?</span
				></span
			>
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

		<label class="label">
			<button class="label-text-alt">More Focused</button>
			<span class="badge badge-primary">{$currentBot.settings.temperature}</span>
			<span class="label-text-alt">More Creative</span>
		</label>
	</div>
</div>
