<script lang="ts">
	import PricingGrid from '$lib/components/PricingGrid.svelte';
	import Features from './Features.svelte';
	import Hero from './Hero.svelte';
	import Videos from './Videos.svelte';
	import UseCases from './UseCases.svelte';
	import WaysToShare from './WaysToShare.svelte';
	import PopupCallout from './PopupCallout.svelte';
	import { Splide, SplideSlide, SplideTrack } from '@splidejs/svelte-splide';
	import '@splidejs/svelte-splide/css/core';

	export let data

	const { testimonials } = data.streamed


	$: console.log(testimonials)
</script>

<svelte:head>
	<title>ChatNode | Train ChatGPT on your data</title>
	<meta
		name="description"
		content="Build your own AI assistant for your website or create an internal research tool by training ChatGPT on any data you'd like."
	/>
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

<section class="py-10 overflow-hidden">
	<h2 class="text-3xl font-bold text-center mb-8">Testimonials</h2>
	{#await testimonials then testimonials}

	<Splide aria-label="Testimonials"
		hasTrack={false}
		options={{
			gap: '2em',
			perPage: 3,
			autoplay: true,
			type: 'loop',
	
		}}
		class="overflow-visible container"
	>
		<SplideTrack class="!overflow-visible">
			{#each testimonials as testimonial}
				<SplideSlide>
					<div class="card bg-neutral h-full">
						<div class="card-body">
							<div class="flex justify-between items-center">
								<div class="flex gap-1 text-accent">
									{#each Array(5) as _}
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z"/></svg>
									{/each}
								</div>
								<img src='/AppSumo-logo.svg' class="" alt="AppSumo" width="64" height="10">
							</div>
							<h3 class="card-title my-4 text-white">{testimonial.title}</h3>
							<div class="leading-[1.5em] font-light" style="font-size: {16 + (Math.max(0, 800 - testimonial.body.length)) * 0.02}px">{testimonial.body}</div>
							{testimonial.body.length}
						</div>
						{#if testimonial.url}
						<div class="flex self-end p-4">
							<a href={testimonial.url} class="btn btn-xs btn-primary btn-outline">View →</a>
						</div>
						{/if}
					</div>
				</SplideSlide>
			{/each}
		</SplideTrack>
		<div class="splide__arrows justify-end flex gap-4 mt-4">
			<button class="btn btn-primary btn-circle text-lg splide__arrow splide__arrow--prev">←</button>
			<button class="btn btn-circle btn-primary text-lg splide__arrow splide__arrow--next">→</button>
		  </div>
	</Splide>
	{/await}
</section>

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
