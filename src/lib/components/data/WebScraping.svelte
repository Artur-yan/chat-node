<script lang="ts">
  import * as Carbon from 'carbon-connect-js';
  import { currentBot, alert } from '$lib/stores.js';
  import Accordian from '../Accordian.svelte';
  import { v4 as uuidv4 } from 'uuid';
  export let carbonAPIKey: string;
  export let accessToken: string;
  export let totalFileCount: number;

  // state
	let isModalOpen = false;
  let activeTab: 'submit' | 'trained' = 'submit';
  let isFetchingUrls = false;
  let isFetchingSitemap = false;
  let hasQueuedFiles = false;
  let counter: number;
  let intervalId: any;
  let timeoutId: any;
  let numberOfPages: number;
  let pagesArray: number[] = [];
  let currentPage: number = 1;

  // Values
  let baseUrl = '';
  let sitemap = '';
  let urlsTrained: string[] | [] = [];
  let parentUrls: string[] | [] = [];
  let urlsGroupedByParent: any[] = [];
  let urlsGroupedByDerivedParent: any[] = [];

  //Conditions
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

  async function fetchUserData(offset: number = 0) {

    try {
      const response = await Carbon.getUserFiles({
        accessToken: accessToken,
        filters: {"source": "WEB_SCRAPE"},
        // @ts-ignore
        orderBy: "parent_id",
        orderDir: "desc",
        limit: 250,
        offset: offset
      });

      console.log('Response:', response);



  
      if (response?.status === 200) {

        // Pagination
        totalFileCount = response.data?.count || 0;
        numberOfPages = Math.ceil(totalFileCount / 250);
      
        // Variable to store the number of pages for rendering
        pagesArray = [];
        for(let i = 1; i <= numberOfPages; i++) {
          pagesArray.push(i);
        }

        let parentUrls = response.data.results.filter((item: any) => item.parent_id === null);
        let parentIds = parentUrls.map((item: any) => item.id);
  
        // Children URLs without parent url present in the response
        const parentlessChildren = response.data.results.filter((item: any) => {
          if(item.parent_id !== null && !parentIds.includes(item.parent_id)) {
            return item;
          }
        });

        // Derived parents are fake parents that are created on the fly in order to group parentless children
        const derivedParentUrls: string[] = [];

        for(let i = 0; i < parentlessChildren.length; i++) {
          const item = parentlessChildren[i];
          const url = new URL(item.external_url);
          const origin = url.origin;
          if(!derivedParentUrls.includes(origin)) {
            derivedParentUrls.push(origin);
          }
        }

        urlsGroupedByDerivedParent  = derivedParentUrls.map((parent: any) => {
          const children = [...response.data.results.filter((item: any) => {
            const url = new URL(item.external_url);
            return url.origin === parent;
          })];
          const readyCount = children.filter((item: any) => item.sync_status === 'READY').length;
          const pendingCount = children.filter((item: any) => item.sync_status === 'QUEUED_FOR_SYNC').length;
          const errorCount = children.filter((item: any) => item.sync_status === 'SYNC_ERROR').length
          
          return {
            parent: parent,
            parentId: null,
            parentStatus: null,
            children,
            readyCount,
            pendingCount,
            errorCount
          }
        });

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

      // Merge derived parents with parents (Derived parents need to be placed first)
      urlsGroupedByParent = [...urlsGroupedByDerivedParent, ...urlsGroupedByParent];
      urlsTrained = urlsGroupedByParent;
      console.log('<Final>urlsTrained:', urlsTrained);

      //Retry
      hasQueuedFiles = response.data.results.some((item: any) => {
        return item.sync_status === 'QUEUED_FOR_SYNC'
      });

      console.log('Has queued files & will be attempted again --->', hasQueuedFiles);

      if (hasQueuedFiles && isModalOpen) {
        countdownFrom40();
        if(timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          offset = (currentPage - 1) * 250;
          fetchUserData(offset);
        }, 40000);
      } else {
        hasQueuedFiles = false;
      }

      //Placing current page reassignment here to improve timing, otherwise it will be too soon
      currentPage = Math.ceil(offset / 250) + 1;
      return response.data;

      } else {
        console.error('Error:', response.error);
      }
    } catch (err) {
      console.error('Unexpected error:', err.message);
    } 
  }

  async function submitWebScraping(urls: string[], recursionDepth: number = 10) {
    try {
      const maxPagesToScrape = $currentBot.settings.dataFunnelSettings?.webScraping?.maxPagesToScrape ? $currentBot.settings.dataFunnelSettings?.webScraping?.maxPagesToScrape : 1000;
      const chunkSize = $currentBot.settings.dataFunnelSettings?.webScraping?.chunkSize ? $currentBot.settings.dataFunnelSettings?.webScraping?.chunkSize : 400;
      const chunkOverlap = $currentBot.settings.dataFunnelSettings?.webScraping?.chunkOverlap ? $currentBot.settings.dataFunnelSettings?.webScraping?.chunkOverlap : 20;
      const enableAutoSync = $currentBot.settings.dataFunnelSettings?.webScraping?.enableAutoSync ? $currentBot.settings.dataFunnelSettings?.webScraping?.enableAutoSync : false;
      //@ts-ignore
      const response = await Carbon.submitScrapeRequest({
        accessToken: accessToken,
        urls: urls,
        recursionDepth: recursionDepth,
        maxPagesToScrape: maxPagesToScrape,
        chunkSize: chunkSize,
        chunkOverlap: chunkOverlap,
        skipEmbeddingGeneration: false,
        enableAutoSync: enableAutoSync,
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

      if (response.status === 200) {
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
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(() => {
      counter--;
      if (counter < 0) clearInterval(intervalId);
    }, 1000);
  }

</script>

<label for="web_scraping" class="btn bg-gradient-to-r from-slate-800 to-slate-900 hover:bg-slate-700 w-full h-1/6 modal-button shadow-lg shadow-zinc-400 hover:shadow-lg hover:shadow-stone-200 hover:-mt-1"> 
  <div class="bg-gradient-to-tr from-slate-300 to-slate-500 text-transparent bg-clip-text text-xl">
    + Web Scraping
  </div>
</label>

<input type="checkbox" id="web_scraping" class="modal-toggle" bind:checked={isModalOpen}>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="modal" on:click|self={()=>isModalOpen = false}>
  <div class="modal-box w-11/12 max-w-7xl h-screen bg-gradient-to-tr from-slate-500 to-slate-700 shadow-xl shadow-zinc-400 grow-button raise-button">
    <div class="flex flex-grow-0 items-center justify-between mx-8">
      <div class="flex flex-grow-0 items-center">
        <h3 class=" py-1 font-bold text-3xl rounded-xl text-zinc-400">Web Scraping</h3>
      </div>

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
          <button class="btn btn-secondary btn-sm my-auto" on:click|self={()=>isModalOpen = false}>
            Close
            <svg on:click|self={()=>isModalOpen = false} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>       
          </button>
        </form>
      </div>
    </div>

    {#if activeTab === 'submit'}
    <div class="flex flex-col justify-start m-6 gap-4 p-4 bg-slate-800 rounded-lg">
      <!-- URL Input-->
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
            <button class="btn btn-primary join-item w-40" type="submit" disabled={!baseUrl}>
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
      <!-- SITEMAP input-->
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
            <button class="btn btn-primary join-item w-40" type="submit" disabled={!sitemap}>
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

      {#if hasQueuedFiles && activeTab === 'trained'}
        <span class="text-slate-400 mx-8">Refreshing in <span class="font-bold text-primary">{counter}</span> seconds</span>
      {/if}

    <!-- MAIN CONTENT --> 
    <section class="w-full h-5/6 rounded-xl my-4 overflow-y-auto">
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
        <div id="{parentUrl.parentId}" class="my-6">
          <Accordian> 
            <div slot="title" class="items-center w-full">
              <div class="flex justify-between">
                <td class="flex items-center gap-2 text-primary">
                  {parentUrl.parent} 
                  {#if parentUrl.pendingCount > 0}
                    <span class="loading loading-spinner text-warning w-5"></span>
                  {/if}
                </td>
                <div class="mx-8 grid grid-cols-3 gap-2">
                  <td class="text-primary">
                    <button class="{parentUrl.readyCount > 0 ? 'badge-success badge-outline' : 'badge-neutral text-slate-600'} badge w-28 w-min-16 p-3">
                      Ready: {parentUrl.readyCount}
                    </button>
                  </td>
                  <td class="text-primary">
                    <div class="{parentUrl.pendingCount > 0 ? 'badge-warning badge-outline' : 'badge-neutral text-slate-600'} badge w-28 w-min-16 p-3">
                      Pending: {parentUrl.pendingCount}
                    </div>
                  </td>
                  <td class="text-primary">
                    <div class="{parentUrl.errorCount > 0 ? 'badge-error badge-outline' : 'badge-neutral text-slate-600'} badge w-28 w-min-16 p-3">
                      Error: {parentUrl.errorCount}
                    </div>
                  </td>
                </div>
              </div>
            </div>
            <div>

              <table class="table table-xs w-full">
                <thead>
                  <tr class="text-md font-bold text-secondary">
                    <th>Url</th>
                    <th>Status</th>
                    <th>Id</th>
                  </tr>
                </thead>
                <tbody>
                  {#each parentUrl.children as childUrl}
                  <tr id={childUrl.id} class="p-.05">
                    <td class="text-primary w-1/2 overflow-x-auto"> <a class="hover:underline" href="{childUrl.external_url}" target="_blank">{childUrl.external_url}</a></td>
                    {#if childUrl.sync_status === 'READY'}
                    <td class="text-primary">
                      <div class="badge badge-success badge-outline w-20">
                        Ready
                      </div>
                    </td>
                    {:else if childUrl.sync_status === 'QUEUED_FOR_SYNC'}
                    <td class="text-primary">
                      <div class="badge badge-warning badge-outline w-20">
                        Pending
                      </div>
                    </td>
                    {:else if childUrl.sync_status === 'SYNC_ERROR'}
                    <td class="text-primary">
                      <div class="badge badge-error badge-outline w-20">
                        Error
                      </div>
                    </td>
                    {/if}
                    <td class="text-slate-400 font-semibold"> {childUrl.id} </td>
                    <td>
                      <button class="btn btn-secondary btn-sm" 
                      
                        disabled={(childUrl.id === parentUrl.parentId && parentUrl.children.length !== 1)}
                      
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
    {/if}
    </section>
    {#if numberOfPages > 1}
    <div class="flex justify-center gap-2">
      {#each pagesArray as number}
        <button class="btn btn-sm {currentPage === number ? 'btn-indigo-600' : 'btn-secondary'}" on:click={() => {
          const offset = (number - 1) * 250;
          fetchUserData(offset);
        }}>{number}</button>
      {/each}
    </div>
  {/if}
  </div>
</div>