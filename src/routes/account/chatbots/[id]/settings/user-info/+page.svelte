<script lang="ts">
	import { currentBot } from '$lib/stores.js';
	import { onMount } from 'svelte';

	export let data;

	onMount(() => {
		localStorage.setItem('submitted_info_3485', '');
		localStorage.setItem('agreed_to_policy_3485', '');
	});
</script>

<!-- Collect User Info Section -->
<div class="card bg-neutral card-compact mb-4">
	<div class="card-body">
		<div class="card-title">
			<h2>Collect User Info</h2>
		</div>
		<div class="form-control">
			<div class="flex items-center gap-10">
				<label class="label cursor-pointer flex justify-start gap-4">
					<span class="label-text">Collect Name?</span>
					<input
						type="checkbox"
						class="toggle toggle-warning input-success ml-0.5"
						bind:checked={$currentBot.settings.collectUserName}
					/>
				</label>
				<div class="flex gap-2">
					<label class="label" for="collectUserNameLabel">
						<span class="label-text">Label</span>
					</label>
					<input
						type="text"
						class="input input-sm"
						name="collectUserNameLabel"
						placeholder="Name"
						bind:value={$currentBot.settings.collectUserNameLabel}
					/>
				</div>
			</div>
			<div class="flex items-center gap-10">
				<label class="label cursor-pointer flex justify-start gap-4">
					<span class="label-text">Collect Email?</span>
					<input
						type="checkbox"
						class="toggle toggle-warning input-success ml-1.5"
						bind:checked={$currentBot.settings.collectUserEmail}
					/>
				</label>
				<div class="flex gap-2">
					<label class="label" for="collectUserEmaileLabel">
						<span class="label-text">Label</span>
					</label>
					<input
						type="text"
						class="input input-sm"
						name="collectUserEmailLabel"
						placeholder="Email"
						bind:value={$currentBot.settings.collectUserEmailLabel}
					/>
				</div>
			</div>
			<div class="flex items-center gap-10">
				<label class="label cursor-pointer flex justify-start gap-4">
					<span class="label-text">Collect Phone?</span>
					<input
						type="checkbox"
						class="toggle toggle-warning input-success"
						bind:checked={$currentBot.settings.collectUserPhone}
					/>
				</label>
				<div class="flex gap-2">
					<label class="label" for="collectUserPhoneLabel">
						<span class="label-text">Label</span>
					</label>
					<input
						type="text"
						class="input input-sm"
						name="collectUserPhoneLabel"
						placeholder="Phone"
						bind:value={$currentBot.settings.collectUserPhoneLabel}
					/>
				</div>
			</div>
			<div class="flex items-center gap-10 mt-10">
				<div class="flex gap-2">
					<label class="label" for="collectUserPhoneLabel">
						<span class="label-text">Submit Button Label</span>
					</label>
					<input
						type="text"
						class="input input-sm"
						name="collectUserInfoSubmitButtonText"
						placeholder="Start Chatting"
						bind:value={$currentBot.settings.collectUserInfoSubmitButtonText}
					/>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Policy Section -->
<div class="card bg-neutral card-compact mb-4">
	<div class="card-body">
		<div class="flex gap-2">
			<h2 class="card-title">Privacy Policy / GDPR</h2>
			<label class="cursor-pointer label justify-start gap-2">
				<span class="label-text">Enable</span>
				<input
					type="checkbox"
					class="toggle toggle-sm"
					class:toggle-success={$currentBot.settings.policyEnabled}
					bind:checked={$currentBot.settings.policyEnabled}
				/>
			</label>
		</div>

		<!-- on:click={() => localStorage.setItem('agreed_to_policy_3485', '')} -->

		{#if $currentBot.settings.policyEnabled}
			<div class="grid md:grid-cols-2 lg:grid-cols-2 gap-2 items-end">
				<div>
					<label for="public-title" class="label">
						<span class="label-text">Message</span>
					</label>
					<input
						class="input input-sm w-full"
						type="text"
						name="public-title"
						placeholder="Type Privacy Message"
						bind:value={$currentBot.settings.policyText}
					/>
				</div>

				<div>
					<label for="public-title" class="label">
						<span class="label-text">Link</span>
					</label>
					<input
						class="input input-sm w-full"
						type="text"
						name="public-title"
						placeholder="Type Privacy Link"
						bind:value={$currentBot.settings.policyLink}
					/>
				</div>
			</div>
		{/if}
	</div>
</div>
