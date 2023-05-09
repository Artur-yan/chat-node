<script lang="ts">
	import { enhance } from '$app/forms';
	export let form: { message?: string; submitted: false; promo: string };

	let loading = false;
	$: loading = form?.submitted;
</script>

<section>
	<div class="card w-96 bg-neutral text-neutral-content mx-auto my-20">
		<div class="card-body">
			<h2 class="card-title">Create an account</h2>
			<form class="form-control gap-2" method="POST" use:enhance on:submit={() => (loading = true)}>
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
					/>
				</div>

				{#if form?.message}
					<p class="text-error">{form.message || ''}</p>
				{/if}
				<button type="submit" class="btn btn-primary w-full mt-4" class:loading>
					Create account
				</button>
				<p class="text-sm mt-4">
					Already have an account? <a href="/login" class="link ml-2">Sign in</a>
				</p>
			</form>
		</div>
	</div>
</section>
