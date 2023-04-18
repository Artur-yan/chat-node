<script lang="ts">
	import Icon from '@iconify/svelte';

	
	let icon: string;
	let alertClass: string;
	let trainingMessage: string;
	
	export let trainingStatus: null | "training" | "done" | "error" = null

	$: switch (trainingStatus) {
		case "training":
			trainingMessage = "Training your chatbot...";
			icon = "line-md:uploading-loop";
			alertClass = "alert-info"
			break;
		case "done":
			trainingMessage = "Your chatbot is ready!";
			icon = 'line-md:confirm-circle-twotone'
			alertClass = 'alert-success'
			break;
		case "error":
			trainingMessage = "Something went wrong. Please try again.";
			icon = 'line-md:alert'
			alertClass = 'alert-error'
			break;
	}


</script>


{#if trainingStatus != null}
	<div class="toast toast-start items-center gap-2">
		<div class="alert {alertClass}">
			<Icon icon={icon} width="24" />
			{trainingMessage}
		</div>
	</div>
{/if}
