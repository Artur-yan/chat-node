<script lang="ts">
  import { currentBot, alert } from '$lib/stores.js';
  import { SupabaseClient, createClient } from '@supabase/supabase-js';

  export let totalFileCount: number;
  export let credentials: any;

  const supabase = createClient(credentials.PUBLIC_SUPABASE_URL, credentials.SUPABASE_KEY);
  console.log('Supabase:', supabase);
  
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
          fileTypes: ["PDF", "TEXT", "XLSX", "CSV", "DOCX", "MD", "RTF", "TSV", "PPTX", "JSON"],
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

  function handleFilesChange(event: any) {
    filesToUpload = Array.from(event.target.files);
  }

  async function getFileUrl() {
    console.log('Files to upload:', filesToUpload);
    const { data, error } = await supabase.storage.from('files').upload(filesToUpload[0]?.name, filesToUpload[0]);
    console.log('Data:', data);

    if (error) {
      // Handle error
      console.error('Error:', error);
    } else {
      // Handle success
      console.log('File uploaded successfully:', data);
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('files')
      .createSignedUrl(data.path, 60 * 15); // Expires in 15 minutes

      console.log('Signed url:', signedUrlData);
      console.log('Signed url error:', signedUrlError);
    }
  }
  
  async function uploadFiles(url: string) {
    //TODO implement url
    const chunkSize = $currentBot.settings.dataFunnelSettings?.files?.chunkSize ? $currentBot.settings.dataFunnelSettings?.files?.chunkSize : 400;
    const chunkOverlap = $currentBot.settings.dataFunnelSettings?.files?.chunkOverlap ? $currentBot.settings.dataFunnelSettings?.files?.chunkOverlap : 20;
    try {

    const form = new FormData();

    form.append("file", filesToUpload[0]);
    form.append('bot_id', $currentBot.id)
    form.append('chunkSize', chunkSize)
    form.append('chunkOverlap', chunkOverlap)

     const response = await fetch(`/api/data-sources/files`, {
					method: 'POST',
					body: form
				});

    const data = await response.json()

      if (response.status === 200) {
        totalFileCount += 1;
        return data;
      } else {
        console.error('Error:', response.error.message);
      }
    } catch (err) {
      console.error('Unexpected error:', (err as Error).message);
    }
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

                if(totalFileCount >= 30) {
                  $alert = { msg: 'You have reached the 30 file limit', type: 'error' };
                  return;
                }

                isUploading = true;
                const fileUrl = await getFileUrl();
                return;
                console.log('File url:', fileUrl);
                const files = await uploadFiles(fileUrl);
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