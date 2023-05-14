<script lang="ts">
	import supabase from '$lib/supabaseClient';
	import Icon from '@iconify/svelte';

	export let id: string;
	export let trainingStatus: 'training' | 'ready' | 'failed' | 'not started' | undefined =
		undefined;

	let icon: string;
	let alertClass: string;
	let trainingMessage: string;
	let statusMessageElement: HTMLElement;

	$: {
		if (id) {
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
						trainingStatus = 'ready';
						supabase.removeChannel('bot_status');
					}
				)
				.subscribe();
		}
	}

	$: switch (trainingStatus) {
		case 'not started':
			trainingMessage = 'Add some data to start chatting with your bot';
			icon = '';
			alertClass = 'alert-info';
			break;
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
			// close();
			break;
		case 'failed':
			trainingMessage = 'Something went wrong. Please try again.';
			icon = 'line-md:alert';
			alertClass = 'alert-error';
			break;
	}
</script>

{#if trainingStatus !== undefined}
	<div class="flex flex-start mb-2" bind:this={statusMessageElement}>
		<div class="alert pr-8 w-auto {alertClass} flex justify-start self-start">
			<Icon {icon} width="24" />
			{trainingMessage}
		</div>
	</div>
{/if}
