<script lang="ts">
  import * as Carbon from 'carbon-connect-js';
  import { currentBot, alert } from '$lib/stores.js';
  import Accordian from '../Accordian.svelte';
	import { children } from 'svelte/internal';
	import { base } from '$app/paths';
  export let carbonAPIKey: string;
  export let accessToken: string;

  // state
	let isModalOpen = false;
  let activeTab: 'submit' | 'trained' = 'submit';
  let isFetchingUrls = false;
  let isFetchingSitemap = false;
  let hasQueuedFiles = false;
  let counter: number;
  let intervalId: any;


  let baseUrl = '';
  let sitemap = '';
  let urlsTrained: string[] | [] = [];
  let parentUrls: string[] | [] = [];
  let urlsGroupedByParent: any[] = [];

  $: if (isModalOpen === true) {
    activeTab = 'submit';
    fetchUserData()
  }

  $: if(activeTab === 'submit') {
    baseUrl = '';
    sitemap = '';
    isFetchingUrls = false;
    isFetchingSitemap = false;
  }

  async function fetchUserData() {

    try {
      const response = await Carbon.getUserFiles({
        accessToken: accessToken,
        filters: {"source": "WEB_SCRAPE"},
        // @ts-ignore
        orderBy: "created_at",
        orderDir: "desc",
        limit: 250,
        offset: 0
      });

      if (response?.status === 200) {
        const parentUrls = response.data.results.filter((item: any) => item.parent_id === null);
        urlsGroupedByParent = parentUrls.map((parent: any) => {

          const children = [parent, ...response.data.results.filter((item: any) => item.parent_id === parent.id)];
          const readyCount = children.filter((item: any) => item.sync_status === 'READY').length;
          const pendingCount = children.filter((item: any) => item.sync_status === 'QUEUED_FOR_SYNC').length;
          const errorCount = children.filter((item: any) => item.sync_status === 'SYNC_ERROR').length
          
          return {
            parent: parent.external_url,
            parentId: parent.id,
            parentStatus: parent.sync_status,
            children,
            readyCount,
            pendingCount,
            errorCount
          }
      });

      
  
      console.log('Grouped URLs:', urlsGroupedByParent);
      urlsTrained = urlsGroupedByParent;

      //Retry
      hasQueuedFiles = response.data.results.some((item: any) => {
        return item.sync_status === 'QUEUED_FOR_SYNC'
      });
      console.log('Has queued files:', hasQueuedFiles);

      if (hasQueuedFiles && isModalOpen) {
        countdownFrom40();
        if(timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          fetchUserData();
        }, 40000);
      } else {
        hasQueuedFiles = false;
      }

      return response.data;

      } else {
        console.error('Error:', response.error);
      }
    } catch (err) {
      console.error('Unexpected error:', err.message);
    } 
  }

  // async function fetchUserData() {
  //   const url = "https://api.carbon.ai/user_files_v2";
  //   const payload = {
  //     pagination: {
  //       limit: 250,
  //       offset: 0
  //     },
  //     order_by: "created_at",
  //     order_dir: "desc",
  //     sourceType: 'WEB_SCRAPE',
  //   };
  //   const headers = {
  //     Authorization: `Bearer ${carbonAPIKey}`,
  //     "Content-Type": "application/json",
  //     "customer-id": $currentBot.id
  //   };
  //   try {
  //     const response = await fetch(url, {
  //       method: "POST",
  //       headers: headers,
  //       body: JSON.stringify(payload)
  //     });
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
  //     const data = await response.json();
  //     const parentUrls = data.results.filter((item: any) => item.parent_id === null);
  //     urlsGroupedByParent = parentUrls.map((parent: any) => {
  //       return {
  //         parent: parent.external_url,
  //         children: data.results.filter((item: any) => item.parent_id === parent.id),
  //         readyCount: data.results.filter((item: any) => item.parent_id === parent.id && item.sync_status === 'READY').length,
  //         pendingCount: data.results.filter((item: any) => item.parent_id === parent.id && item.sync_status === 'QUEUED_FOR_SYNC').length,
  //         errorCount: data.results.filter((item: any) => item.parent_id === parent.id && item.sync_status === 'SYNC_ERROR').length
  //       }
  //     });
  //
  //     console.log('Grouped URLs:', urlsGroupedByParent);
  //     urlsTrained = urlsGroupedByParent;
  //
  //     //Retry
  //     const isPendingUrl = data.results.some((item: any) => {
  //       console.log('Sync status:', item.sync_status, 'URL:', item.external_url);
  //       item.sync_status === 'QUEUED_FOR_SYNC'
  //     });
  //
  //     if (isPendingUrl) {
  //       console.log('Pending URL found, fetching again in 45 seconds');
  //       setTimeout(() => {
  //         fetchUserData();
  //       }, 45000);
  //     } else {
  //       console.log('No pending URL found');
  //     }
  //
  //     return data;
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // }

  async function submitWebScraping(urls: string[], recursionDepth: number = 10) {
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
        enableAutoSync: false,
        embeddingModel: 'OPENAI_ADA_LARGE_3072'
      });

      if (response.status === 200) {
        const parentObject = {
          parent: response.data?.files[0]?.external_url,
          parentId: response.data?.files[0]?.id,
          children: [response.data?.files[0]],
          readyCount: 0,
          pendingCount: 1,
          errorCount: 0
        }


        // add parent to array of parents if not already present
        if (!parentUrls.includes(parentObject.parent)) {
          parentUrls.push(parentObject.parent);
          urlsGroupedByParent.push(parentObject);
          urlsTrained = urlsGroupedByParent;
        }
        console.log('')
        return true;
      } else {
        console.error('Error:', response.error);
      }
    } catch (err) {
      console.error('Unexpected error:', err.message);
      return false;
    }
  }

  async function submitSitemapUrl() {
    console.log('Sitemap:', sitemap);
  
    try {
      const response = await Carbon.processSitemapUrl({
        accessToken: accessToken,
        sitemapUrl: sitemap
      });

      console.log('Sitemap response ----x:', response);
      console.log('Sitemap response error----x:', response.error);
      if (response.status === 200) {
        console.log('Sitemap came back --->x', response.status);
        const webScrapingResponse = await submitWebScraping(response.data?.urls, 1)
        if (webScrapingResponse) {
          return true;
        }
      } else {
        console.error('Error:', response.error);
      }
    } catch (err) {
      console.error('Unexpected error:', err.message);
      return false;
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

<label for="web_scraping" class="btn bg-gradient-to-r from-slate-800 to-slate-900 hover:bg-slate-700 w-full h-1/6 modal-button shadow-lg shadow-zinc-400 hover:shadow-lg hover:shadow-stone-200 hover:-mt-1"> 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 bg-gradient-to-tr from-slate-100 to-slate-600 rounded-md text-gray-700">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>
  <div class="bg-gradient-to-tr from-slate-300 to-slate-500 text-transparent bg-clip-text text-xl">
    Web Scraping
  </div>
</label>

<input type="checkbox" id="web_scraping" class="modal-toggle" bind:checked={isModalOpen}>

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
      <form on:submit|preventDefault={async () => {
          isFetchingUrls = true;
          const response = await submitWebScraping([baseUrl])

          if(!response) {
            isFetchingUrls = false;
            $alert = { type: 'error', msg: 'Please submit a valid URL', duration: 2500 };
            baseUrl = '';
            return;
          }

          setTimeout(() => {
            isFetchingUrls = false;
            activeTab = 'trained';
            countdownFrom40();
            hasQueuedFiles = true;
          }, 1000);

          if(timeoutId) clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            fetchUserData();
          }, 40000);
        }
      }>
        <div class="form-control">
          <div class="join">
            <input
              type="text"
              class="input input-bordered w-full join-item placeholder:text-sm"
              bind:value={baseUrl}
              placeholder="e.g. chatnode.ai"
              required
              autofocus
            />
            <button class="btn btn-primary join-item w-40" type="submit">
              {#if isFetchingUrls}
                <span class="loading loading-spinner loading-sm"></span>
              {:else}
                Submit Website
              {/if}
            </button>
          </div>
        </div>
      </form>
    </div>


    <div class="flex flex-col justify-start m-6 gap-4 p-4 bg-slate-800 rounded-lg">
      <!-- SITEMAP -->
      <form on:submit|preventDefault={async () => {
          isFetchingSitemap = true;
          const response = await submitSitemapUrl()

          if(!response) {
            isFetchingSitemap = false;
            $alert = { type: 'error', msg: 'Please submit a valid sitemap', duration: 2500 };
            sitemap = '';
            return;
          }
          setTimeout(() => {
            isFetchingSitemap = false;
            activeTab = 'trained';
          }, 1000);
        }
      }
      >
        <div class="form-control">
          <div class="join">
            <input
              type="text"
              class="input input-bordered w-full join-item placeholder:text-sm"
              bind:value={sitemap}
              placeholder="e.g. chatnode.ai/sitemap.xml"
              required
            />
            <button class="btn btn-primary join-item w-40" type="submit">
              {#if isFetchingSitemap}
                <span class="loading loading-spinner loading-sm"></span>
              {:else}
                Submit Sitemap
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
        {#if isFetchingUrls || isFetchingSitemap}
          <div class="flex flex-col items-center justify-center h-full">
            <p class="text-2xl text-primary">Submiting</p>
            <span class="loading loading-bars loading-lg text-secondary"></span>
          </div>
        {/if}
      {/if}

      {#if activeTab === 'trained'}
      <div class="overflow-x-auto">
        {#each urlsGroupedByParent as parentUrl}
        <div id="{parentUrl.parentId}" class="my-4">
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
                    Processing
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
                      <button class="btn btn-secondary btn-sm" 
                      disabled={childUrl.parent_id === null && parentUrl.children.length !== 1}
                      
                        on:click={(e) => {
                          removeFile(childUrl.id);

                          // remove child from parent
                          parentUrl.children = parentUrl.children.filter((item) => item.id !== childUrl.id);

                          // update parent counts
                          parentUrl.readyCount = parentUrl.children.filter((item) => item.sync_status === 'READY').length;
                          parentUrl.pendingCount = parentUrl.children.filter((item) => item.sync_status === 'QUEUED_FOR_SYNC').length;
                          parentUrl.errorCount = parentUrl.children.filter((item) => item.sync_status === 'SYNC_ERROR').length;

                          // remove parent if no children
                          if (parentUrl.children.length === 0) {
                            removeFile(parentUrl.parentId);
                            const parentElForDeletion = document.getElementById(parentUrl.parentId);
                            if (parentElForDeletion) {
                              parentElForDeletion.remove();
                            }
          
                          }
                        }}
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
      {#if hasQueuedFiles}
        <span>Data will update in {counter} seconds</span>
      {/if}
    {/if}
    </section>
  </div>
</div>