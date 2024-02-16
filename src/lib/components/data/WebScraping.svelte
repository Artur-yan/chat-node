<script lang="ts">
  import * as Carbon from 'carbon-connect-js';
  export let accessToken: string;

  // state
	let isModalOpen = false;
  let activeTab: 'to-be-trained' | 'training' | 'trained' = 'trained';
  let isFetching = false;

  let baseUrl = '';
  let sitemap = '';

  let urlsToBeTrained: string[] | [] = [];  
  let urlsApproved: string[] | [] = [];
  let urlsInTraining: string[] | [] = [];
  export let urlsTrained: string[] | [] = [];

  $: console.log(urlsTrained, 'xxxx')


  if(isModalOpen) {
    fetchTrainedData();
  }

  async function fetchTrainedData() {
    const params = {
    accessToken: accessToken,
    limit: 5, 
    sourceType: 'web'
  };

  async function watchForStatuses() {
    if(urlsInTraining.length > 0) {
      
    } else {
      watchForStatuses
    }
  }

  try {
    const response = await Carbon.getUserDataSources(params);

    if (response.status === 200) {
      console.log('User data sources data:', response.data);
    } else {
      console.error('Error:', response.error);
    }
  } catch (err) {
    console.error(
      'Unexpected error during user data sources fetch:',
      err.message
    );
  }
  }



  async function initiateScraping() {
    console.log('Urls to scrape:', urlsInTraining);
    try {
      //@ts-ignore
      const response = await Carbon.submitScrapeRequest({
        accessToken: accessToken,
        urls: urlsInTraining,
        recursionDepth: 1,
        maxPagesToScrape: 5000,
      });

      if (response?.status === 200) {
        console.log('Scraping result:', response.data.files);
      } else {
        console.error('Error:', response.error);
      }
    } catch (err) {
      console.error('Unexpected error:', err.message);
    } finally {
      console.log('Scraping completed');
    }
  }

  async function fetchUrls() {
    urlsToBeTrained = [];
    urlsApproved = [];

    isFetching = true;
    console.log(baseUrl);
    activeTab = 'to-be-trained';


    const params = {
      accessToken: accessToken,
      url: baseUrl,
    };

    try {
      const response = await Carbon.fetchUrls(params);

      if (response.status === 200) {
        console.log('Fetched URLs successfully:', response.data.urls);
        urlsToBeTrained = response.data.urls;
        urlsApproved = response.data.urls;
        return response.data.urls;
      } else {
        console.error('Error:', response.error);
      }
    } catch (err) {
      console.error('Unexpected error fetching URLs:', err.message);
    } finally {
      isFetching = false;
    }
  }

  async function fetchSitemapUrls() {
    try {
      const response = await Carbon.handleFetchSitemapUrls({
        accessToken: accessToken,
        sitemapUrl: sitemap,
      });

      if (response.status === 200) {
        console.log('Retrieved URLs:', response.data.urls);
        console.log('Total URLs:', response.data.count);
      } else {
        console.error('Error:', response.error);
      }
    } catch (err) {
      console.error('Unexpected error:', err.message);
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
      <h3 class="font-bold text-xl">Web Scraping</h3>

      <!-- tabs -->
      <div class="flex">
        <div class="tabs tabs-boxed gap-2">
            <button
              class="tab"
              on:click={() => activeTab = 'to-be-trained'}
              class:tab-active={activeTab === 'to-be-trained'}
            >
              To be Trained
            </button>

            <button
              class="tab"
              on:click={() => activeTab = 'training'}
              class:tab-active={activeTab === 'training'}
            >
              Training
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

    <div class="flex flex-col justify-start m-6 gap-4">
      <!-- URL -->
      <form on:submit|preventDefault={() => fetchUrls()}>
        <div class="form-control">
          <div class="join">
            <input
              type="text"
              class="input input-bordered w-full join-item placeholder:text-sm"
              bind:value={baseUrl}
              placeholder="e.g. https://chatnode.ai https://chatnode.ai/sitemap.xml"
              required
              autofocus
            />
            <button class="btn btn-primary join-item w-40" type="submit">
              {#if isFetching}
                <span class="loading loading-spinner loading-sm"></span>
              {:else}
                Fetch URLs
              {/if}
            </button>
          </div>
        </div>
      </form>
    </div>
    <section class="w-full h-5/6rounded-xl my-4 overflow-auto">
      {#if activeTab === 'to-be-trained'}
        {#if isFetching}
        <div class="flex flex-col items-center justify-center h-full">
          <p class="text-2xl text-gray-300">Enter a URL or Sitemap to fetch trainable urls.</p>
        </div>
        {:else}
          <div class="overflow-x-auto">
            <table class="table table-xs">
              <!-- head -->
              <thead>
                <tr>
                  <th></th>
                  <th>url</th>
                  <th>Scrape</th>
                </tr>
              </thead>
              <tbody>
                {#each urlsToBeTrained as url, i}
                  <tr class="p-.05">
                    <th>{i}</th>
                    <td>{url}</td>
                    <td>
                      <input 
                        type="checkbox" 
                        class="toggle toggle-sm" 
                        on:click={(el) => urlsApproved = urlsApproved.filter((u) => u !== url)}
                        checked 
                      />
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      {/if}

      {#if activeTab === 'training'}
        {#if urlsInTraining.length === 0}
          <div class="flex flex-col items-center justify-center h-full">
            <p class="text-2xl text-gray-300">No URLs in training</p>
          </div>
        {:else}
        <table class="table table-xs">
          <thead>
            <tr>
              <th></th>
              <th>url</th>
              <th>status</th>
            </tr>
          </thead>
          <tbody>
            {#each urlsInTraining as url, i}
              <tr class="p-.05">
                <th>{i}</th>
                <td>{url}</td>
                <td>training</td>
              </tr>
            {/each}
          </tbody>
        </table>
        {/if}
      {/if}

      {#if activeTab === 'trained'}
      <div class="overflow-x-auto">
        <table class="table table-xs">
          <!-- head -->
          <thead>
            <tr>
              <th></th>
              <th>URL</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {#each urlsTrained as url, i}
              <tr class="p-.05">
                <th>{i}</th>
                <td>{url.external_url}</td>
                <td>
                  <div class="badge badge-primary badge-outline">Trained</div>
                </td>
                <td>
                  <button class="btn btn-sm">
                    Remove
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      {/if}

      {#if activeTab === 'to-be-trained' && !isFetching && urlsToBeTrained.length > 0}
        <div class="flex">
          <button class="btn btn-primary" on:click={() => {
              activeTab = 'training';
              urlsInTraining = urlsApproved;
              urlsToBeTrained = [];
              initiateScraping();
            }}
            >
            Train Bot
          </button>
        </div>
      {/if}
    </section>
  </div>
</div>