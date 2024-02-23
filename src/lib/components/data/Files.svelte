<script lang="ts">
  import * as Carbon from 'carbon-connect-js';
  import { currentBot } from '$lib/stores.js';

  export let accessToken: string;
  export let totalFileCount: number;
  
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
    activeTab = 'upload';
    fetchUserData();
  }

  $: if (filesTrained.length === 0) {
    hasQueuedFiles = false;
  }

  async function fetchUserData() {
    try {
      const response = await Carbon.getUserFiles({
        accessToken: accessToken,
        filters: {"source": ["PDF", "TEXT", "XLSX", "CSV", "DOCX", "MD", "RTF", "TSV", "PPTX", "JSON"]},
        orderBy: "created_at",
        orderDir: "desc",
        limit: 250,
        offset: 0
      });

      if (response?.status === 200) {
        totalFileCount = response.data?.count || 0;
        filesTrained = response.data?.results || [];

        // Retry
        hasQueuedFiles = filesTrained.some((file: any) => file.sync_status === 'QUEUED_FOR_OCR' || file.sync_status === 'QUEUED_FOR_SYNC');
        console.log('Has queued files & will be attempted again --->', hasQueuedFiles);

        if (hasQueuedFiles && isModalOpen) {
          countdownFrom40();
          if(timeoutId) clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            fetchUserData();
          }, 40000);
        }

      return response.data;

      } else {
        console.error('Error:', response.error);
      }
    } catch (err) {
      console.error('Unexpected error:', err.message);
    }
  }

  function handleFilesChange(event: any) {
    filesToUpload = Array.from(event.target.files);
    console.log(filesToUpload);
  }
  
  async function uploadFiles() {
    const chunkSize = $currentBot.settings.dataFunnelSettings?.files?.chunkSize ? $currentBot.settings.dataFunnelSettings?.files?.chunkSize : 400;
    const chunkOverlap = $currentBot.settings.dataFunnelSettings?.files?.chunkOverlap ? $currentBot.settings.dataFunnelSettings?.files?.chunkOverlap : 20;
    try {
      const response = await Carbon.uploadFiles({
        accessToken: accessToken,
        files: filesToUpload,
        chunkSize: chunkSize,
        chunkOverlap: chunkOverlap,
        skipEmbeddingGeneration: false,
        useOCR: filesToUpload[0].type === 'application/pdf' ? true : false, // * assumses 1 file upload at a time
        embeddingModel: 'OPENAI_ADA_LARGE_3072'
      });

      if (response.status === 200) {
        console.log('Uploaded Files:', response.data.successfulUploads);
        return response.data.successfulUploads;
      } else {
        console.error('Error:', response.error.message);
      }
    } catch (err) {
      console.error('Unexpected error:', err.message);
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

<label for="files" class="btn bg-gradient-to-r from-slate-800 to-slate-900 hover:bg-slate-700 w-full h-1/6 modal-button shadow-lg shadow-zinc-400 hover:shadow-lg hover:shadow-stone-200 hover:-mt-1"> 
  <div class="bg-gradient-to-tr from-slate-300 to-slate-500 text-transparent bg-clip-text text-xl">
    + Files
  </div>
</label>

<input type="checkbox" id="files" class="modal-toggle" bind:checked={isModalOpen}>

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
                  Trained
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
       <div class="flex-1 m-16">
				<form method="post" enctype="multipart/form-data" class="join w-full">
					<input
						name="chat-button-img"
						type="file"
						accept=".txt, .pdf, .doc, .docx, .csv, .xlsx, .md, .rtf, .tsv, .pptx, .json"
						class="join-item file-input file-input-bordered w-full"
						on:change={() => handleFilesChange(event)}
					/>
					<input
						name="existing-cloudinary-public-id-popup"
						type="hidden"
						value={'hello'}
					/>
          {#if isUploading}
          <button class="btn join-item border-primary">
            <span class="loading loading-spinner loading-md"></span>
          </button>
          {:else}
            <input
              type="submit"
              class="btn btn-primary join-item"
              disabled={filesToUpload.length === 0}
              value="Upload"
              on:click={async (e) => {
                e.preventDefault();
                isUploading = true;
                const files = await uploadFiles();
                filesTrained = [... filesTrained, files]
                filesTrained = filesTrained.flat();
                filesToUpload = [];
                console.log('Files trained ---->:', files);

                setTimeout(() => {
                  isUploading = false;
                  activeTab = 'trained';
                  hasQueuedFiles = true;
                  countdownFrom40();
                }, 1000);

                if(timeoutId) clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                  fetchUserData();
                }, 40000);
              }
            }
            />
          {/if}
				</form>

        <div class="w-full my-8">
          <h2 class="m-6 text-2xl text-center text-slate-400 font-semibold">Acceptable File Types</h2>
          <div class=" grid grid-cols-3 gap-6">
            {#each acceptableFileExtensions as file}
              <div class="flex flex-col items-center justify-center p-6 rounded-xl bg-slate-800">
                <span class="bg-gradient-to-tr from-slate-600 to-cyan-300 text-transparent bg-clip-text text-xl">.{file}</span>
              </div>
            {/each}
          </div>
        </div>
        </div>
      {/if}

      <!-- Trained -->
      {#if activeTab === 'trained'}
      <div class="w-full h-full px-7 pt-8 bg-slate-900 bg-opacity-60 rounded-xl">
        <table class="table table-xs">
          <thead>
            <tr class="text-md font-bold text-secondary">
              <th>Title</th>
              <th>Status</th>
              <th>Id</th>
            </tr>
          </thead>
          <tbody>
            {#each filesTrained as file}
            <tr id={file.id} class="p-.05">
              <td class="text-primary w-1/2 /overflow-x-auto"> {file.name} </td>
              {#if file.sync_status === 'READY'}
                <td class="text-primary">
                  <div class="badge badge-success badge-outline w-20">
                    Ready
                  </div>
                </td>
                {:else if file.sync_status === 'QUEUED_FOR_SYNC' || file.sync_status === 'QUEUED_FOR_OCR'}
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