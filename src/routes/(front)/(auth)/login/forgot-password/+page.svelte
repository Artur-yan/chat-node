<script lang="ts">
	import { enhance } from '$app/forms';
	export let form: { message?: string; success: false; submitted: false };
	import { page } from '$app/stores';

	let email = $page.url.searchParams.get('email');
	let loading = false;
	$: loading = form?.submitted;
</script>

<section>
	<div class="card w-96 bg-neutral text-neutral-content mx-auto my-20">
		<div class="card-body">
			<h2 class="card-title">Reset password</h2>
			{#if !form?.success}
				<form
					class="form-control gap-2"
					method="POST"
					use:enhance
					on:submit={() => (loading = true)}
				>
					<div>
						<label class="label" for="email"><span class="label-text">Email</span></label>
						<input
							class="input input-bordered w-full"
							type="email"
							name="email"
							id="email"
							placeholder="name@company.com"
							required
							bind:value={email}
						/>
					</div>
					{#if form?.message}
						<p class="text-error">{form.message || ''}</p>
					{/if}
					<button type="submit" class="btn btn-primary w-full" class:loading>Send link</button>
				</form>
			{:else}
				<div class="alert alert-success">
					<div>
						<span>Please check your email for a password reset link.</span>
					</div>
				</div>
				<p class="text-success" />
			{/if}
			<div>
				<p class="text-sm mt-4">
					<a href="/login" class="link">&larr; Sign in</a>
				</p>
			</div>
		</div>
	</div>
</section>
