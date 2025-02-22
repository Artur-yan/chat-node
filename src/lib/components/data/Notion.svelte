<script lang="ts">
  import { currentBot, alert } from '$lib/stores.js';
	import { onMount } from 'svelte';
	import NotionInstructions from './NotionInstructions.svelte';

  export let totalFileCount: number;
  
  // state
	let isModalOpen = false;
  let activeTab: 'instructions' | 'trained' = 'instructions';
  let isRedirecting = false;
  let isFetching = false;
  let hasQueuedFiles = false;
  let counter: number;
  let intervalId: any;
  let timeoutId: any;

  // files
  let filesTrained: any = [];

  // conditions
  $: if(isModalOpen === true) {
    activeTab = 'instructions';
    fetchUserData();
        //@ts-ignore
    (async () => {
      totalFileCount = await fetchTotalFileCount() || 0;
    })();
  }

  $: if (filesTrained.length === 0) {
    hasQueuedFiles = false;
  }

  async function fetchTotalFileCount() {
    try {
      const response = await fetch('/api/data-sources/total-file-count', {
        method: 'POST',
        body: JSON.stringify({
          customerId: $currentBot.id,
        })
      });

      const data = await response.json();

      if (response?.status === 200) {
        return data?.count || 0
      } else {
        console.error('Error:', response.error);
      }
    } catch (err) {
      console.error('Unexpected error:', (err as Error).message);
    }
  }

  async function fetchUserData() {
    try {
      const response = await fetch('/api/data-sources/user-files', {
        method: 'POST',
        body: JSON.stringify({
          customerId: $currentBot.id,
          fileTypes: ["NOTION"],
          limit: 250,
          offset: 0
        })
      });

      const data = await response.json();

      if (response?.status === 200) {
        filesTrained = data?.results || [];
        console.log('Files trained:', filesTrained);

        // Retry
        hasQueuedFiles = filesTrained.some((file: any) => file.sync_status === 'QUEUED_FOR_OCR' || file.sync_status === 'QUEUED_FOR_SYNC' || file.sync_status === 'SYNCING' || file.sync_status === 'DELAYED');
        console.log('Has queued files & will be attempted again --->', hasQueuedFiles);

        if (hasQueuedFiles && isModalOpen) {
          countdownFrom40();
          if(timeoutId) clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            fetchUserData();
          }, 40000);
        }

      return data;

      } else {
        console.error('Error:', response.error);
      }
    } catch (err) {
      console.error('Unexpected error:', (err as Error).message);
    }
  }

  async function fetchOAuthUrl() {
    try {
      const response = await fetch('/api/data-sources/generate-oauth-link', {
        method: 'POST',
        body: JSON.stringify({
          botId: $currentBot.id,
          service: 'NOTION',
          chunkSize: `${$currentBot.settings.dataFunnelSettings?.files?.chunkSize ?? 400}`,
          chunkOverlap: `${$currentBot.settings.dataFunnelSettings?.files?.chunkOverlap ?? 20}`
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        console.log('data:', data);
        return data;
      } else {
        alert.set({ message: data.error, type: 'error' });
      }
    } catch (err) {
      alert.set({ message: (err as Error).message, type: 'error' });
    }
  }

  async function connectToNotion() {
    isRedirecting = true;
    const data = await fetchOAuthUrl();
    const notionUrl = data.oauth_url;
    isRedirecting = false;
    window.open(notionUrl, '_blank');
  }

  async function removeFile(fileId: string) {
    try {
      const response = await fetch(`/api/data-sources/delete-file`, {
        method: 'POST',
        body: JSON.stringify({
          customerId: $currentBot.id,
          fileId
        })
      });

      console.log('Response:', response);

      const data = await response.json();

      if (response.status === 200) {
        console.log('File successfully deleted:', data );
        totalFileCount -= 1;
      } else {
        console.error('Error:', response.error);
      }
    } catch (err) {
      console.error('Unexpected error during file deletion:', (err as Error).message);
    }
  }

  function countdownFrom40() {
    counter = 40;
    if(intervalId) clearInterval(intervalId);
    intervalId = setInterval(() => {
      if (counter <= 0) {
        clearInterval(intervalId);
      } else {
        counter--;
      }
    }, 1000);
  }

  async function onTabFocus() {
    if (document.visibilityState === 'visible') {
      await fetchUserData();
      totalFileCount = await fetchTotalFileCount() || 0;
    }
  }

  onMount(async () => {
    document.addEventListener('visibilitychange', onTabFocus);

    return () => {
      document.removeEventListener('visibilitychange', onTabFocus);
    };
  });
</script>

<label for="notion" class="btn bg-gradient-to-r from-slate-400 to-slate-500 hover:bg-slate-700 w-full h-full modal-button shadow-lg shadow-zinc-400 hover:shadow-lg hover:shadow-stone-200 hover:-mt-1 border-1 border-slate-600"> 
  <div class="bg-gradient-to-tr from-slate-300 to-slate-500 text-transparent bg-clip-text text-xl">
    <img src="/notion.png" class="w-40 -m-8 mx-auto my-auto" alt="">
  </div>
</label>

<input type="checkbox" id="notion" class="modal-toggle" bind:checked={isModalOpen}>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="modal" on:click|self={()=>isModalOpen = false}>
  <div class="modal-box w-11/12 max-w-7xl h-screen bg-gradient-to-tr from-slate-500 to-slate-700 shadow-xl shadow-zinc-400 grow-button raise-button">
    <div class="flex items-center justify-between mx-8">
      <div class="flex">
        <h3 class="py-1 font-bold text-3xl rounded-xl text-zinc-400">Notion</h3>
      </div>

            <!-- tabs -->
            <div class="flex">
              <div class="tabs tabs-boxed gap-2">
                  <button
                    class="tab"
                    on:click={() => activeTab = 'instructions'}
                    class:tab-active={activeTab === 'instructions'}
                  >
                    Instructions
                  </button>
      
                  <button
                  class="tab"
                  on:click={() => activeTab = 'trained'}
                  class:tab-active={activeTab === 'trained'}
                >
                  Trained<span class="{totalFileCount < ($currentBot.settings.dataFunnelSettings?.files?.maxFiles ?? 30) || totalFileCount === undefined ? 'mx-1' : 'text-red-500 mx-1'}">({totalFileCount}/{$currentBot.settings.dataFunnelSettings?.files?.maxFiles ?? 30} Total Files)</span>
                </button>
              </div>
            </div>
      <div class="modal-action my-auto">
        <form method="dialog">
          <button class="btn btn-secondary btn-sm my-auto" on:click|self={()=>isModalOpen = false}>
            Close
            <svg on:click|self={()=>isModalOpen = false} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>  
          </button>
        </form>
      </div>
    </div>

    <!-- {#if hasQueuedFiles && activeTab === 'trained'}
      <span class="text-slate-400 mx-8">Refreshing in <span class="font-bold text-primary">{counter}</span> seconds</span>
    {/if} -->

    {#if hasQueuedFiles && activeTab === 'trained'}
      <div class="flex justify-start items-center gap-2 ml-4 my-4">
        <button 
          class="btn btn-sm btn-active btn-primary w-32 min-w-32 h-8"
          on:click={async () => {
            isFetching = true;
            await fetchUserData();
            isFetching = false;
            if(timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
              fetchUserData();
            }, 40000);
          }}
        >
        {#if isFetching}
          <span class="loading loading-spinner loading-sm"></span>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Refresh
        {/if}
        </button>
        <span class="text-slate-400">Refreshing in <span class="font-bold text-primary">{counter}</span> seconds</span>
      </div>
    {/if}

<section class="w-full h-5/6 rounded-xl my-4">
  {#if activeTab === 'instructions'}
    <div class="rounded-lg border-1 border-slate-900 bg-slate-700 text-card-foreground shadow-sm">
      <div class="flex flex-col space-y-1.5 p-6">
        <h3 class="text-2xl text-secondary font-semibold whitespace-nowrap leading-none tracking-tight">Connect Your Notion Account</h3>
        <div class="py-2">
          <button 
            class="inline-flex gap-2 w-28 min-w-28 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-black hover:bg-primary/90 h-10 px-4 py-2"
            on:click={connectToNotion}
          >
            {#if isRedirecting}
              <span class="loading loading-spinner loading-md"></span>
            {:else }
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cable"><path d="M4 9a2 2 0 0 1-2-2V5h6v2a2 2 0 0 1-2 2Z"/><path d="M3 5V3"/><path d="M7 5V3"/><path d="M19 15V6.5a3.5 3.5 0 0 0-7 0v11a3.5 3.5 0 0 1-7 0V9"/><path d="M17 21v-2"/><path d="M21 21v-2"/><path d="M22 19h-6v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2Z"/></svg>
              Connect
            {/if}
         </button>
        </div>
      </div>
      <div class="mx-auto">
        <NotionInstructions/>
      </div>
    </div>
  {/if}
  <!-- Trained -->
  {#if activeTab === 'trained'}
  <div class="w-full h-full px-7 pt-8 overflow-y-auto bg-slate-900 bg-opacity-60 rounded-xl">
    <table class="table table-xs">
      <thead>
        <tr class="text-md font-bold text-secondary">
          <th>No.</th>
          <th>Title</th>
          <th>Status</th>
          <th>Id</th>
        </tr>
      </thead>
      <tbody>
        {#each filesTrained as file, i}
        <tr id={file.id} class="p-.05">
          <td class="text-primary"> {i + 1} </td>
          <td class="text-primary w-1/2 /overflow-x-auto"> {file.name} </td>
          {#if file.sync_status === 'READY'}
            <td class="text-primary">
              <div class="badge badge-success badge-outline w-20">
                Ready
              </div>
            </td>
          {:else if file.sync_status === 'QUEUED_FOR_SYNC'}
            <td class="text-primary">
              <div class="badge badge-warning badge-outline w-20">
                Queued
              </div>
            </td>
          {:else if file.sync_status === 'SYNCING'}
            <td class="text-primary">
              <div class="badge badge-warning badge-outline w-20">
                Syncing
              </div>
            </td>
          {:else if file.sync_status === 'QUEUED_FOR_OCR'}
            <td class="text-primary">
              <div class="badge badge-warning badge-outline w-20">
                Queued
              </div>
            </td>
          {:else if file.sync_status === 'DELAYED'}
            <td class="text-primary">
              <div class="badge badge-warning badge-outline w-20">
                Delayed
              </div>
            </td>
          {:else if file.sync_status === 'SYNC_ERROR'}
            <td class="text-primary">
              <div class="badge badge-error badge-outline w-20">
                Error
              </div>
            </td>
          {/if}
          <td class="text-primary"> {file.id} </td>
          <td>
            <button 
              class="btn btn-secondary btn-sm" 
              on:click={() => {
                removeFile(file.id);
                //@ts-ignore
                filesTrained = filesTrained.filter((item) => item.id !== file.id);
              }
            }
            >
              Remove
            </button>
          </td>
        </tr>
      {/each}
      </tbody>
    </table>
   </div>
      {/if}
</section>
</div>
</div>

<style>
  .grow-button { 
      transition: all .2s ease-in-out; 
    }

  .grow-button:hover { 
    transform: scale(1.1); 
  }
</style>