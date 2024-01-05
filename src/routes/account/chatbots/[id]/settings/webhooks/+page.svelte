<script lang="ts">
  import { currentBot } from "$lib/stores";
  import { createWebhook } from '$lib/webhooks';
  import Webhook from '$lib/components/Webhook.svelte';

  export let data;

  export let webhooks = data.webhooks;
</script>

<div class="card bg-neutral card-compact mb-4">
	<div class="card-body">
		<div class="card-title">
			<h2>Webhooks</h2>
		</div>
    <div class="badge badge-primary badge-outline">LEADS</div>

    <div class="overflow-x-auto">
      <table class="table">
        <!-- head -->
        <thead>
          <tr>
            <th>Type</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          <!-- row 1 -->
          {#each webhooks as webhook}
            <Webhook webhookData={webhook} />
          {/each}
        </tbody>
      </table>
      <!-- End -->
      <button 
        on:click={() => createWebhook($currentBot.id)}
        class="btn btn-sm my-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>  
        Add Webhook      
      </button>
    </div>
	</div>
</div>

