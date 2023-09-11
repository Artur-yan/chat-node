<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	export let form: { message?: string; submitted: false; success: false };

	import { page } from '$app/stores';
	import { alert } from '$lib/stores';

	const promo = $page.url.searchParams.get('promo');

	let appsumoCodes = '';

	let loading = false;
	$: loading = form?.submitted;

	$: if (form?.success) {
		$alert = form?.message;
		goto('/chatbots');
	}
	
</script>

<svelte:head>
	<title>Sign up for Free | ChatNode</title>
	<meta
		name="description"
		content="Register for your free account to create your first chatbot and discover the power of ChatGPT supercharged by your data."
	/>
</svelte:head>

<section>
	<div class="card w-96 bg-neutral text-neutral-content mx-auto my-20">
		<div class="card-body">
			<h2 class="card-title">Create an account</h2>

			<form
				class="form-control gap-2"
				method="POST"
				use:enhance
				on:submit={() => {
					loading = true;
				}}
			>
				<div>
					<label class="label" for="email"><span class="label-text">Email</span></label>
					<input
						class="input input-bordered w-full"
						type="email"
						name="email"
						id="email"
						required
					/>
				</div>

				<div>
					<label class="label" for="email"><span class="label-text">Password</span></label>
					<input
						class="input input-bordered w-full"
						type="password"
						name="password"
						id="password"
						required
						autocomplete="new-password"
					/>
				</div>

				{#if promo === 'appsumo'}
					<div>
						<label class="label" for="email"><span class="label-text">AppSumo Code(s)</span></label>
						<textarea
							class="textarea textarea-bordered w-full textarea-xs"
							spellcheck="false"
							name="appsumo-codes"
							rows="5"
							placeholder="Enter up to 5 AppSumo codes here each on a new line"
							bind:value={appsumoCodes}
						/>
					</div>
				{/if}

				{#if form?.message}
					<p class="text-error">{form.message || ''}</p>
				{/if}

				<button type="submit" class="btn btn-primary w-full mt-4">
					<span class={loading ? 'loading' : 'invisible'} />
					Create account
				</button>
				<p class="text-sm mt-4">
					Already have an account? <a href="/login" class="link">Sign in</a>
				</p>
			</form>
		</div>
	</div>
</section>
