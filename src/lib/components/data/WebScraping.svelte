<script lang="ts">
  import * as Carbon from 'carbon-connect-js';
  import { currentBot } from '$lib/stores.js';
  import Accordian from '../Accordian.svelte';
  export let carbonAPIKey: string;
  export let accessToken: string;

  // state
	let isModalOpen = false;
  let activeTab: 'submit' | 'trained' = 'submit';
  let isFetching = false;

  let baseUrl = '';
  let sitemap = '';
  let urlsTrained: string[] | [] = [];
  let parentUrls: string[] | [] = [];
  let urlsGroupedByParent: any[] = [];
  $: if (isModalOpen === true) {fetchUserData()}


  // async function fetchUserData() {

  //   try {
  //     const response = await Carbon.getUserDataSources({
  //       accessToken: accessToken,
  //       sourceType: 'WEB_SCRAPE',
  //       orderBy: "created_at",
  //       orderDir: "desc",
  //       limit: 250,
  //       offset: 0
  //     });

  //     if (response?.status === 200) {
  //       console.log('Scraping result:', response.data.results);
  //       urlsTrained = response.data.results

  //     } else {
  //       console.error('Error:', response.error);
  //     }
  //   } catch (err) {
  //     console.error('Unexpected error:', err.message);
  //   } finally {
  //     console.log('Scraping completed');
  //   }
  //   }

  async function fetchUserData() {
    const url = "https://api.carbon.ai/user_files_v2";
    const payload = {
      pagination: {
        limit: 250,
        offset: 0
      },
      order_by: "created_at",
      order_dir: "desc",
      include_raw_file: true,
      include_parsed_text_file: true,
      include_additional_files: true
    };
    const headers = {
      Authorization: `Bearer ${carbonAPIKey}`,
      "Content-Type": "application/json",
      "customer-id": $currentBot.id
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const parentUrls = data.results.filter((item: any) => item.parent_id === null);
      urlsGroupedByParent = parentUrls.map((parent: any) => {
        return {
          parent: parent.external_url,
          children: data.results.filter((item: any) => item.parent_id === parent.id),
          readyCount: data.results.filter((item: any) => item.parent_id === parent.id && item.sync_status === 'READY').length,
          pendingCount: data.results.filter((item: any) => item.parent_id === parent.id && item.sync_status === 'QUEUED_FOR_SYNC').length,
          errorCount: data.results.filter((item: any) => item.parent_id === parent.id && item.sync_status === 'SYNC_ERROR').length
        }
      });

      console.log('Grouped URLs:', urlsGroupedByParent);
      urlsTrained = urlsGroupedByParent;

      //Retry
      const isPendingUrl = data.results.some((item: any) => {
        console.log('Sync status:', item.sync_status, 'URL:', item.external_url);
        item.sync_status === 'QUEUED_FOR_SYNC'
      });

      if (isPendingUrl) {
        console.log('Pending URL found, fetching again in 45 seconds');
        setTimeout(() => {
          fetchUserData();
        }, 45000);
      } else {
        console.log('No pending URL found');
      }

      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  }


  // async function watchForStatuses() {
  //   if(urlsInTraining.length > 0) {
  //
  //   } else {
  //     watchForStatuses
  //   }
  // }

  async function submitWebScraping(urls: string[], recursionDepth: number = 10) {
    console.log('baseUrl to scrape:', baseUrl);
    try {
      //@ts-ignore
      const response = await Carbon.submitScrapeRequest({
        accessToken: accessToken,
        urls: urls,
        recursionDepth: recursionDepth,
        maxPagesToScrape: 1000,
        chunkSize: 400,
        chunkOverlap: 20,
        skipEmbeddingGeneration: false,
        enableAutoSync: false
      });

      if (response?.status === 200) {
        console.log('Scraping result:', response.data.files);
        urlsTrained.push(response.data?.files)
        urlsTrained = urlsTrained.flat()
      } else {
        console.error('Error:', response.error);
      }
    } catch (err) {
      console.error('Unexpected error:', err.message);
    } finally {
      console.log('Scraping completed');
    }
  }

  async function submitSitemapUrl() {
    try {
      const response = await Carbon.processSitemapUrl({
        accessToken: accessToken,
        sitemapUrl: sitemap
      });

      if (response.status === 200) {
        console.log('Retrieved URLs:', response.data.urls);
        await submitWebScraping(response.data?.urls, 1)
        console.log('Total URLs:', response.data.count);
      } else {
        console.error('Error:', response.error);
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
</script>

<label for="my-modal" class="btn bg-gradient-to-r from-slate-800 to-slate-900 hover:bg-slate-700 w-full h-1/6 modal-button shadow-lg shadow-zinc-400 hover:shadow-lg hover:shadow-stone-200 hover:-mt-1"> 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 bg-gradient-to-tr from-slate-100 to-slate-600 rounded-md text-gray-700">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>
  <div class="bg-gradient-to-tr from-slate-300 to-slate-500 text-transparent bg-clip-text text-xl">
    Web Scraping
  </div>
</label>

<input type="checkbox" id="my-modal" class="modal-toggle" bind:checked={isModalOpen}>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="modal" on:click|self={()=>isModalOpen = false}>
  <div class="modal-box w-11/12 max-w-7xl h-screen bg-slate-700 shadow-lg shadow-indigo-400 grow-button raise-button">
    <div class="flex items-center justify-between mx-8">
      <h3 class="font-bold text-2xl bg-gradient-to-tr from-slate-300 to-slate-500 text-transparent bg-clip-text">Web Scraping</h3>

      <!-- tabs -->
      <div class="flex">
        <div class="tabs tabs-boxed gap-2">
            <button
              class="tab"
              on:click={() => activeTab = 'submit'}
              class:tab-active={activeTab === 'submit'}
            >
              Submit
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

    {#if activeTab === 'submit'}
    <div class="flex flex-col justify-start m-6 gap-4 p-4 bg-slate-800 rounded-lg">
      <!-- URL -->
      <form on:submit|preventDefault={() => submitWebScraping([baseUrl])}>
        <div class="form-control">
          <div class="join">
            <input
              type="text"
              class="input input-bordered w-full join-item placeholder:text-sm"
              bind:value={baseUrl}
              placeholder="e.g. https://chatnode.ai"
              required
              autofocus
            />
            <button class="btn btn-primary join-item w-40" type="submit">
              {#if isFetching}
                <span class="loading loading-spinner loading-sm"></span>
              {:else}
                Submit your Website
              {/if}
            </button>
          </div>
        </div>
      </form>
    </div>


    <div class="flex flex-col justify-start m-6 gap-4 p-4 bg-slate-800 rounded-lg">
      <!-- SITEMAP -->
      <form on:submit|preventDefault={() => submitSitemapUrl()}>
        <div class="form-control">
          <div class="join">
            <input
              type="text"
              class="input input-bordered w-full join-item placeholder:text-sm"
              bind:value={sitemap}
              placeholder="e.g. https://chatnode.ai/sitemap.xml"
              required
              autofocus
            />
            <button class="btn btn-primary join-item w-40" type="submit">
              {#if isFetching}
                <span class="loading loading-spinner loading-sm"></span>
              {:else}
                Submit your Sitemap
              {/if}
            </button>
          </div>
        </div>
      </form>
    </div>
      {/if}

    <!-- MAIN CONTENT --> 
    <section class="w-full h-5/6rounded-xl my-4 overflow-auto">
      {#if activeTab === 'submit'}
        {#if isFetching}
          <div class="flex flex-col items-center justify-center h-full">
            <p class="text-2xl text-primary">Fetching urls</p>
            <span class="loading loading-bars loading-lg text-secondary"></span>
          </div>
        {/if}
      {/if}

      {#if activeTab === 'trained'}
      <div class="overflow-x-auto">
        {#each urlsGroupedByParent as parentUrl}
        <div class="my-4">
          <Accordian> 
            <div slot="title" class="grid grid-cols-5 gap-2 items-center w-full">
              <td class="text-primary">{parentUrl.parent} </td>
              <div class="mx-8 flex gap-2">
                {#if parentUrl.readyCount > 0}
                <td class="text-primary">
                  <div class="badge badge-success badge-outline">
                    ready: {parentUrl.readyCount}
                  </div>
                </td>
                {/if}
                {#if parentUrl.pendingCount > 0}
                <td class="text-primary">
                  <div class="badge badge-warning badge-outline">
                    pending: {parentUrl.readyCount}
                  </div>
                </td>
                {/if}
                {#if parentUrl.errorCount > 0}
                <td class="text-primary">
                  <div class="badge badge-error badge-outline">
                    Error: {parentUrl.errorCount}
                  </div>
                </td>
                {/if}
              </div>
            </div>
            <div>

              <table class="table table-xs">
                <thead>
                  <tr>
                    <th>Url</th>
                    <th>Status</th>
                    <th>Id</th>
                  </tr>
                </thead>
                <tbody>
                  {#each parentUrl.children as childUrl}
                  <tr id={childUrl.id} class="p-.05">
                    <td class="text-primary"> {childUrl.external_url} </td>
                    {#if childUrl.sync_status === 'READY'}
                    <td class="text-primary">
                      <div class="badge badge-success badge-outline">
                        ready
                      </div>
                    </td>
                    {:else if childUrl.sync_status === 'QUEUED_FOR_SYNC'}
                    <td class="text-primary">
                      <div class="badge badge-warning badge-outline">
                        pending
                      </div>
                    </td>
                    {:else if childUrl.sync_status === 'SYNC_ERROR'}
                    <td class="text-primary">
                      <div class="badge badge-error badge-outline">
                        Error
                      </div>
                    </td>
                    {/if}
                    <td class="text-primary"> {childUrl.id} </td>
                    <td>
                      <button class="btn btn-secondary btn-sm" on:click={() => {
                        removeFile(childUrl.id);
                        const elForDeletion = document.getElementById(childUrl.id);
                        if (elForDeletion) {
                          elForDeletion.remove();
                        }
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
          </Accordian>
        </div>
        {/each}
      </div>
      {/if}

    </section>
  </div>
</div>