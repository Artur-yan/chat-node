<script lang="ts">
	import { PUBLIC_SITE_URL } from '$env/static/public';
	import { invalidateAll } from '$app/navigation';

	export let id: string;
	export let trainingStatus: undefined | 'training' | 'complete' | 'ready' | 'failed' = 'ready';

	let icon: string;
	let alertClass: string;
	let trainingMessage: string;
	let statusMessageElement: HTMLElement;

	$: if (trainingStatus === 'training') {
		let listenForTrainingStatus = setInterval(async () => {
			try {
				const res = await fetch(PUBLIC_SITE_URL + '/api/models/training-status', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ id })
				});
				const { status } = await res.json();
				trainingStatus = status || 'training';

				if (status == 'ready') {
					trainingStatus = 'complete';
					clearInterval(listenForTrainingStatus);
				}
			} catch (err) {
				console.error(err);
			}
		}, 2500);
	}

	$: switch (trainingStatus) {
		case undefined:
			trainingMessage = 'Add some data to start chatting with your bot';
			icon = '';
			alertClass = 'alert-info';
			break;
		case 'training':
			trainingMessage =
				'Training your chatbot... answers will be partially incorrect until complete';
			icon =
				'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"><path stroke-dasharray="2 4" stroke-dashoffset="6" d="M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3"><animate attributeName="stroke-dashoffset" dur="0.6s" repeatCount="indefinite" values="6;0"/></path><path stroke-dasharray="30" stroke-dashoffset="30" d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.1s" dur="0.3s" values="30;0"/></path><path stroke-dasharray="10" stroke-dashoffset="10" d="M12 16v-7.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="10;0"/></path><path stroke-dasharray="6" stroke-dashoffset="6" d="M12 8.5l3.5 3.5M12 8.5l-3.5 3.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" values="6;0"/></path></g></svg>';
			alertClass = 'alert-warning';
			break;
		case 'complete':
			trainingMessage = 'Your chatbot is ready!';
			icon =
				'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path fill="currentColor" fill-opacity="0" stroke-dasharray="60" stroke-dashoffset="60" d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="60;0"/><animate fill="freeze" attributeName="fill-opacity" begin="0.8s" dur="0.15s" values="0;0.3"/></path><path fill="none" stroke-dasharray="14" stroke-dashoffset="14" d="M8 12L11 15L16 10"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="14;0"/></path></g></svg>';
			alertClass = 'alert-success';
			break;
		case 'failed':
			trainingMessage = 'Something went wrong. Please try again.';
			icon =
				'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="60" stroke-dashoffset="60" d="M12 3L21 20H3L12 3Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="60;0"/></path><path stroke-dasharray="6" stroke-dashoffset="6" d="M12 10V14"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="6;0"/></path></g><circle cx="12" cy="17" r="1" fill="currentColor" fill-opacity="0"><animate fill="freeze" attributeName="fill-opacity" begin="0.8s" dur="0.4s" values="0;1"/></circle></svg>';
			alertClass = 'alert-error';
			break;
	}
</script>

{#if trainingStatus !== 'ready'}
	<div class="flex flex-start m-4 mr-10" bind:this={statusMessageElement}>
		<div class="alert pr-6 p-2 w-auto uppercase text-xs font-bold {alertClass} flex justify-start self-start gap-2">
			<div>{@html icon}</div>
			{trainingMessage}
		</div>
	</div>
{/if}
