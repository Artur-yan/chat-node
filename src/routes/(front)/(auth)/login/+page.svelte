<script>
	import { enhance } from '$app/forms';
	export let form

	let email = ''	

</script>

<section>
	<div class="card w-96 bg-neutral text-neutral-content mx-auto my-20">
		<div class="card-body">
			<h2 class="card-title">Sign in</h2>
			<form class="form-control gap-2" method="POST" use:enhance>
				<div>
					<label class="label" for="email"><span class="label-text">Email</span></label>
					<input
						class="input input-bordered w-full"
						type="email"
						name="email"
						id="email"
						required
						bind:value={email}
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
					<p class="text-error">{form?.message || ''}</p>
				{/if}
				<button type="submit" class="btn btn-primary w-full my-4">Sign in</button>
			</form>
			<div>
				<a class="link text-sm" href="/login/forgot-password{email != '' ? '?email=' + encodeURIComponent(email) : ''}">Forgot password?</a>
				<p class="text-sm mt-4">
					Don't have an account? <a href="/register" class="link">Create an account</a>
				</p>
			</div>
		</div>
	</div>
</section>
