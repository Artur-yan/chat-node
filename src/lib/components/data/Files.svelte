<script lang="ts">
  import * as Carbon from 'carbon-connect-js';
  import { currentBot } from '$lib/stores.js';
  export let accessToken: string;
  
  // state
	let isModalOpen = false;
  let activeTab: 'upload' | 'trained' = 'upload';

  // files
  let fileInput: any;
  let filesToUpload: any = [];

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
      useOCR: true,
      embeddingModel: 'OPENAI_ADA_LARGE_3072'
    });

    if (response.status === 200) {
      console.log('Uploaded Files:', response.data.successfulUploads);
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
					<input
						type="submit"
						class="btn join-item border-primary"
						value="Upload"
            on:click={(e) => {
              e.preventDefault();
              uploadFiles();
            }
          }
					/>
				</form>
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