<script lang="ts">
  import * as Carbon from 'carbon-connect-js';
  import { currentBot } from '$lib/stores.js';
  export let accessToken: string;
  
  // state
	let isModalOpen = false;
  let activeTab: 'upload' | 'trained' = 'upload';
  let hasQueuedFiles = false;
  let counter: number;
  let intervalId: any;
  let timeoutId: any;

  let textTrained: [] = [];

  let title: string;
  let text: string

  $: if(isModalOpen === true) {
    fetchUserData('RAW_TEXT');
  }

  async function fetchUserData(type: string) {
    try {
      const response = await Carbon.getUserFiles({
        accessToken: accessToken,
        filters: {"source": type} ,
        orderBy: "created_at",
        orderDir: "desc",
        limit: 250,
        offset: 0
      });

      if (response?.status === 200) {
        textTrained = response.data.results

        hasQueuedFiles = textTrained.some((file: any) => file.sync_status === 'QUEUED_FOR_SYNC');
        if (hasQueuedFiles && isModalOpen) {
          countdownFrom40();
          if(timeoutId) clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            fetchUserData('RAW_TEXT');
          }, 40000);
        }
        console.log('Files:', textTrained);

        return response.data;

      } else {
        console.error('Error:', response.error);
      }
    } catch (err) {
      console.error('Unexpected error:', err.message);
    } finally {
      console.log('Files completed');
    }
  }

  async function uploadCustomText() {
    const chunkSize = $currentBot.settings.datafunnelSettings.rawText.chunkSize ? $currentBot.settings.datafunnelSettings.rawText.chunkSize : 400;
    const chunkOverlap = $currentBot.settings.datafunnelSettings.rawText.chunkOverlap ? $currentBot.settings.datafunnelSettings.rawText.chunkOverlap : 20;
    
    try {
      console.log('Uploading text:', text);
      console.log('Uploading title:', title);
      const response = await Carbon.uploadText({
        accessToken: accessToken,
        contents: text,
        fileName: title,
        chunkSize: chunkSize,
        chunkOverlap: chunkOverlap,
        skipEmbeddingGeneration: false,
        embeddingModel: 'OPENAI_ADA_LARGE_3072'
      });

      if (response.status === 200) {
        console.log('Uploaded file details:', response.data.file);
        return response.data.file;
      } else {
        console.error('Error:', response.error);
      }
    } catch (err) {
      console.error('Unexpected error during upload:', err.message);
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
      } else {
        console.error('Error:', response.error);
      }
    } catch (err) {
      console.error('Unexpected error during file deletion:', err.message);
    }
  }

  function countdownFrom40() {
    counter = 40;
    if (intervalId) {
      clearInterval(intervalId);
    }

    intervalId = setInterval(() => {
    counter--;

    if (counter < 0) {
      clearInterval(intervalId);
    }
  }, 1000);
}
</script>

<label for="text" class="btn bg-gradient-to-r from-slate-800 to-slate-900 hover:bg-slate-700 w-full h-1/6 modal-button shadow-lg shadow-zinc-400 hover:shadow-lg hover:shadow-stone-200 hover:-mt-1">  
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 bg-gradient-to-tr from-slate-100 to-slate-600 rounded-md text-gray-700">
    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg> 
  <div class="bg-gradient-to-tr from-slate-300 to-slate-500 text-transparent bg-clip-text text-xl">
    Text
  </div>
</label>

<input type="checkbox" id="text" class="modal-toggle" bind:checked={isModalOpen}>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="modal" on:click|self={()=>isModalOpen = false}>
  <div class="modal-box w-11/12 max-w-7xl h-screen bg-slate-700 grow-button raise-button">
    <div class="flex items-center justify-between">
      <h3 class="font-bold text-xl">Text</h3>
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
                  Trained
                </button>
              </div>
            </div>
      <div class="modal-action my-auto">
        <form method="dialog">
          <button class="btn btn-secondary my-auto" on:click|self={()=>isModalOpen = false}>Close</button>
        </form>
      </div>
    </div>
    <section class="w-full h-5/6 rounded-xl my-4">
      <!-- Content -->

      <!-- Input -->
      {#if activeTab === 'upload'}
        <div class="w-3/4 h-full my-12 mx-auto flex flex-col gap-4 bg-slate-800 p-8 rounded-xl">
          <input bind:value={title} type="text" placeholder="Title" class="input input-bordered input-secondary w-full" />
          <textarea bind:value={text} class="textarea textarea-bordered w-full h-full" placeholder="Text"></textarea>
          <button 
            class="btn btn-primary"
            on:click={async () => {
              if (!title || !text) {
                console.error('Title and text are required');
                return;
              }
              const response = await uploadCustomText();
              console.log('Response:', response);
              if(response) {
                textTrained = [...textTrained, response];
                hasQueuedFiles = true;
                countdownFrom40();
                activeTab = 'trained';
                hasQueuedFiles = true;
                title = '';
                text = '';

                if(timeoutId) clearTimeout(timeoutId);
                timeoutId =setTimeout(() => {
                  fetchUserData('RAW_TEXT');
                }, 40000);
              }
            }}
          >Train 
          </button>
        </div>
      {/if}

      <!-- Trained -->
      {#if activeTab === 'trained'}
      <table class="table table-xs">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Id</th>
          </tr>
        </thead>
        <tbody>
          {#each textTrained as file}
          <tr id={file.id} class="p-.05">
            <td class="text-primary"> {file.name} </td>
            <td class="text-primary">{file.sync_status}</td>
            <td class="text-primary"> {file.id} </td>
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
      {#if hasQueuedFiles}
        <span>Data will update in {counter} seconds</span>
      {/if}
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