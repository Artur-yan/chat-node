<script lang="ts">
  import { currentBot, alert } from '$lib/stores.js';
	import Instructions from '../Instructions.svelte';
	import Instructions2 from '../Instructions2.svelte';
  
  // state
	let isModalOpen = false;
  let activeTab: 'upload' | 'trained' = 'upload';
  let isUploading = false;
  let hasQueuedFiles = false;
  let counter: number;
  let intervalId: any;
  let timeoutId: any;

  // values
  let acceptableFileExtensions = ['pdf', 'txt', 'doc', 'docx', 'csv', 'xlsx', 'md', 'rtf', 'tsv', 'pptx', 'json'];

  // files
  let filesToUpload: any = [];
  let filesTrained: any = [];

  // conditions
  $: if(isModalOpen === true) {
   
  }

  $: if (filesTrained.length === 0) {
    hasQueuedFiles = false;
  }

  async function fetchOAuthUrl() {
    try {
      const response = await fetch('/api/data-sources/generate-oauth-link', {
        method: 'POST',
        body: JSON.stringify({
          botId: $currentBot.id,
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
    const data = await fetchOAuthUrl();
    const notionUrl = data.oauth_url;
    window.open(notionUrl, '_blank');
  }

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
                    on:click={() => activeTab = 'upload'}
                    class:tab-active={activeTab === 'upload'}
                  >
                    Upload
                  </button>
      
                  <button
                  class="tab"
                  on:click={() => activeTab = 'trained'}
                  class:tab-active={activeTab === 'trained'}
                >
                  Trained <span class=""></span>
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
    {#if hasQueuedFiles && activeTab === 'trained'}
      <span class="text-slate-400 mx-8">Refreshing in <span class="font-bold text-primary">{counter}</span> seconds</span>
    {/if}
    
    <section class="w-full h-5/6 rounded-xl my-4">
     
<div class="rounded-lg border-1 border-slate-900 bg-slate-700 text-card-foreground shadow-sm">
  <div class="flex flex-col space-y-1.5 p-6">
    <h3 class="text-2xl text-secondary font-semibold whitespace-nowrap leading-none tracking-tight">Connect Your Notion Account</h3>
    <div class="py-2">
      <button 
        class="inline-flex gap-2 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-black hover:bg-primary/90 h-10 px-4 py-2"
        on:click={connectToNotion}
        >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cable"><path d="M4 9a2 2 0 0 1-2-2V5h6v2a2 2 0 0 1-2 2Z"/><path d="M3 5V3"/><path d="M7 5V3"/><path d="M19 15V6.5a3.5 3.5 0 0 0-7 0v11a3.5 3.5 0 0 1-7 0V9"/><path d="M17 21v-2"/><path d="M21 21v-2"/><path d="M22 19h-6v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2Z"/></svg>
        Connect
    </button>
  </div>
</div>
<div class="mx-auto">
  <Instructions/>
</div>
</div>
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