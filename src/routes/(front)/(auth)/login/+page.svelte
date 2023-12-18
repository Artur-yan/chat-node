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
			<h2 class="card-title mx-auto">Welcome Back!</h2>
			<a href="/oauth/google" class="my-4">
				<button class="w-full -mt-4 flex items-center justify-center gap-2 rounded-lg border bg-white border-slate-700 px-4 py-2 text-slate-700 transition duration-150 hover:border-slate-400 hover:text-slate-900">
					<img class="h-6 w-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo"> 
					<span>Sign in with Google</span>
				</button>
			</a>
			<div class="relative">
				<div class="absolute inset-0 flex items-center" aria-hidden="true">
					<div class="w-full border-t border-slate-600"></div>
				</div>
				<div class="relative flex justify-center text-sm font-medium leading-6">
					<span class="bg-slate-800 px-6 text-slate-600">OR</span>
				</div>
			</div>
			<form class="form-control gap-2" method="POST" use:enhance on:submit={() => (loading = true)}>
				<div>
					<label class="label" for="email"><span class="label-text font-medium">Email</span></label>
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
					<label class="label" for="email"><span class="label-text font-medium">Password</span></label>
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
			</form>
			<div>
				<a
					class="link text-sm text-slate-500"
					href="/login/forgot-password{email != '' ? '?email=' + encodeURIComponent(email) : ''}"
				>
					Forgot password?
				</a>
				<p class="text-sm mt-4 text-slate-500">
					Don't have an account? <a href="/register" class="link">Create an account</a>
				</p>
			</div>
		</div>
	</div>
</section>
