<script lang="ts">
	import { Splide, SplideSlide, SplideTrack } from '@splidejs/svelte-splide';
	import '@splidejs/svelte-splide/css/core';

	export let testimonials: Array<Object>;
</script>

<section class="py-10 overflow-hidden">
	<h2 class="text-3xl font-bold text-center mb-8">Reviews</h2>
	{#await testimonials then testimonials}
		<Splide
			aria-label="Testimonials"
			hasTrack={false}
			options={{
				gap: '2em',
				perPage: 2,
				type: 'loop',
				breakpoints: {
					'960': {
						perPage: 1
					}
				}
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
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="16"
												height="16"
												viewBox="0 0 24 24"
											>
												<path
													fill="currentColor"
													d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z"
												/>
											</svg>
										{/each}
									</div>
									<img src="/AppSumo-logo.svg" class="" alt="AppSumo" width="64" height="10" />
								</div>
								<h3 class="card-title my-4 text-white">{testimonial.title}</h3>
								<div
									class="leading-[1.5em] font-light"
									style="font-size: {16 + Math.max(0, 800 - testimonial.body.length) * 0.02}px"
								>
									{testimonial.body}
								</div>
							</div>
							{#if testimonial.url}
								<div class="flex self-end px-4 pb-2">
									<a href={testimonial.url} class="btn btn-xs btn-primary btn-outline">View →</a>
								</div>
							{/if}
						</div>
					</SplideSlide>
				{/each}
			</SplideTrack>
			<div class="splide__arrows justify-end flex gap-4 mt-4">
				<button class="btn btn-primary btn-circle text-lg splide__arrow splide__arrow--prev">
					←
				</button>
				<button class="btn btn-circle btn-primary text-lg splide__arrow splide__arrow--next">
					→
				</button>
			</div>
		</Splide>
	{/await}
</section>
