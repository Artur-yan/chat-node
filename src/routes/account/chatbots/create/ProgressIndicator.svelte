<script>
	import Icon from '@iconify/svelte';

	export let step = 1;

	let steps = [
		{
			title: 'Train',
			icon: 'mdi:gym'
		},
		{
			title: 'Customize',
			icon: 'mdi:tune'
		},
		{
			title: 'Deploy',
			icon: 'mdi:rocket-launch-outline'
		}
	];
</script>

<ol class="flex items-center">
	{#each steps as { title, icon }, i}
		<li class="h-[1px] bg-primary-800 w-full" />
		<li>
			<div class="flex items-center gap-2 px-4 text-sm">
				{#if step <= i}
					<Icon {icon} height={20} />
				{:else}
					<Icon icon="line-md:confirm-circle-twotone" height={20} />
				{/if}
				<h3>{title}</h3>
			</div>
		</li>
		<li class="h-[1px] bg-primary-800 w-full" />
	{/each}
</ol>
