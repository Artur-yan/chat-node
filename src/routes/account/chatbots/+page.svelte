<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	// import Plausible from 'plausible-tracker';
	import { onMount } from 'svelte';
	import { deleteModel } from '$lib/models';
	import { PUBLIC_PLAUSIBLE_DOMAIN, PUBLIC_PLAUSIBLE_API_HOST } from '$env/static/public';
	import { PUBLIC_ENVIRONMENT, PUBLIC_CHAT_API_URL } from '$env/static/public';


	export let data;
	const userId = data.user.userId;
	
	let msgUsage: number = data.subscription.msg_count / data.subscription.max_msg;
	let botUsage: number = data.bots.length / data.subscription.max_bot;
	let onTrial = data.subscription.status === 'trialing';
	let idOfModelToDelete: string;
	let titleOfModelToDelete: string;
	let deleting = false;
	let modalDelete: HTMLDialogElement;

	$: botUsage = data.bots.length / data.subscription.max_bot;

	console.log($page.url.hostname)

	onMount(async () => {
		if (
				$page.url.searchParams.get('signup') === 'true' 
				&& data.user.tracking_status === false
				&& $page.url.hostname !== 'localhost'
				) {
			// const { trackEvent } = Plausible({
			// 	domain: PUBLIC_PLAUSIBLE_DOMAIN,
			// 	apiHost: PUBLIC_PLAUSIBLE_API_HOST
			// });

			// trackEvent('Signup');

			plausible('Signup');

			if(PUBLIC_ENVIRONMENT === 'production') {
				dataLayer.push({
					event: 'Signup'
				});
			}

			fetch('/api/account/update-tracking-status', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}

		if($page.url.searchParams.get('plan')) {
			const plan = $page.url.searchParams.get('plan');
			const res = await fetch(`${PUBLIC_CHAT_API_URL}/api/update-plan`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					user_id: userId,
					plan: plan
				})
			});

			const data = await res.json();
			const stripeLink = data.url;
			goto(stripeLink);
		}

		if(data?.subscription?.plan === -1) {
			goto('/account/settings/subscription')
		}
	});

	let startDate = new Date();
	let today = new Date();
	let resetDate = new Date();
	startDate.setDate(15);
	resetDate.setDate(15);

	if (today.getDate() > 15) {
		resetDate.setMonth(resetDate.getMonth() + 1);
	} else {
		startDate.setMonth(startDate.getMonth() - 1);
	}

</script>

<svelte:head>
	<title>My Chatbots | ChatNode</title>
</svelte:head>

<div class="bg-neutral py-2">
	<div class="container flex justify-between items-center">
		<div>
			<h1 class="font-bold">Dashboard</h1>
		</div>
		<button
			on:click={() => goto('/account/chatbots/create')}
			class="btn btn-primary btn-sm btn-outline text-xs pr-1"
			disabled={data.user.status !== 'active' || botUsage >= 1}
		>
			New Bot <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
				<path
					fill="currentColor"
					d="M17 13h-4v4h-2v-4H7v-2h4V7h2v4h4m2-8H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"
				/>
			</svg>
		</button>
	</div>
</div>

