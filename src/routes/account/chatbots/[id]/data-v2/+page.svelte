<script lang="ts">
	import { PUBLIC_CHAT_API_URL } from '$env/static/public';
	import { alert, currentBot } from '$lib/stores.js';
	import { onMount } from 'svelte';
	import { PUBLIC_EMBED_URL } from '$env/static/public';
	import WebScraping from '$lib/components/data/WebScraping.svelte';
	import Files from '$lib/components/data/Files.svelte';
	import Text from '$lib/components/data/Text.svelte';
	import * as Carbon from 'carbon-connect-js';

	export let data;

  const carbonAPIKey = 'dc14fce440672b41417705d036cf5181d8df1b849c58c6e2c56e3dac1df66366';
	let accessToken: string;
	let status = '';

	async function fetchAccessToken() {
    try {
      const response = await Carbon.generateAccessToken({
        apiKey: carbonAPIKey,
        customerId: $currentBot.id,
      });

      if (response.status === 200) {
        console.log('Access token:', response.data);
        accessToken = response.data.access_token; 
      } else {
        console.error('Error:', response.error);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  }

  onMount(async () => {
  	fetchAccessToken();
  });
</script>

<svelte:head>
	<title>Data v2 | {data.model.name} | ChatNode</title>
</svelte:head>

<div class="container grid md:grid-cols-3 lg:grid-cols-[auto_32rem] gap-4 my-4">
	<div class="grid grid-cols-3 gap-8 my-4">
		<WebScraping {accessToken}/>
		<Files {accessToken}/>
		<Text {accessToken}/>
	</div>
	<div>
		<div
			class="h-[calc(100vh_-_16rem)] sticky top-4 mb-10 hidden sm:block rounded-2xl overflow-hidden"
		>
		<iframe class="w-full h-full" src="{PUBLIC_EMBED_URL}/{$currentBot.id}" frameborder="0" title=""></iframe>
		</div>
	</div>
</div>