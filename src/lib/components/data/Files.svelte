<script lang="ts">
  import * as Carbon from 'carbon-connect-js';
  import { currentBot } from '$lib/stores.js';
  export let accessToken: string;
  
  // state
	let isModalOpen = false;
  let activeTab: 'upload' | 'trained' = 'upload';
  let isUploading = false;
  let hasQueuedFiles = false;
  let counter: number;
  let intervalId: any;

  // files
  let fileInput: any;
  let filesToUpload: any = [];
  let filesTrained: any = [];

  $: if(isModalOpen === true) {
    activeTab = 'upload';
    fetchAllFiles();
  }

  $: if (filesTrained.length === 0) {
    hasQueuedFiles = false;
  }

  async function fetchAllFiles() {
    const pdfResponse = await fetchUserData('PDF');
    const txtResponse = await fetchUserData('TEXT');
    const docResponse = await fetchUserData('DOC');
    const docxResponse = await fetchUserData('DOCX');

    const pdfFiles = pdfResponse?.results || [];
    const txtFiles = txtResponse?.results || [];
    const docFiles = docResponse?.results || [];
    const docxFiles = docxResponse?.results || [];

    filesTrained = [...pdfFiles, ...txtFiles, ...docFiles, ...docxFiles];

    hasQueuedFiles = filesTrained.some((file: any) => file.sync_status === 'QUEUED_FOR_OCR' || file.sync_status === 'QUEUED_FOR_SYNC');
    if (hasQueuedFiles) {
      countdownFrom40();
      setTimeout(() => {
        fetchAllFiles();
      }, 40000);
    }
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
      filesTrained = response.data.results
      console.log('Files:', filesTrained);

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

  function handleFilesChange(event: any) {
    filesToUpload = Array.from(event.target.files);
    console.log(filesToUpload);
  }
  
  async function uploadFiles() {
  try {
    const response = await Carbon.uploadFiles({
      accessToken: accessToken,
      files: filesToUpload,
      chunkSize: 400,
      chunkOverlap: 20,
      skipEmbeddingGeneration: false,
      useOCR: filesToUpload[0].type === 'application/pdf' ? true : false, // **** assumses 1 file upload at a time
      embeddingModel: 'OPENAI_ADA_LARGE_3072'
    });

    if (response.status === 200) {
      console.log('Uploaded Files:', response.data.successfulUploads);
      return response.data.successfulUploads;
      if (response.error) {
        console.warn('Failed Uploads:', response.error.failedUploads);
      }
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
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 bg-gradient-to-tr from-slate-100 to-slate-600 rounded-md text-gray-700">
    <path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
  </svg> 
  <div class="bg-gradient-to-tr from-slate-300 to-slate-500 text-transparent bg-clip-text text-xl">
    Files
  </div>
</label>

<input type="checkbox" id="files" class="modal-toggle" bind:checked={isModalOpen}>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="modal" on:click|self={()=>isModalOpen = false}>
  <div class="modal-box w-11/12 max-w-7xl h-screen bg-slate-700 grow-button raise-button">
    <div class="flex items-center justify-between">
      <h3 class="font-bold text-xl">Files</h3>

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

      <!-- Upload -->
      {#if activeTab === 'upload'}
       <div class="flex-1 m-16">
				<form method="post" enctype="multipart/form-data" class="join w-full">
					<input
						name="chat-button-img"
						type="file"
						accept=".txt, .pdf, .doc, .docx"
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
              class="btn join-item border-primary"
              value="Upload"
              on:click={async (e) => {
                e.preventDefault();
                isUploading = true;
                const files = await uploadFiles();
                filesTrained = [... filesTrained, files]
                filesTrained = filesTrained.flat();
                console.log('Files trained ---->:', files);

                setTimeout(() => {
                  isUploading = false;
                  activeTab = 'trained';
                  hasQueuedFiles = true;
                  countdownFrom40();
                }, 1000);

                setTimeout(() => {
                  fetchAllFiles();
                }, 38000);
              }
            }
            />
          {/if}
				</form>
        </div>
      {/if}

      <!-- Trained -->
      {#if activeTab === 'trained'}
      <table class="table table-xs">
        <thead>
          <tr>
            <th>Url</th>
            <th>Status</th>
            <th>Id</th>
          </tr>
        </thead>
        <tbody>
          {#each filesTrained as file}
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