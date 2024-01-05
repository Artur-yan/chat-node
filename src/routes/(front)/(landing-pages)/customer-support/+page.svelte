<script lang="ts">
	import PricingGrid from '$lib/components/PricingGrid.svelte';
	import Features from './Features.svelte';
	import Hero from './Hero.svelte';
	import Videos from './Videos.svelte';
	import ShowCase from './ShowCase.svelte';
	import PopupCallout from './PopupCallout.svelte';
	import Testimonials from '$lib/components/Testimonials.svelte';
	import { PUBLIC_EMBED_URL, PUBLIC_SITE_URL, PUBLIC_BOT_ID } from "$env/static/public";

	export let data;
	const { testimonials } = data.streamed;
	export let image_meta_link = `${PUBLIC_SITE_URL}/landing_page_customer_support.png`
	export let landing_page = `${PUBLIC_SITE_URL}`


</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>ChatNode | AI customer support assistant for Startup</title>
  <meta property="twitter:image" content={image_meta_link}>
	<meta property="twitter:card" 				content="Create the best customer support experience on your website thanks to AI. Never lose a client again because you didn't reply in time."
	/>
	<meta property="twitter:title" content="ChatNode | AI Customer Support for Startup">
	<meta property="twitter:description"
				content="Create the best customer support experience on your website thanks to AI. Never lose a client again because you didn't reply in time."
	/>

	<meta
		name="description"
		content="Create the best customer support experience on your website thanks to AI. Never lose a client again because you didn't reply in time."
	/>
	<meta property="og:image" content={image_meta_link}>
	<meta property="og:image:width" content="1200">
	<meta property="og:image:height" content="630">
	<meta property="og:title" content="ChatNode | AI Customer Support for Startup">
	<meta property="og:description"
				content="Create the best customer support experience on your website thanks to AI. Never lose a client again because you didn't reply in time."
	/>
	<meta property="og:url" content={landing_page}>

<!--	<script-->
<!--		src="https://www.chatnode.ai/embed.js"-->
<!--		data-chatbot-id="befbfc87e25911db"-->
<!--		data-color-1="#0E1729"-->
<!--		data-color-2="#3ABFF7"-->
<!--	></script>-->
<!--	<script src="https://embed.chatnode.ai/befbfc87e25911db/popup.js"></script>-->
	{@html `<script src="${PUBLIC_EMBED_URL}/${PUBLIC_BOT_ID}/popup.js"></script>`}

</svelte:head>

<Hero />

<div class="mx-3">
	<Videos />
</div>
<div id="features" />
<!--<ShowCase />-->

<Testimonials {testimonials} />

<Features />

<section id="pricing" class="bg-base-300py py-10 lg:py-20">
	<div class="container">
		<h2 class="text-center font-bold text-3xl">Pricing</h2>
		<PricingGrid />
	</div>
</section>

<PopupCallout />

<!-- <div class="alert alert-info fixed bottom-24 max-w-[24rem] right-5 leading-7 text-center z-10">Ask me something about ChatNode! You can have a chat bot just like this on your website.</div> -->

<style lang="postcss">
	#how-it-works {
		@apply text-lg 2xl:text-2xl;
	}

	#how-it-works h3 {
		@apply text-3xl md:text-4xl 2xl:text-5xl font-bold mb-10;
	}
	#how-it-works h4 {
		@apply text-xl 2xl:text-3xl font-bold mt-6 mb-1 2xl:mb-4;
	}
	#how-it-works p {
		@apply mb-5 2xl:mb-12;
	}
</style>
