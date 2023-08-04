<script lang="ts">
	export let data;
	
	import { v4 as uuidv4 } from 'uuid';
	import { updateAccountEmail, updateApiKey } from '$lib/account.js';
	import { alert } from '$lib/stores.js';

	let apiKey = data.user.user.api_key;

	console.log(data)

	let userEmail = data.user.user.email;
	let deleteConfirm = '';

	export let form: { message?: string }; 

	const handleEmailChange = async () => {
		updateAccountEmail(userEmail);
		$alert = 'Check your email for a verification link.';
	};

	const handleUpdateApiKey = async () => {
		await updateApiKey(apiKey)
		$alert = 'Your API key has been updated.';
	}
</script>

<svelte:head>
	<title>Account Settings | ChatNode</title>
</svelte:head>

<section class="container my-10 grid gap-8">
	<div class="card bg-neutral max-w-xl">
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

	<div class="card max-w-xl bg-neutral">
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
					<label class="label" for="email"><span class="label-text">Confirm password</span></label>
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

	<div class="card bg-neutral max-w-xl">
		<div class="card-body">
			<h2 class="card-title">API Key</h2>
			<div class="join">
					<input class="join-item input  w-full" type="text" bind:value={apiKey} contenteditable="false" />
					<button class="btn btn-outline btn-secondary join-item" on:click={() => apiKey = 'sk-' + uuidv4()}>Generate</button>
				</div>
				<button class="btn w-full" on:click={handleUpdateApiKey}>Update</button>
		</div>
	</div>

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
