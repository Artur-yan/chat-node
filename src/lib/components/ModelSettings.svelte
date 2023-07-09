<script lang="ts">
	import { updateModel, deleteModel, defaultSettings } from '$lib/models';
	import Icon from '@iconify/svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import { alert } from '$lib/stores';
	import Accordian from '$lib/components/Accordian.svelte';

	export let id: string;
	export let name: string;
	export let plan = 0;
	export let settings = defaultSettings;
	export let open = false;

	let busySaving = false;
	let deleting = false;

	const addUrl = (url: string) => {
		settings.allowedUrls = [...settings.allowedUrls, url];
	};

	const removeUrl = (i: number) => {
		settings.allowedUrls.splice(i, 1);
		settings.allowedUrls = [...settings.allowedUrls];
	};

	const handleSubmit = async () => {
		console.log('SUBMITTED')
		busySaving = true;
		await updateModel(id, name, settings);
		busySaving = false;
		$alert = { msg: 'Settings Saved', type: 'success' };
		invalidateAll();
	};


	if (!settings.gptVersion) {
		settings.gptVersion = '3.5';
	}
	if (settings.temperature === undefined) {
		settings.temperature = 0.1;
	}


</script>

<div>
	<form on:submit={handleSubmit} class="grid gap-10 pb-32">
		<div>
			<label for="name" class="label">
				<span class="label-text">Name</span>
			</label>
			<input type="text" bind:value={name} class="input input-lg w-full" placeholder="Untitled" />
		</div>
		<Accordian {open}>
			<div slot="title">Prompts</div>
			<div>
				<div>
					<label for="greeting" class="label">
						<span class="label-text">Greeting</span>
					</label>
					<input type="text" bind:value={settings.greeting} class="input w-full mb-2" />
				</div>
				<div>
					<label for="support-message" class="label">
						<span class="label-text">Support Prompt <span class="tooltip tooltip-right badge" data-tip="The support prompt is a message that we put at the end of your system prompt. It is usually an instruction to tell the assistant what to do if the question is outside the data scope or it just doesn't know the answer. You can change that to allow more or less flexibility in your chatbot knowledge domain answer.">?</span></span>
						
					</label>
					<textarea bind:value={settings.supportMessage} class="textarea w-full leading-normal" rows="2" maxlength="800" />
				</div>
				<div>
					<label for="system-prompt" class="label">
						<span class="label-text">System Prompt <span class="tooltip tooltip-right badge" data-tip="The system prompt helps set the behavior of the assistant. If properly crafted, the system prompt can be used to set the tone and the kind of response by the model. The default system prompt prevents hallucination from the assistant and replies only based on the trained data">?</span></span>
						<button
							class="btn btn-xs btn-circle btn-ghost"
							on:click|preventDefault={() => (settings.systemPrompt = defaultSettings.systemPrompt)}
							><Icon icon="mdi:arrow-u-left-top" width="18" /></button
						>
					</label>

					<textarea
						bind:value={settings.systemPrompt}
						class="textarea w-full leading-normal"
						name="prompt"
						rows="5"
						maxlength="3200"
					/>
				</div>
				<div>
					<label for="user-prompt" class="label">
						<span class="label-text">User Prompt <span class="tooltip tooltip-right badge" data-tip="The user prompt is a message put right before the context (your data) and the user message. It can help to steer the model more strongly than the system message. Use with caution, it can be quite powerful">?</span></span>
					</label>
					<textarea
						bind:value={settings.userPrompt}
						class="textarea textarea-bordered w-full"
						name="user-prompt"
						maxlength="2400"
					/>
				</div>
				<div>
					<label for="temp" class="label">
						<span class="label-text">Creativity</span>
					</label>
					<input type="range" min={0} max={0.7} class="range range-xs range-primary" step={0.1} name="temp" bind:value={settings.temperature} />

					<label class="label">
						<span class="label-text-alt">&larr; Focused</span>
						<span class="badge">{settings.temperature}</span>
						<span class="label-text-alt">Creative &rarr;</span>
					  </label>
				</div>
			</div>
		</Accordian>
		<Accordian {open}>
			<div slot="title">ChatGPT Version</div>
			{#if plan === 0}
				<div class="alert alert-warning mb-2 font-bold">GPT-4 is only available on paid plans.</div>
			{/if}
			<label class="btn btn-neutral aria-checked:bg-primary">
				<input
					class="radio radio-sm radio-primary"
					type="radio"
					value="3.5"
					bind:group={settings.gptVersion}
				/>
				ChatGPT 3.5 Turbo
			</label>
			<label class="btn {plan === 0 ? 'btn-disabled' : 'btn-neutral'}">
				<input
					class="radio radio-sm radio-primary"
					type="radio"
					value="4"
					bind:group={settings.gptVersion}
					disabled={plan === 0}
				/>
				GPT-4
			</label>
			{#if settings.gptVersion === '4'}
				<div class="alert alert-warning font-bold mt-2">
					<div>
						<h3 class="text-xl mb-2">Important!</h3>
						By enabling GPT-4 every message you send will debit 20 messages from your monthly allowance.
					</div>
				</div>
			{/if}
		</Accordian>

		<Accordian {open}>
			<div slot="title" id="publishing">Publishing</div>
			<div>
				<div class="form-control">
					<label class="label cursor-pointer flex justify-start gap-4 self-start">
						<span class="label-text">Private</span>
						<input
							type="checkbox"
							class="toggle toggle-warning input-success"
							bind:checked={settings.public}
						/>
						<span class="label-text">Public</span>
					</label>
				</div>
				{#if settings.public}
					<div class="space-y-4">
						<p class="text-xs">
							Add specific urls you would like to allow this chatbot to be displayed on.
						</p>
						{#each settings.allowedUrls as url, i}
							<div class="input-group">
								<input
									name="url-{i}"
									bind:value={settings.allowedUrls[i]}
									class="input w-full"
									placeholder="https://example.com"
									autofocus
								/>
								<button class="btn text-error/75" on:click={() => removeUrl(i)}
									><Icon icon="mdi:minus-circle-outline" width="16" /></button
								>
							</div>
						{/each}
						<button
							class="btn btn-xs btn-ghost btn-primary"
							type="button"
							on:click={() => addUrl('')}
							><Icon icon="mdi:plus-circle-outline" width="16" class="mr-2" /> Add URL</button
						>
					</div>
				{/if}
			</div>
		</Accordian>
		<label for="my-modal" class="btn btn-error btn-sm btn-outline btn-circle mx-auto"
			><Icon icon="mdi:delete-outline" width="16" /></label
		>
		<div class="fixed bottom-0 left-0 right-0 bg-base-300 p-2 flex items-center justify-between">
			<button class="btn btn-outline btn-success md:w-40" type="submit">
				<span class={busySaving ? 'loading' : 'invisible'} />

				Save</button
			>
		</div>
	</form>
</div>

<input type="checkbox" id="my-modal" class="modal-toggle" />
<div class="modal">
	<div class="modal-box">
		<h3 class="font-bold text-lg">Are you sure you want to delete this chatbot?</h3>
		<p class="py-4">This can't be undone</p>
		<div class="modal-action">
			<label for="my-modal" class="btn">Cancel</label>
			<button
				class="btn btn-error"
				type="button"
				on:click={async () => {
					deleting = true;
					await deleteModel(id);
					goto('/account/chatbots');
				}}
			>
				<span class={deleting ? 'loading' : 'invisible'} />
				Delete</button
			>
		</div>
	</div>
</div>
