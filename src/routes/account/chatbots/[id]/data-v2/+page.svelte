<script lang="ts">
	import { currentBot } from '$lib/stores.js';
	import { onMount } from 'svelte';
	import { PUBLIC_EMBED_URL } from '$env/static/public';
	import WebScraping from '$lib/components/data/WebScraping.svelte';
	import Files from '$lib/components/data/Files.svelte';
	import Text from '$lib/components/data/Text.svelte';
	import Notion from '$lib/components/data/Notion.svelte';
	import GoogleDrive from '$lib/components/data/GoogleDrive.svelte';
	import tiersMap from '$lib/data/tiers.js';

	export let data;

  let totalFileCount:number;

  async function fetchTotalFileCount() {
    try {
      const response = await fetch('/api/data-sources/total-file-count', {
        method: 'POST',
        body: JSON.stringify({
          customerId: $currentBot.id,
        })
      });

      const data = await response.json();
      totalFileCount = data?.count || 0;

      if (response?.status === 200) {
        return data?.count || 0
      } else {
        console.error('Error:', response.error);
      }
    } catch (err) {
      console.error('Unexpected error:', (err as Error).message);
    }
  }

  onMount(async () => {
    await fetchTotalFileCount();
  });

</script>

<svelte:head>
	<title>Data v2 | {data.model.name} | ChatNode</title>
</svelte:head>

<div class="container grid md:grid-cols-2 lg:grid-cols-[auto_32rem] gap-4 my-4">
	<div class="grid grid-cols-3 gap-6 my-4 max-h-[200px]">
		<WebScraping/>
		<Files {totalFileCount} credentials={data.cred}/>
		<Text {totalFileCount}/>
    {#if tiersMap[data.subscription.plan].features.notion?.included}
      <Notion {totalFileCount} />  
      <!-- <GoogleDrive {totalFileCount} />  -->
    {/if}
	</div>
	<div>
		<div
			class="h-[calc(100vh_-_16rem)] sticky top-4 mb-10 hidden sm:block rounded-2xl overflow-hidden"
		>
		  <iframe class="w-full h-full" src="{PUBLIC_EMBED_URL}/{$currentBot.id}" allow="autoplay; clipboard-read; clipboard-write" frameborder="0" title=""></iframe>
		</div>
	</div>
</div>