<script lang="ts">
	export let data;

	import { deleteAccount, updateAccountEmail } from '$lib/account';

	let userEmail = data.user.user.email;
	let deleteConfirm = '';

	export let form: { message?: string };
</script>

<svelte:head>
	<title>Account Settings | ChatNode</title>
</svelte:head>

<section class="container my-10 grid gap-16">
	<div class="max-w-xl">
		<h2 class="card-title">Email</h2>
		<div class="form-control">
			<div class="input-group">
				<form on:submit={updateAccountEmail(userEmail)} class="input-group">
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

	<div class="max-w-xl">
		<h2 class="card-title">Create new password</h2>
		<form class="form-control gap-2" method="POST" action="?/changePassword">
			<div>
				<label class="label" for="email"><span class="label-text">New password</span></label>
				<input class="input input-bordered w-full" type="password" name="password" required autocomplete="new-password" />
			</div>
			<div>
				<label class="label" for="email"><span class="label-text">Confirm password</span></label>
				<input
					class="input input-bordered w-full"
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

	<div class="max-w-xl">
		<h2 class="card-title">Delete Account</h2>
		<div>
			<label class="label" for="delte-confirm"
				><span class="label-text">Type DELETE to confirm</span></label
			>
			<div class="input-group">
				<input
					class="input input-bordered w-full"
					type="text"
					name="delete-confirm"
					placeholder="DELETE"
					bind:value={deleteConfirm}
				/>
				<button
					class="btn btn-error btn-outline"
					disabled={deleteConfirm != 'DELETE'}
					on:click={() => deleteAccount()}>Confirm</button
				>
			</div>
		</div>
	</div>
</section>
