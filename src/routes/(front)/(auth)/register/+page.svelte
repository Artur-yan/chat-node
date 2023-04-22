<script lang="ts">
	import { enhance } from '$app/forms';
	export let form: { message?: string };
</script>

<section>
	<div class="card w-96 bg-neutral text-neutral-content mx-auto my-20">
		<div class="card-body">
			<h2 class="card-title">Create an account</h2>
			<form class="form-control" method="POST" use:enhance>
				<label class="label" for="email"><span class="label-text">Email</span></label>
				<input
					class="input input-bordered"
					type="email"
					name="email"
					id="email"
					placeholder="name@company.com"
					required
				/>

				<label class="label" for="email"><span class="label-text">Password</span></label>
				<input
					class="input input-bordered"
					type="password"
					name="password"
					id="password"
					placeholder="••••••••"
					required
				/>

				<label class="label" for="promo"><span class="label-text">Promo code</span></label>
				<input type="text" name="promo" id="promo" class="input input-bordered" placeholder="Optional" />

				<a class="btn btn-ghost" href="/forgot-password">Forgot password?</a>
				{#if form?.message}
					<p class="text-error">{form.message || ''}</p>
				{/if}
				<button type="submit" class="btn btn-primary w-full">Create account</button>
				<p class="text-sm mt-4">
					Already have an account?<br /><a href="/login" class="link">Sign in</a>
				</p>
			</form>
		</div>
	</div>
</section>
