<script lang="ts">
	import Icon from '@iconify/svelte';

	export let data;


	let msgUsage: number = data.subscription.msg_count / data.subscription.max_msg;
	let botUsage: number = data.subscription.bot_count / data.subscription.max_bot;

</script>

<div class="container">
	<div class="flex justify-between my-2 items-center">
		<div>
			<h1 class="text-xl font-bold text-secondary">Chatbots</h1>
		</div>
		{#if botUsage < 1}
			<a href="/account/chatbots/create" class="btn btn-primary">Create <Icon icon="mdi:plus-box" class="ml-2" height="20" /></a>
		{/if}
	</div>

	<div class="card card-compact card-bordered border-neutral mb-4">
		<div class="card-body ">			
			<div class="flex justify-between gap-10">
				<h3 class="card-title text-base">Usage</h3>
				<div class="w-full">
					<h4>Messages <span class="opacity-60">({data.subscription.msg_count}/{data.subscription.max_msg})</span></h4>
					<progress class="progress progress-secondary" class:progress-error={msgUsage > .9} value={data.subscription.msg_count} max={data.subscription.max_msg}></progress>
				</div>
				<div class="w-full">
					<h4>Bots <span class="opacity-60">({data.subscription.bot_count}/{data.subscription.max_bot})</span></h4>

					<progress class="progress progress-secondary" class:progress-error={botUsage > .8} value={data.subscription.bot_count} max={data.subscription.max_bot}></progress>
				</div>
				{#if botUsage >= 1 || msgUsage > .75}
					<a href="/account/settings/plan" class="btn btn-warning">Upgrade</a>
				{/if}
			</div>
		</div>
	</div>

	<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#if data.bots.length > 0}
			{#each data.bots as bot}
					<div class="bot-{bot.id} card shadow-xl bg-neutral peer-checked:ring-2">
						<div class="card-body">
							<h2 class="card-title">
								<a href="chatbots/{bot.id}" class="text-primary">{bot.name}</a>
							</h2>
							<p class="flex justify-between">
								created <span class="badge badge-secondary badge-outline"
									>{bot.created.toLocaleString('en-us')}</span
								>
							</p>
							<p class="flex justify-between">
								type <span class="badge badge-secondary">{bot.data_source_type}</span>
							</p>
							<p class="flex justify-between">
								id <span class="badge badge-outline">{bot.id}</span>
							</p>

							<div class="card-actions justify-between items-center mt-10">
								<a class="btn btn-outline btn-sm btn-primary" href="chatbots/{bot.id}">
									<Icon icon="mdi:chat-outline" class="mr-2" width="20" /> Chat
								</a>
								<div class="btn-group bg-base-100 rounded-lg">
									<div class="tooltip tooltip-error" data-tip="Delete">
									</div>
									<div class="tooltip tooltip-info" data-tip="Get embed code">
									<a
										class="btn btn-ghost"
										href="/account/chatbots/{bot.id}/embed"
									>
										<Icon icon="mdi:code" width="18" />
									</a>
									</div>
									<div class="tooltip tooltip-secondary" data-tip="Edit settings">
										<a
											class="btn btn-ghost"
											href="/account/chatbots/{bot.id}/settings"
										>
											<Icon icon="mdi:settings" width="18" />
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
			{/each}
		{:else}
			<div>
				You haven't created any chatbots yet. <a href="/account/chatbots/create">Create one now.</a>
			</div>
		{/if}
	</div>
</div>