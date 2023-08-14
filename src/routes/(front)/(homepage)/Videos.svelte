<script>
	import { fade } from 'svelte/transition';


	let activeTab = 0;
	let videoEnded = false;

	$: if (videoEnded == true) {
		if (activeTab == 2) activeTab = 0;
		else activeTab++;
		videoEnded = false;
	}
</script>

<section class="bg-black animated-gradent-bg flex items-center justify-center p-14">
	<div class="max-w-5xl">
		<div class="flex gap-2 mb-2">
			<button
				class="btn btn-wide btn-primary {activeTab == 0 ? 'active' : 'btn-outline'}"
				on:click={() => (activeTab = 0)}>Overview</button
			>
			<button
				class="btn btn-wide btn-primary {activeTab == 1 ? 'active' : 'btn-outline'}"
				on:click={() => (activeTab = 1)}>Train</button
			>
			<button
				class="btn btn-wide btn-primary {activeTab == 2 ? 'active' : 'btn-outline'}"
				on:click={() => (activeTab = 2)}>Embed</button
			>
		</div>
		<div>
			{#if activeTab === 0}
				<video
					controls
					width="1792"
					height="1080"
					class="shadow-2xl rounded-md"
					autoplay
					muted
					in:fade
					bind:ended={videoEnded}
				>
					<source src="/Long demo.mp4" type="video/mp4" />
					Your browser does not support the video tag.
				</video>
			{:else if activeTab === 1}
				<video
					controls
					width="1792"
					height="1080"
					class="rounded-md"
					autoplay
					muted
					in:fade
					bind:ended={videoEnded}
				>
					<source src="/Long demo.mp4" type="video/mp4" />
					Your browser does not support the video tag.
				</video>
				<div class="p-10 text-primary-content text-center">
					<h2 class="text-2xl font-bold mb-4">
						Simple and fast scraping of entire websites, huge pdfs or simple custom text.
					</h2>
					<!-- <p class="text-lg">
						Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero, quisquam magni quos
						deserunt quasi nesciunt. Sit asperiores similique explicabo voluptatem minus illo commodi
						temporibus error harum nesciunt. Deserunt, vero dolorem.
					</p> -->
				</div>
			{:else if activeTab === 2}
				<video
					controls
					width="1792"
					height="1080"
					class="rounded-md"
					autoplay
					muted
					in:fade
					bind:ended={videoEnded}
				>
					<source src="/Long demo.mp4" type="video/mp4" />
					Your browser does not support the video tag.
				</video>
				<div class="p-10 text-primary-content text-center max-w-[70ch] mx-auto">
					<h2 class="text-2xl font-bold mb-4">
						Once your bot has all the answers, deploy it on your website, share a url or integrate
						it with Slack
					</h2>
					<!-- <p class="text-lg">
						Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero, quisquam magni quos
						deserunt quasi nesciunt. Sit asperiores similique explicabo voluptatem minus illo commodi
						temporibus error harum nesciunt. Deserunt, vero dolorem.
					</p> -->
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
		.animated-gradent-bg {
		background: linear-gradient(-45deg, #0e1729, #19b4f7, #0c1222, #818cf8);
		background-size: 400% 400%;
		animation: gradient 15s ease infinite;
	}

	@keyframes gradient {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
			background-size: 600% 600%;
		}
		100% {
			background-position: 0% 50%;
		}
	}
</style>