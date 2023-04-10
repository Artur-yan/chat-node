<script lang="ts">
	import { enhance } from '$app/forms';
	export let form: { message?: string };
</script>

<section>
	<div class="container flex justify-center px-6 py-10">
		<div class="w-full rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
			<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
				<h1 class="font-bold">Create an Account</h1>
				<form class="space-y-4 md:space-y-6" method="POST" use:enhance>
					<div>
						<label for="email">Your email</label>
						<input type="email" name="email" id="email" placeholder="name@company.com" required />
					</div>
					<div>
						<label for="password">Password</label>
						<input type="password" name="password" id="password" placeholder="••••••••" required />
						<a href="account/forgot-password" class="text-sm py-2 inline-block">Forgot password?</a>
					</div>
					<button type="submit" class="w-full button">Create account</button>
					<p class="text-sm">
						Already have an account? <a href="account/login" class="">Sign in</a>
					</p>
				</form>
			</div>
		</div>
	</div>
</section>
{#if form?.message}
	<p class="error">{form.message || ''}</p>
{/if}
