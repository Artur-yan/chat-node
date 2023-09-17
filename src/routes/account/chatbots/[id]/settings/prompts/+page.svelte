<script lang="ts">
	import { currentBot } from '$lib/stores.js';
	import { personalities } from '$lib/models.js';
	import Modal from '$lib/components/Modal.svelte';

	const addSuggestedQuestion = () => {
		$currentBot.settings.suggestedQuestions = [
			...$currentBot.settings.suggestedQuestions,
			{ label: 'Who Are You?', value: 'What is your name and what is your purpose?' }
		];
	};

	const deleteSuggestedQuestion = (index: number) => {

		$currentBot.settings.suggestedQuestions.splice(index, 1);

		$currentBot.settings.suggestedQuestions = [...$currentBot.settings.suggestedQuestions]
	};

	$: console.log($currentBot.settings.suggestedQuestions)
</script>

<div>
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
			<span class="label-text">
				Creativity <span
					class="tooltip tooltip-right badge"
					data-tip='The "creativity" in ChatGPT (known officially as "temperature") refers to the level of randomness in the generated responses. A higher temperature will result in more random and creative responses, while a lower temperature will produce more focused and deterministic responses.'
				>
					?
				</span>
			</span>
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


	<div class="card bg-neutral card-compact mt-8">
		<div class="card-body">
			<h2 class="card-title">Suggested Questions</h2>

			<div class="overflow-x-auto">
				<table class="table table-sm">
				  <!-- head -->
				  <thead>
					<tr>
					  <th>Label</th>
					  <th>Question</th>
					</tr>
				  </thead>
				  <tbody>
						{#each $currentBot.settings.suggestedQuestions as question, i }
							<tr>
								<td class="w-2/5"><input class="input input-sm w-full" type="text" bind:value={$currentBot.settings.suggestedQuestions[i].label}></td>
								<td class="w-full"><input class="input input-sm w-full" type="text" bind:value={$currentBot.settings.suggestedQuestions[i].value}></td>
								<td>
									<button type="button" class="btn text-error btn-ghost btn-sm btn-circle" on:click={() => deleteSuggestedQuestion(i)}>
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2M7 13h10v-2H7"/></svg>
									</button>
								</td>
							</tr>
						{/each}
				  </tbody>
				</table>
				<button class="btn btn-sm mt-4" on:click={addSuggestedQuestion}>Add</button>
			  </div>
		</div>
	</div>
</div>

<Modal id="personalityTemplates" title="Templates" maxWidth="800px">
	<div class="alert mb-10 bg-neutral">
		<div>
			Use one of these many examples as a starting point. Don't forget to replace generic
			information with your specifics. Refer to our <a href="/blog">blog</a>
			 for more usefult tips.
		</div>
	</div>
	<div class="space-y-10">
		{#each Object.entries(personalities) as [key, personality]}
			<div>
				<div class="flex justify-between gap-2">
					<h2 class="text-secondary font-bold mb-2">
						{personality.label}
					</h2>
					<button
						class="btn btn-xs btn-primary btn-outline"
						on:click={() => ($currentBot.settings.systemPrompt = personality.systemPrompt)}
					>
						Insert
					</button>
				</div>
				<p>{@html personality.systemPrompt}</p>
			</div>
		{/each}
	</div>
</Modal>
