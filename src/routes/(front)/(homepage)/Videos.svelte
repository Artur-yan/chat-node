<script>
	import { fade } from 'svelte/transition';


	let activeTab = 0;
	const videoEnded = () => {
		if (activeTab == 2) activeTab = 0;
		else activeTab++;
	}

	const ytOptions = {playerVars: {autoplay: 1, color: 'white'}}
</script>

<section class="bg-black animated-gradent-bg flex items-center justify-center p-14">
	<div class="max-w-5xl">
		<div class="flex flex-wrap gap-2 mb-2">
			<button
				class="btn btn-wide btn-primary {activeTab == 0 ? 'active' : 'btn-outline'}"
				on:click={() => (activeTab = 0)}>Overview</button
			>
			<button
				class="btn btn-wide btn-primary {activeTab == 1 ? 'active' : 'btn-outline'}"
				on:click={() => (activeTab = 1)}>Embed</button
			>
			<button
				class="btn btn-wide btn-primary {activeTab == 2 ? 'active' : 'btn-outline'}"
				on:click={() => (activeTab = 2)}>GPT API Key</button
			>
		</div>
		<div>
			{#if activeTab === 0}
				<iframe width="560" height="315" class="w-full h-auto aspect-video" src="https://www.youtube.com/embed/htCr57TlMnk?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen in:fade></iframe>
			{:else if activeTab === 1}
				<iframe width="560" height="315" class="w-full h-auto aspect-video" src="https://www.youtube.com/embed/53BMrkB82Bc?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen in:fade></iframe>
			{:else if activeTab === 2}
				<iframe width="560" height="315" class="w-full h-auto aspect-video" src="https://www.youtube.com/embed/vsHybuETz9E?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen in:fade></iframe>
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