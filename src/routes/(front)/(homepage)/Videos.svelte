<script>
	import { fade } from 'svelte/transition';

	let activeTab = 0;
	const videoEnded = () => {
		if (activeTab == 2) activeTab = 0;
		else activeTab++;
	};

	const ytOptions = { playerVars: { autoplay: 1, color: 'white' } };
</script>

<section class="animated-gradent-bg flex items-center justify-center md:p-14">
	<div class="w-full max-w-5xl">
		<div
			class="w-full flex max-md:!rounded-none !justify-stretch max-md:join md:gap-2 md:mb-2 overflow-x-auto"
		>
			<button
				class="btn join-item btn-primary {activeTab == 0 ? 'active' : 'btn-outline'}"
				on:click={() => (activeTab = 0)}
			>
				Overview
			</button>
			<button
				class="btn join-item btn-primary {activeTab == 1 ? 'active' : 'btn-outline'}"
				on:click={() => (activeTab = 1)}
			>
				Embed
			</button>
			<button
				class="btn join-item btn-primary {activeTab == 2 ? 'active' : 'btn-outline'}"
				on:click={() => (activeTab = 2)}
			>
				Personal OpenAI API Key
			</button>
		</div>
		<div>
			{#if activeTab === 0}
			<video controls="controls" height="1194" width="720" in:fade>
				<source src="ChatNode Demo.mp4" type="video/mp4" />
			</video>
			{:else if activeTab === 1}
				<video controls="controls" height="1144" width="720" in:fade>
					<source src="Embed an AI chatbot on your website.mp4" type="video/mp4" />
				</video>
				{:else if activeTab === 2}
				<video controls="controls" height="1144" width="720" in:fade>
					<source src="Use your own OpenAI API key.mp4" type="video/mp4" />
				</video>
			{/if}
		</div>
	</div>
</section>

<style lang="postcss">
	.animated-gradent-bg {
		background: linear-gradient(-45deg, #0e1729, #19b4f7, #0c1222, #818cf8);
		background-size: 400% 400%;
		/* animation: gradient 15s ease infinite; */
	}

	video {
		@apply md:rounded-lg w-full;
	}

	/* @keyframes gradient {
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
	} */
</style>
