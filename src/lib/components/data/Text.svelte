<script lang="ts">
  import * as Carbon from 'carbon-connect-js';
  import { currentBot, alert } from '$lib/stores.js';

  export let accessToken: string;
  export let totalFileCount: number;
  console.log($currentBot.id)

  
  // state
	let isModalOpen = false;
  let isUploading = false;
  let isEditing = false;
  let activeTab: 'upload' | 'trained' = 'upload';
  let hasQueuedFiles = false;
  let counter: number;
  let intervalId: any;
  let timeoutId: any;
  let retrainId: any;

  let textTrained: [] = [];
  let title: string;
  let text: string

  $: if(isModalOpen === true) {
    activeTab = 'upload';
    fetchUserData('RAW_TEXT');
    //@ts-ignore
    (async () => {
      totalFileCount = await fetchTotalFileCount() || 0;
    })();
  }

  async function fetchTotalFileCount() {
    try {
      const response = await fetch('/api/data-sources/user-files', {
        method: 'POST',
        body: JSON.stringify({
          customerId: $currentBot.id,
          fileTypes: ["PDF", "TEXT", "XLSX", "CSV", "DOCX", "MD", "RTF", "TSV", "PPTX", "JSON", "RAW_TEXT"],
          limit: 1,
          offset: 0
        })
      });

      const data = await response.json();

      if (response?.status === 200) {
        totalFileCount = data?.count || 0;
        return totalFileCount;
      } else {
        console.error('Error:', response.error);
      }
    } catch (err) {
      console.error('Unexpected error:', err.message);
    }
  }

  async function fetchUserData(type: string) {
    try {
      const response = await fetch('/api/data-sources/user-files', {
        method: 'POST',
        body: JSON.stringify({
          customerId: $currentBot.id,
          fileTypes: ["RAW_TEXT"],
          limit: 1,
          offset: 0
        })
      });

      const data = await response.json();

      if (response?.status === 200) {
        textTrained = data?.results

        hasQueuedFiles = textTrained.some((file: any) => file.sync_status === 'QUEUED_FOR_SYNC');
        if (hasQueuedFiles && isModalOpen) {
          countdownFrom40();
          if(timeoutId) clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            fetchUserData('RAW_TEXT');
          }, 40000);
        }
        console.log('Files:', textTrained);

        return data;

      } else {
        console.error('Error:', response.error);
      }
    } catch (err) {
      console.error('Unexpected error:', err.message);
    } finally {
      console.log('Files completed');
    }
  }

  async function uploadCustomText(fileId: string | null = null) {
    const chunkSize = $currentBot.settings.dataFunnelSettings?.rawText?.chunkSize ? $currentBot.settings.dataFunnelSettings?.rawText?.chunkSize : 400;
    const chunkOverlap = $currentBot.settings.dataFunnelSettings?.rawText?.chunkOverlap ? $currentBot.settings.dataFunnelSettings?.rawText?.chunkOverlap : 20;
    try {
      console.log('Uploading text:', text);
      console.log('Uploading title:', title);
      const response = await fetch(`/api/data-sources/training/text`, {
					method: 'POST',
					body: JSON.stringify({
            bot_id: $currentBot.id,
						text: text,
            title: title,
            fileId: fileId,
            chunkSize: chunkSize,
            chunkOverlap: chunkOverlap
					})
				});

      // const response = await Carbon.uploadText({
      //   accessToken: accessToken,
      //   contents: text,
      //   fileName: title,
      //   chunkSize: chunkSize,
      //   chunkOverlap: chunkOverlap,
      //   skipEmbeddingGeneration: false,
      //   embeddingModel: 'OPENAI_ADA_LARGE_3072'
      // });

      if (response.status === 200) {
        const data = await response.json()
        console.log('Uploaded file details:', data);
        totalFileCount += 1;
        return data;
      } else {
        console.error('Error:', response.error);
      }
    } catch (err) {
      console.error('Unexpected error during upload:', err.message);
    }
  }

  async function editFile(fileId: string) {
    const response = await fetch(`/api/data-sources/training/text-retrieval`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bot_id: $currentBot.id,
        fileId: fileId
      })
    });

    const file = await response.json();
    const presignedText = file.text;

    title = file.name;
    text = presignedText;
    retrainId = file.id;

    isEditing = true;
    activeTab = 'upload';


    try {

      if (response.status === 200) {
        console.log('File successfully edited:', response.data);
      } else {
        console.error('Error:', response.error);
      }
    } catch (err) {
      console.error('Unexpected error during file edit:', err.message);
    }
  }

  async function removeFile(fileId: string) {
    console.log('Removing file:', fileId);
    try {
      const response = await Carbon.deleteFile({
        accessToken: accessToken,
        fileId: fileId
      });

      if (response.status === 200) {
        console.log('File successfully deleted:', response.data);
        totalFileCount -= 1;
      } else {
        console.error('Error:', response.error);
      }
    } catch (err) {
      console.error('Unexpected error during file deletion:', err.message);
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
</script>

<label for="text" class="btn bg-gradient-to-r from-slate-800 to-slate-900 hover:bg-slate-700 w-full h-1/6 modal-button shadow-lg shadow-zinc-400 hover:shadow-lg hover:shadow-stone-200 hover:-mt-1">  
  <div class="bg-gradient-to-tr from-slate-300 to-slate-500 text-transparent bg-clip-text text-xl">
   + Text
  </div>
</label>

<input type="checkbox" id="text" class="modal-toggle" bind:checked={isModalOpen}>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="modal" on:click|self={()=>isModalOpen = false}>
  <div class="modal-box w-11/12 max-w-7xl h-screen bg-gradient-to-tr from-slate-500 to-slate-700 shadow-xl shadow-zinc-400 grow-button raise-button">
    <div class="flex items-center justify-between mx-8">
      <div class="flex gap-4 items-center">
        <h3 class="py-1 font-bold text-3xl rounded-xl text-zinc-400">Text</h3>
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
                  Trained <span class="{totalFileCount < 30 || totalFileCount === undefined ? 'mx-1' : 'text-red-500 mx-1'}">({totalFileCount}/30 Total Files)</span>
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

      <!-- Input -->
      {#if activeTab === 'upload'}
        <div class="w-3/4 h-full my-12 mx-auto flex flex-col gap-4 bg-slate-800 p-8 rounded-xl">
          <input bind:value={title} type="text" placeholder="Enter a title" class="input input-bordered input-secondary w-full" />
          <textarea bind:value={text} class="textarea textarea-bordered w-full h-full" placeholder="Teach your bot utilizing clear and direct text..."></textarea>
          <button 
            class="btn btn-primary w-24"
            disabled={!text || !title}
            on:click={async () => {
              if(!title && !text) {
                $alert = { type: 'error', msg: 'Title and Text are required' };
                return;
              } else if (!title) {
                $alert = { type: 'error', msg: 'Title is required' };
                return;
              } else if (!text) {
                $alert = { type: 'error', msg: 'Text is required' };
                return;
              }


              if(totalFileCount >= 30) {
                $alert = { msg: 'You have reached the 30 file limit', type: 'error' };
                return;
              }

              // Finish here passing in the the file Id and improving the uploadCustomText function

              isUploading = true;
              const response = await uploadCustomText(retrainId);

              //remove preedited file from trained files
              if(retrainId) {
                textTrained = textTrained.filter((item) => item.id !== retrainId);
              }

              console.log('Response:', response);
              if(response) {
                textTrained = [...textTrained, response];
                hasQueuedFiles = true;
                
                setTimeout(() => {
                  countdownFrom40();
                  activeTab = 'trained';
                  hasQueuedFiles = true;
                  isUploading = false;
                  isEditing = false;
                  title = '';
                  text = '';

                  if(timeoutId) clearTimeout(timeoutId);
                  timeoutId =setTimeout(() => {
                    fetchUserData('RAW_TEXT');
                  }, 40000);
                }, 1000);
              }
            }}
          >
          
          {#if isUploading}
            <span class="loading loading-spinner loading-md"></span>
          {:else if isEditing}
            Retrain 
          {:else}
            Train
          {/if}
          </button>
        </div>
      {/if}

      <!-- Trained -->
      {#if activeTab === 'trained'}
        <div class="w-full h-full px-7 pt-8 overflow-y-auto bg-slate-900 bg-opacity-60 rounded-xl">
          <table class="table w-full table-xs">
            <thead>
              <tr class="text-md font-bold text-secondary text-left">
                <th>No.</th>
                <th>Title</th>
                <th>Status</th>
                <th>Id</th>
              </tr>
            </thead>
            <tbody>
              {#each textTrained as file, i}
              <tr id={file.id} class="p-.05 w-full">
                <td class="text-primary">{i + 1}</td>
                <td class="text-primary w-1/2 overflow-x-auto">{file.name} </td>
                {#if file.sync_status === 'READY'}
                  <td class="text-primary">
                    <div class="badge badge-success badge-outline w-20">
                      Ready
                    </div>
                  </td>
                  {:else if file.sync_status === 'QUEUED_FOR_SYNC'}
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
                <td class="text-primary">{file.id}</td>
                <td class="text-primary">
                  <button 
                    class="btn btn-secondary btn-sm" 
                    on:click={() => {
                      editFile(file.id);
                      //@ts-ignore
                    }
                  }
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button 
                    class="btn btn-secondary btn-sm" 
                    on:click={() => {
                      removeFile(file.id);
                      //@ts-ignore
                      textTrained = textTrained.filter((item) => item.id !== file.id);
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