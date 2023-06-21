<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	import Plausible from 'plausible-tracker';
	import { onMount } from 'svelte';
	import { deleteModel } from '$lib/models';

	export let data;

	let msgUsage: number = data.subscription.msg_count / data.subscription.max_msg;
	let botUsage: number = data.bots.length / data.subscription.max_bot;
	let idOfModelToDelete: string;
	let titleOfModelToDelete: string;
	let deleting = false;
	let modalDelete: HTMLDialogElement;

	$: botUsage = data.bots.length / data.subscription.max_bot;

	onMount(() => {
		const { trackEvent } = Plausible({
			domain: 'chatnode.ai',
			apiHost: 'https://www.chatnode.ai/events'
		});
		if ($page.url.searchParams.get('signup') == 'success') {
			trackEvent('Signup');
		}
	});

	const today = new Date();
	const resetDate = new Date(today.setMonth(today.getMonth() + 1));
	resetDate.setDate(15);
	let daysLeftUntilAllotmentsReset = Math.ceil(
		(resetDate - new Date().getTime()) / (1000 * 3600 * 24)
	);
</script>

<svelte:head>
	<title>My Chatbots | ChatNode</title>
</svelte:head>

<div class="container pb-20">
	<div class="flex justify-between my-2 items-center">
		<div>
			<h1 class="text-xl font-bold text-secondary">Chatbots</h1>
		</div>
		<button
			on:click={() => goto('/account/chatbots/create')}
			class="btn btn-primary"
			disabled={data.user.user.status !== 'active' || botUsage >= 1}
			>Create <Icon icon="mdi:plus-box" class="ml-2" height="20" /></button
		>
	</div>

	<div class="card card-compact card-bordered border-neutral mb-4">
		<div class="card-body">
			<div class="flex gap-8 items-center">
				<div class="grid md:grid-cols-3 gap-2 md:gap-8 items-center w-full">
					<div>
						<div class="flex justify-between">
							<h4>Messages</h4>
							<span class="opacity-60"
								>{data.subscription.msg_count}/{data.subscription.max_msg}</span
							>
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
							<span class="opacity-60">{data.bots.length}/{data.subscription.max_bot}</span>
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
							<h4>Usage Reset Date</h4>
							<span class="opacity-60">{resetDate.toLocaleDateString()}</span>
						</div>
						<progress
							class="progress progress-secondary w-full bg-neutral h-1"
							value={31 - daysLeftUntilAllotmentsReset}
							max={31}
						/>
					</div>
				</div>
				{#if botUsage >= 1 || msgUsage > 0.75 || data.subscription.cancel_at}
					<a href="/account/settings/plan" class="btn btn-warning">Upgrade</a>
				{/if}
			</div>
		</div>
	</div>
	{#if data.user.user.status !== 'active'}
		<div class="alert alert-warning max-w-3xl mx-auto my-10">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				class="stroke-current flex-shrink-0 w-6 h-6"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/></svg
			>
			<span
				>You need to verify your email address before you can create a chatbot.<br />Please check
				your email for the verification link.</span
			>
		</div>
	{/if}
	{#if data.bots.length > 0}
		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
			{#each data.bots as bot}
				{@const usage = Math.ceil((bot.tocken_count / data.subscription.max_tocken) * 100)}
				<a
					href="chatbots/{bot.id}"
					class="card bg-neutral peer-checked:ring-2 hover:outline-primary hover:outline"
				>
					<div class="card-body p-6">
						<div class="">
							<h2 class="card-title">
								<a href="chatbots/{bot.id}" class="text-primary text-base truncate" title={bot.name}
									>{bot.name}</a
								>
							</h2>
						</div>
						<h3 class="text-sm">{bot.created.toLocaleString()}</h3>

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
							<div class="dropdown dropdown-left dropdown-start z-10">
								<label tabindex="0" class="btn btn-ghost btn-square" on:click|preventDefault
									><Icon icon="tabler:dots" height="24" /></label
								>
								<ul
									tabindex="0"
									class="dropdown-content menu p-2 shadow bg-base-100 rounded-box z-10x"
								>
									<li>
										<a href="/account/chatbots/{bot.id}/share">
											<Icon icon="mdi:code" width="18" /> Share
										</a>
									</li>
									<li>
										<a href="/account/chatbots/{bot.id}/integrations">
											<Icon icon="mdi:transit-connection-variant" width="18" /> Integrations
										</a>
									</li>
									<li>
										<a href="/account/chatbots/{bot.id}/data">
											<Icon icon="mdi:database" width="18" /> Data
										</a>
									</li>
									<li>
										<a href="/account/chatbots/{bot.id}/settings">
											<Icon icon="mdi:settings" width="18" /> Settings
										</a>
									</li>
									<li>
										<a
											href="/"
											on:click|preventDefault={() => {
												idOfModelToDelete = bot.id;
												titleOfModelToDelete = bot.name;
												modalDelete.showModal();
											}}
										>
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
	{:else}
		<div class="card max-w-xl mx-auto bg-neutral text-neutral-content">
			<div class="card-body items-center text-center">
				<h2 class="card-title">Welcome!</h2>
				You don't have any chatbots yet.
				<div class="card-actions mt-10">
					<button
						on:click={() => goto('/account/chatbots/create')}
						class="btn btn-primary"
						disabled={data.user.user.status !== 'active'}>Create a chatbot</button
					>
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
				Delete</button
			>
		</div>
	</div>
</dialog>
