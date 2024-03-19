<script lang="ts">
  import { currentBot, alert } from '$lib/stores.js';
  
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


</script>

<label for="notion" class="btn bg-gradient-to-r from-slate-800 to-slate-900 hover:bg-slate-700 w-full h-full modal-button shadow-lg shadow-zinc-400 hover:shadow-lg hover:shadow-stone-200 hover:-mt-1"> 
  <div class="bg-gradient-to-tr from-slate-300 to-slate-500 text-transparent bg-clip-text text-xl">
    <!-- <img src="/notion.png" class="max-w-full max-h-full object-contain" alt=""> -->
    Notion
  </div>
</label>

<input type="checkbox" id="notion" class="modal-toggle" bind:checked={isModalOpen}>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="modal" on:click|self={()=>isModalOpen = false}>
  <div class="modal-box w-11/12 max-w-7xl h-screen bg-gradient-to-tr from-slate-500 to-slate-700 shadow-xl shadow-zinc-400 grow-button raise-button">
    <div class="flex items-center justify-between mx-8">
      <div class="flex">
        <h3 class="py-1 font-bold text-3xl rounded-xl text-zinc-400">Files</h3>
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
      <!-- Content -->

      <!-- Upload -->
      {#if activeTab === 'upload'}
       
      <button 
        class="btn btn-primary"
        on:click={() => {
          fetchOAuthUrl('NOTION');
        }}
      >
        Connect to Notion
      </button>
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
                {:else if file.sync_status === 'QUEUED_FOR_SYNC' || file.sync_status === 'QUEUED_FOR_OCR' || file.sync_status === 'SYNCING'}
                <td class="text-primary">
                  <div class="badge badge-warning badge-outline w-20">
                    Pending
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