<script lang="ts">
	import supabase from '$lib/supabaseClient';
	import Icon from '@iconify/svelte';

	export let id: string;
	export let status: 'training' | 'ready' | 'failed' = 'ready';

	let icon: string;
	let alertClass: string;
	let trainingMessage: string;
	let statusMessageElement: HTMLElement;

	const close = () => {
		// supabase.removeChannel('bot_status');
		// setTimeout(() => {
		//   statusMessageElement.classList.add('closed');
		// }, 3000);
	};

	supabase
		.channel(`bot_status`)
		.on(
			'postgres_changes',
			{
				event: 'UPDATE',
				schema: 'public',
				table: 'bots',
				filter: `id=eq.${id}`
			},
			(payload) => {
				console.log('Change received!', payload);
				status = 'ready';
				supabase.removeChannel('bot_status');
			}
		)
		.subscribe();

	$: switch (status) {
		case 'training':
			trainingMessage =
				'Training your chatbot... answers will be partially incorrect until complete';
			icon = 'line-md:uploading-loop';
			alertClass = 'alert-warning';
			break;
		case 'ready':
			trainingMessage = 'Your chatbot is ready!';
			icon = 'line-md:confirm-circle-twotone';
			alertClass = 'alert-success';
			close();
			break;
		case 'failed':
			trainingMessage = 'Something went wrong. Please try again.';
			icon = 'line-md:alert';
			alertClass = 'alert-error';
			break;
	}
</script>

{#if status != 'ready'}
	<div class="flex flex-start mb-2" bind:this={statusMessageElement}>
		<div class="alert pr-8 w-auto {alertClass} flex justify-start self-start">
			<Icon {icon} width="24" />
			{trainingMessage}
		</div>
	</div>
{/if}
