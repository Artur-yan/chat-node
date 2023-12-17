<script lang="ts">
	import PricingGrid from '$lib/components/PricingGrid.svelte';
	import Features from './Features.svelte';
	import Hero from './Hero.svelte';
	import Videos from './Videos.svelte';
	import UseCases from './UseCases.svelte';
	import WaysToShare from './WaysToShare.svelte';
	import PopupCallout from './PopupCallout.svelte';
	import Testimonials from '$lib/components/Testimonials.svelte';
	import { PUBLIC_SITE_URL } from '$env/static/public';

	export let data;

	const { testimonials } = data.streamed;
	export let image_meta_link = `${PUBLIC_SITE_URL}/landing_page_traing_gpt.png`
	export let landing_page = `${PUBLIC_SITE_URL}`

</script>

<svelte:head>
	<title>ChatNode | Train ChatGPT on your data</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
  <meta property="twitter:image" content={image_meta_link}>
	<meta property="twitter:card"
				content="Build your own AI assistant for your website or create an internal research tool by training ChatGPT on any data you'd like." :>
	<meta property="twitter:title" content="ChatNode | Train ChatGPT on your data">
	<meta property="twitter:description"
		content="Build your own AI assistant for your website or create an internal research tool by training ChatGPT on any data you'd like."
	/>

	<meta
		name="description"
		content="Build your own AI assistant for your website or create an internal research tool by training ChatGPT on any data you'd like."
	/>
	<meta property="og:image" content={image_meta_link}>
	<meta property="og:image:width" content="1200">
	<meta property="og:image:height" content="630">
	<meta property="og:title" content="ChatNode | Train ChatGPT on your data">
	<meta property="og:description"
		content="Build your own AI assistant for your website or create an internal research tool by training ChatGPT on any data you'd like."
	/>
	<meta property="og:url" content={landing_page}>

	<script
		src="https://www.chatnode.ai/embed.js"
		data-chatbot-id="befbfc87e25911db"
		data-color-1="#0E1729"
		data-color-2="#3ABFF7"
	></script>
</svelte:head>

<Hero />

<div id="features" />
<Videos />

<UseCases />

<WaysToShare />

<Features />

<Testimonials {testimonials} />

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
