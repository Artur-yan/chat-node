<script lang="ts">
	import { enhance } from '$app/forms';
	export let form: { submitted: false; error: false; message?: string };

	let email = '';
	let loading = false;
	$: loading = form?.submitted;
</script>

<svelte:head>
	<title>Login | ChatNode</title>
	<meta
		name="description"
		content="Jump back in to manage your chatbots, add new data, get your embed codes, access your private chatbots or manage your account settings."
	/>
</svelte:head>

<section>
	<div class="card w-96 bg-neutral text-neutral-content mx-auto my-20">
		<div class="card-body">
			<h2 class="card-title">Sign in</h2>
			<form class="form-control gap-2" method="POST" use:enhance on:submit={() => (loading = true)}>
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
						autocomplete="new-password"
					/>
				</div>
				{#if form?.message}
					<p class="text-error">{form?.message || ''}</p>
				{/if}
				<button type="submit" class="btn btn-primary w-full my-4">
					<span class={loading ? 'loading' : 'invisible'} />

					Sign in
				</button>
				<a href="/oauth/google">
					<button class="w-full flex items-center justify-center gap-2 rounded-lg border bg-white border-slate-200 px-4 py-2 text-slate-700 transition duration-150 hover:border-slate-400 hover:text-slate-900 hover:shadow dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-slate-300">
						<img class="h-6 w-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
						<span>Login with Google</span>
					</button>
				</a>
			</form>
			<div>
				<a
					class="link text-sm"
					href="/login/forgot-password{email != '' ? '?email=' + encodeURIComponent(email) : ''}"
				>
					Forgot password?
				</a>
				<p class="text-sm mt-4">
					Don't have an account? <a href="/register" class="link">Create an account</a>
				</p>
			</div>
		</div>
	</div>
</section>
