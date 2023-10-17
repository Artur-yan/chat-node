<script lang="ts">
	export let data;
	export let form: { message?: string };

	import { updateAccountEmail, updateApiKey, updateDefaultOpenAIKey } from '$lib/account.js';
	import { alert } from '$lib/stores.js';

	let apiKey = data.user.user.api_key;
	let defaultOpenAIKey = data.user.user.default_openai_key || '';

	let userEmail = data.user.user.email;

	const handleEmailChange = async () => {
		updateAccountEmail(userEmail);
		$alert = 'Check your email for a verification link.';
	};

	const handleUpdateApiKey = async () => {
		try {
			apiKey = await updateApiKey();
			$alert = 'An API key has been generated.';
		} catch (err) {
			console.error(err);
		}
	};

	const handleUpdateDefaultOpenAIKey = () => {
		updateDefaultOpenAIKey(defaultOpenAIKey);
	};

	const plansWithApiFeature = [3, 4, 103, 104, 1001, 1002, 1003, 1004, 1005, 1006];
</script>

<svelte:head>
	<title>Account Settings | ChatNode</title>
</svelte:head>

<section class="container my-10 grid md:grid-cols-2 gap-8">
	<div class="space-y-8">
		<div class="card bg-neutral">
			<div class="card-body">
				<h2 class="card-title">Email</h2>
				<div class="form-control">
					<div class="input-group">
						<form on:submit={handleEmailChange} class="input-group">
							<input
								class="input input-bordered w-full"
								type="text"
								name="email"
								bind:value={userEmail}
							/>
							<button class="btn btn-secondary" type="submit">Update</button>
						</form>
					</div>
				</div>
			</div>
		</div>

		<div class="card bg-neutral">
			<div class="card-body">
				<h2 class="card-title">Create new password</h2>
				<form class="form-control gap-2" method="POST" action="?/changePassword">
					<div>
						<label class="label" for="email"><span class="label-text">New password</span></label>
						<input
							class="input w-full"
							type="password"
							name="password"
							required
							autocomplete="new-password"
						/>
					</div>
					<div>
						<label class="label" for="email">
							<span class="label-text">Confirm password</span>
						</label>
						<input
							class="input w-full"
							type="password"
							name="confirm-password"
							required
							autocomplete="new-password"
						/>
					</div>
					<input type="hidden" value={data.user.user.email} name="email" />
					{#if form?.message}
						<p class="text-error">{form.message || ''}</p>
					{/if}
					<button type="submit" class="btn">Update</button>
				</form>
			</div>
		</div>
		<div class="card bg-neutral">
			<div class="card-body">
				<h2 class="card-title">Privacy</h2>
				<div>
					<a
						href="#"
						class="btn"
						onclick="window.displayPreferenceModal();return false;"
						id="termly-consent-preferences"
					>
						Consent Preferences
					</a>
					<a class="btn" href="https://app.termly.io/notify/3f2d25ad-6a63-49f0-ad4b-3e0615a49ead">
						DSAR Form
					</a>
				</div>
			</div>
		</div>
	</div>
	<div class="space-y-8">
		<div class="card bg-neutral">
			<div class="card-body">
				<h2 class="card-title">API Key</h2>
				<p>Fetch your chat history and query your bots with our API</p>
				{#if plansWithApiFeature.includes(data.subscription.plan)}
					<div class="join">
						<input
							class="join-item input w-full"
							type="text"
							placeholder="Click generate to create an API key"
							bind:value={apiKey}
							disabled
						/>
						<button
							class="btn btn-outline btn-secondary join-item"
							on:click={handleUpdateApiKey}
							disabled={!plansWithApiFeature.includes(data.subscription.plan)}
						>
							Generate
						</button>
					</div>
					<div>
						<a href="https://api.public.chatnode.ai/redoc" class="btn btn-sm" target="_blank">
							View Documentation
						</a>
					</div>
				{:else}
					<div class="alert mb-2 text-warning justify-between flex">
						API access is available on the Enterprise plans <a
							href="/account/settings/subscription"
							class="btn"
						>
							Upgrade
						</a>
					</div>
				{/if}
			</div>
		</div>
		<div class="card bg-neutral">
			<div class="card-body">
				<h2 class="card-title">Default OpenAI API Key</h2>
				<p>Enter an OpenAI API key that all bots will use by default. You can override this key per bot. If a bot currently has an OpenAI key defined, it will continue to use that key. All other bots will use this key once your message limit has been reached.</p>
					<div class="join">
						<input
							class="join-item input w-full"
							type="text"
							bind:value={defaultOpenAIKey}
						/>
						<button
							class="btn btn-outline btn-secondary join-item"
							on:click={handleUpdateDefaultOpenAIKey}
						>
							Update
						</button>
					</div>
			</div>
		</div>

	</div>

	<div />

	<!-- <div class="max-w-xl">
		<h2 class="card-title">Delete Account</h2>
		<div>
			<label class="label" for="delte-confirm"
				><span class="label-text">Type DELETE to confirm</span></label
			>
			<div class="input-group">
				<input
					class="input w-full"
					type="text"
					name="delete-confirm"
					placeholder="DELETE"
					bind:value={deleteConfirm}
				/>
				<button
					class="btn btn-error btn-outline plausible-event-name=Deleted+Account"
					disabled={deleteConfirm != 'DELETE'}
					on:click={() => deleteAccount()}>Confirm</button
				>
			</div>
		</div>
	</div> -->
</section>
