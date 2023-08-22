<script lang="ts">
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	import { currentBot, state, alert } from '$lib/stores';

	export let data: LayoutData;

	currentBot.set(data.model);

	$: currentPath = $page.url.pathname.split('/').slice(-2);

	$: console.log(currentPath);

	const savedName = $currentBot.name;

	$: $currentBot.name !== savedName ? ($state = 'unsaved') : ($state = 'saved');
</script>

<div class="bg-neutral">
	<div class="container md:gap-2 flex flex-col md:flex-row justify-between items-center">
		<div class="flex gap-2 items-center">
			<a class="btn btn-sm btn-square text-white/50 hidden sm:flex" href="/account/chatbots"
				>&larr;</a
			>
			<input
				class="input bg-black/10 border-none rounded-none input-ghost whitespace-nowrap p-1 px-4"
				bind:value={$currentBot.name}
			/>
			<!-- {#if $state == 'unsaved'}
				<button class="btn btn-xs btn-success btn-square btn-outline" on:click={handleNameSave}
					><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
						><path
							fill="currentColor"
							d="m10.586 13.414l-2.829-2.828L6.343 12l4.243 4.243l7.07-7.071l-1.413-1.415l-5.657 5.657Z"
						/></svg
					></button
				>
				<button
					class="btn btn-xs btn-error btn-square btn-outline"
					on:click={() => ($currentBot.name = savedName)}
					><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
						><path
							fill="currentColor"
							d="m16.192 6.344l-4.243 4.242l-4.242-4.242l-1.414 1.414L10.535 12l-4.242 4.242l1.414 1.414l4.242-4.242l4.243 4.242l1.414-1.414L13.364 12l4.242-4.242z"
						/></svg
					></button
				>
			{/if} -->
		</div>
		<div class="tabs tabs-boxed bg-neutral">
			<a
				href="/account/chatbots/{$page.params.id}/"
				class="tab"
				class:tab-active={currentPath[1] === $page.params.id}>Chat</a
			>
			<a
				href="/account/chatbots/{$page.params.id}/share"
				class="tab"
				class:tab-active={currentPath[1] === 'share'}>Share</a
			>
			<a
				href="/account/chatbots/{$page.params.id}/integrations"
				class="tab"
				class:tab-active={currentPath[1] === 'integrations'}>Integrations</a
			>
			<a
				href="/account/chatbots/{$page.params.id}/data"
				class="tab"
				class:tab-active={currentPath[1] === 'data'}>Data</a
			>
			<a
				href="/account/chatbots/{$page.params.id}/history"
				class="tab"
				class:tab-active={currentPath[1] === 'history'}>History</a
			>
			<a
				href="/account/chatbots/{$page.params.id}/settings"
				class="tab"
				class:tab-active={currentPath[0] === 'settings'}>Settings</a
			>
		</div>
	</div>
</div>

<slot />
