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

<section class="flex items-center justify-center">
	<div class="card w-96 bg-neutral text-neutral-content mx-auto md:my-16 shadow-lg shadow-indigo-900">
		<a class="flex gap-2 mx-auto p-6 mt-4 -mb-6 items-end" href="https://chatnode.ai">
			<div>
				<svg
					width="32"
					height="32"
					viewBox="0 0 25 25"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M17.5659 9.95206C17.5659 10.6394 17.0087 11.1966 16.3214 11.1966H15.9065C15.2192 11.1966 14.6619 10.6394 14.6619 9.95206L14.6619 2.36802C14.6619 2.03123 14.459 1.726 14.1432 1.60895C12.3471 0.943268 10.4043 0.57959 8.37666 0.57959H2.00814C1.43534 0.57959 0.970996 1.04394 0.970996 1.61674C0.970996 3.63734 0.93996 5.66077 0.964561 7.68162C0.968691 8.02086 1.2456 8.29263 1.58487 8.29263L7.60934 8.29263C8.2967 8.29263 8.85392 8.84985 8.85392 9.53721V9.95206C8.85392 10.6394 8.2967 11.1966 7.60934 11.1966L2.03766 11.1966C1.64592 11.1966 1.35104 11.5545 1.44396 11.9351C1.82599 13.4998 2.42987 14.9774 3.22037 16.333C3.46819 16.7579 3.93069 17.0047 4.42262 17.0047H16.3214C17.0087 17.0047 17.5659 17.5619 17.5659 18.2492V18.6641C17.5659 19.3514 17.0087 19.9087 16.3214 19.9087H7.04882C6.67598 19.9087 6.4984 20.3561 6.78168 20.5985C9.68205 23.0805 13.4486 24.5796 17.5653 24.5796H24.971V17.1739C24.971 11.6855 22.3066 6.81948 18.2007 3.79866C17.9338 3.60233 17.5659 3.7977 17.5659 4.12899L17.5659 9.95206Z"
						fill="#818CF8"
					/>
				</svg>
			</div>
	
			<span class="text-xl font-bold text-white tracking-wide leading-none">ChatNode</span>
		</a>
		<h2 class="card-title mx-auto my-2 text-2xl bg-gradient-to-r from-indigo-500 via-indigo-400 to-indigo-300 text-transparent bg-clip-text">Welcome Back!</h2>

		<div class="card-body">
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
					Don't have an account? <a href="/register" class="link text-slate-100">Create an account</a>
				</p>
			</div>
		</div>
	</div>
</section>
