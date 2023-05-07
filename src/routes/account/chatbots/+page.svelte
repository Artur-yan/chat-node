<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';

	export let data;

	let msgUsage: number = data.subscription.msg_count / data.subscription.max_msg;
	let botUsage: number = data.subscription.bot_count / data.subscription.max_bot;
</script>

<div class="container pb-20">
	<div class="flex justify-between my-2 items-center">
		<div>
			<h1 class="text-xl font-bold text-secondary">Chatbots</h1>
		</div>
		{#if botUsage < 1}
			<button
				on:click={() => goto('/account/chatbots/create')}
				class="btn btn-primary"
				disabled={data.user.user.status !== 'active'}
				>Create <Icon icon="mdi:plus-box" class="ml-2" height="20" /></button
			>
		{/if}
	</div>

	<div class="card card-compact card-bordered border-neutral mb-4">
		<div class="card-body">
			<div class="flex justify-between items-center gap-2">
				<h4>Messages</h4>
				<span class="opacity-60">{data.subscription.msg_count}/{data.subscription.max_msg}</span>
				<progress
					class="progress progress-secondary w-full bg-neutral"
					class:progress-error={msgUsage > 0.9}
					value={data.subscription.msg_count}
					max={data.subscription.max_msg}
				/>
				<div class="w-16" />
				<h4>Bots</h4>
				<span class="opacity-60">{data.subscription.bot_count}/{data.subscription.max_bot}</span>
				<progress
					class="progress progress-secondary w-full bg-neutral"
					class:progress-error={botUsage > 0.8}
					value={data.subscription.bot_count}
					max={data.subscription.max_bot}
				/>
				<div class="w-16" />
				{#if botUsage >= 1 || msgUsage > 0.75}
					<a href="/account/settings/plan" class="btn btn-warning">Upgrade</a>
				{/if}
			</div>
		</div>
	</div>
	{#if data.user.user.status !== 'active'}
		<div class="alert alert-info shadow-lg max-w-3xl mx-auto my-10">
			<div>
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
		</div>
	{/if}
	{#if data.bots.length > 0}
		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each data.bots as bot}
				{@const usage = Math.floor((bot.tocken_count / data.subscription.max_tocken) * 100)}
				<div class="bot-{bot.id} card shadow-xl bg-neutral peer-checked:ring-2">
					<div class="card-body">
						<h2 class="card-title">
							<a href="chatbots/{bot.id}" class="text-primary">{bot.name}</a>
						</h2>
						<p class="flex justify-between">
							created <span class="badge badge-secondary badge-outline"
								>{bot.created.toLocaleString()}</span
							>
						</p>
						<p class="flex justify-between">
							id <span class="badge badge-outline">{bot.id}</span>
						</p>
						<div class="flex justify-between">
							<span>training capacity</span>
							<div>
								<span class="text-xs mr-2">{usage}%</span>
								<span
									class="radial-progress bg-base-100 text-primary border-2 border-base-100"
									style="--value:{usage}; --size: 1.5rem; --thickness: 4px;"
								/>
							</div>
						</div>

						<div class="card-actions justify-between items-center mt-10">
							<a class="btn btn-outline btn-sm btn-primary" href="chatbots/{bot.id}">
								<Icon icon="mdi:chat-outline" class="mr-2" width="20" /> Chat
							</a>
							<div class="btn-group bg-base-100 rounded-lg">
								<div class="tooltip tooltip-error" data-tip="Delete" />
								<div class="tooltip tooltip-info" data-tip="Get embed code">
									<a class="btn btn-ghost" href="/account/chatbots/{bot.id}/embed">
										<Icon icon="mdi:code" width="18" />
									</a>
								</div>
								<div class="tooltip tooltip-secondary" data-tip="Data sources">
									<a class="btn btn-ghost" href="/account/chatbots/{bot.id}/data">
										<Icon icon="mdi:database" width="18" />
									</a>
								</div>
								<div class="tooltip tooltip-secondary" data-tip="Edit settings">
									<a class="btn btn-ghost" href="/account/chatbots/{bot.id}/settings">
										<Icon icon="mdi:settings" width="18" />
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
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
