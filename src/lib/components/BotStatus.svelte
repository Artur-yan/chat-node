<script lang="ts">
	import Icon from '@iconify/svelte';

	export let id: string;
	export let trainingStatus: undefined | 'training' | 'complete' | 'ready' | 'failed' = 'ready';

	let icon: string;
	let alertClass: string;
	let trainingMessage: string;
	let statusMessageElement: HTMLElement;

  const listenForTrainingStatus = async () => {
    setTimeout(async () => {
      try {
        const res = await fetch('/api/models/training-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({id})
        });
        const { status } = await res.json();

        if (status === 'training') {
          listenForTrainingStatus();
        } else if(status == 'ready') {
          trainingStatus = 'complete';
        } else {
          trainingStatus = status;
        }
      } catch (err) {
        console.error(err);
      }
    }, 1000);
  }

  $: if (trainingStatus !== 'ready') {
    listenForTrainingStatus()
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
			icon = 'line-md:uploading-loop';
			alertClass = 'alert-warning';
			break;
		case 'complete':
			trainingMessage = 'Your chatbot is ready!';
			icon = 'line-md:confirm-circle-twotone';
			alertClass = 'alert-success';
			break;
		case 'failed':
			trainingMessage = 'Something went wrong. Please try again.';
			icon = 'line-md:alert';
			alertClass = 'alert-error';
			break;
	}
</script> 


{#if trainingStatus !== 'ready'}
	<div class="flex flex-start mb-2" bind:this={statusMessageElement}>
		<div class="alert pr-8 w-auto {alertClass} flex justify-start self-start">
			<Icon {icon} width="24" />
			{trainingMessage}
		</div>
	</div>
{/if}