<div class="container pt-4 pb-20">
	<div class="card card-compact card-bordered border-neutral mb-4">
		<div class="card-body">
			<div class="flex gap-8 items-center">
				<div class="grid md:grid-cols-3 gap-2 md:gap-8 items-center w-full">
					<div>
						<div class="flex justify-between">
							<h4>Messages</h4>
							<span class="opacity-60">
								{data.subscription.msg_count}/{onTrial ? 100 : data.subscription.max_msg}
								{#if onTrial}
									<span class="badge badge-warning font-semibold mx-1">Trial</span>
								{/if}
							</span>
						</div>
						<progress
							class="progress progress-secondary w-full bg-neutral h-1"
							class:progress-error={msgUsage > 0.9}
							value={data.subscription.msg_count}
							max={data.subscription.max_msg}
						/>
					</div>
					<div>
						<div class="flex justify-between">
							<h4>Bots</h4>
							<span class="opacity-60">
								{data.bots.length}/{data.subscription.max_bot === -1
									? '∞'
									: data.subscription.max_bot}
							</span>
						</div>
						<progress
							class="progress progress-secondary w-full bg-neutral h-1"
							class:progress-warning={botUsage > 0.9}
							value={data.bots.length}
							max={data.subscription.max_bot}
						/>
					</div>
					<div>
						<div class="flex justify-between">
							<h4>{data.subscription.cancel_at ? 'Cancelation Date' : 'Usage Reset Date'}</h4>
							<span class="opacity-60">{resetDate.toLocaleDateString()}</span>
						</div>
						<progress
							class="progress progress-warning w-full bg-neutral h-1"
							class:progress-warning={data.subscription.cancel_at}
							value={today.getTime() - startDate.getTime()}
							max={resetDate.getTime() - startDate.getTime()}
						/>
					</div>
				</div>
				{#if botUsage >= 1 || msgUsage > 0.75 || data.subscription.cancel_at}
					<a href="/account/settings/subscription" class="btn btn-warning">Upgrade</a>
				{/if}
			</div>
		</div>
	</div>

	{#if data.bots.length > 0}
		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
			{#each data.bots as bot}
				{@const usage = Math.ceil((bot.tocken_count / data.subscription.max_tocken) * 100)}
				<a
					href="chatbots/{bot.id}"
					class="card bg-neutral peer-checked:ring-2 hover:outline-primary hover:outline"
				>
					<div class="card-body p-6">
						<div class="flex justify-between items-center">
							<h2 class="card-title">
								{#if bot.status === 'training'}
									<div class="text-warning">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
											viewBox="0 0 24 24"
										>
											<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2">
												<path
													stroke-dasharray="2 4"
													stroke-dashoffset="6"
													d="M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3"
												>
													<animate
														attributeName="stroke-dashoffset"
														dur="0.6s"
														repeatCount="indefinite"
														values="6;0"
													/>
												</path>
												<path
													stroke-dasharray="30"
													stroke-dashoffset="30"
													d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21"
												>
													<animate
														fill="freeze"
														attributeName="stroke-dashoffset"
														begin="0.1s"
														dur="0.3s"
														values="30;0"
													/>
												</path>
												<path stroke-dasharray="10" stroke-dashoffset="10" d="M12 16v-7.5">
													<animate
														fill="freeze"
														attributeName="stroke-dashoffset"
														begin="0.5s"
														dur="0.2s"
														values="10;0"
													/>
												</path>
												<path
													stroke-dasharray="6"
													stroke-dashoffset="6"
													d="M12 8.5l3.5 3.5M12 8.5l-3.5 3.5"
												>
													<animate
														fill="freeze"
														attributeName="stroke-dashoffset"
														begin="0.7s"
														dur="0.2s"
														values="6;0"
													/>
												</path>
											</g>
										</svg>
									</div>
								{/if}
								<a
									href="chatbots/{bot.id}"
									class="text-primary text-base truncate"
									title={bot.name}
								>
									{bot.name}
								</a>
							</h2>
							<div
								class="tooltip tooltip-info tooltip-left"
								data-tip={bot.created.toLocaleTimeString()}
							>
								<h3 class="text-xs">{bot.created.toLocaleDateString()}</h3>
							</div>
						</div>

						<div class="flex items-center justify-between">
							<div class="flex items-baseline gap-4">
								<h3 class="text-xs font-bold">Token usage</h3>
								<div>
									<span class="text-xs font-bold text-secondary">{usage}%</span>
									<span
										class="radial-progress bg-base-100 text-secondary border-2 border-base-100"
										style="--value:{usage}; --size: 0.875rem; --thickness: 3px;"
									/>
								</div>

								{#if bot.settings.gptVersion === '4'}
									<div class="badge badge-warning">GPT-4</div>
								{/if}
							</div>

							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<div class="dropdown dropdown-left dropdown-start z-[1]">
								<label tabindex="0" class="btn btn-ghost btn-square" on:click|preventDefault>
									<Icon icon="tabler:dots" height="24" />
								</label>
								<ul
									tabindex="0"
									class="dropdown-content menu p-2 shadow-xl bg-base-100 rounded-box z-10x"
								>
									<li>
										<a href="/account/chatbots/{bot.id}/share">
											<Icon icon="mdi:code" width="18" /> Share
										</a>
									</li>
									<li>
										<a href="/account/chatbots/{bot.id}/data">
											<Icon icon="mdi:database" width="18" /> Data
										</a>
									</li>
									<li>
										<a href="/account/chatbots/{bot.id}/history">
											<Icon icon="tabler:history" width="18" /> History
										</a>
									</li>
									<li>
										<a href="/account/chatbots/{bot.id}/settings">
											<Icon icon="mdi:settings" width="18" /> Settings
										</a>
									</li>
									<li>
										<a href="/account/chatbots/{bot.id}/settings/delete">
											<Icon icon="mdi:delete-outline" width="18" /> Delete
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</a>
			{/each}
		</div>
	{:else if data.subscription?.status === 'expired'}
		<div class="alert alert-warning justify-between flex">
			<h3 class="font-bold text-lg">Your Free Trial Has Expired</h3>
			<a class="btn" href="/account/settings/subscription">Upgrade</a>
		</div>
	{:else if data.user.status !== 'active'}
		<div class="alert alert-warning my-4">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				class="stroke-current flex-shrink-0 w-6 h-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<div>
				<h3 class="text-xl font-bold mb-2">Check your email</h3>
				<p class="text-lg">
					We sent you a link. Please verify your email address before creating your first chatbot
				</p>
			</div>

			<!-- <button class="btn btn-sm btn-ghost" on:click={handleResendVerificationLink}>Resend verification email</button> -->
		</div>

		<p class="text-sm">
			Is your email ({data.user.email}) correct? Change it via
			<a href="/account/settings" class="link">account settings</a>
		</p>
	{:else}
		<div class="card bg-base-300">
			<div class="card-body items-center py-[10vh]">
				<h2 class="card-title font-bold text-2xl">Get Started</h2>
				<div class="card-actions justify-center">
					<button on:click={() => goto('/account/chatbots/create')} class="btn btn-accent">
						Create a chatbot
					</button>
				</div>
			</div>
		</div>
{/if}
</div>

<!-- <input type="checkbox" id="delete-modal" class="modal-toggle" /> -->
<dialog class="modal" id="modal_delete" bind:this={modalDelete}>
	<div class="modal-box">
		<h3 class="font-bold text-lg">Are you sure you want to delete {titleOfModelToDelete}?</h3>
		<p class="py-4">This can't be undone</p>
		<div class="modal-action justify-between">
			<button class="btn" on:click={modalDelete.close()}>Cancel</button>
			<button
				class="btn btn-error"
				type="button"
				on:click={async () => {
					deleting = true;
					await deleteModel(idOfModelToDelete);
					deleting = false;
					modalDelete.close();
					invalidateAll();
				}}
			>
				<span class={deleting ? 'loading' : 'invisible'} />
				Delete
			</button>
		</div>
	</div>
</dialog>
