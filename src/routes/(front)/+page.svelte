<script lang="ts">
	import Chat from '$lib/components/Chat.svelte';
	import PricingGrid from '$lib/components/PricingGrid.svelte';
	import Features from '$lib/components/Features.svelte';
	import { fade } from 'svelte/transition';
	import MorphingText from '$lib/components/MorphingText.svelte';

	let isThinking = false;
	let messages = [
		{
			text: 'Hi, how can I help you?',
			sender: 'bot'
		}
	];
	let activeTab = 0;

	const demoChat = async () => {
		await new Promise((r) => setTimeout(r, 1000));
		messages = [
			...messages,
			{
				text: 'I want to build a chat bot.',
				sender: 'user'
			}
		];
		isThinking = true;
		await new Promise((r) => setTimeout(r, 1500));
		messages = [
			...messages,
			{
				text: 'Great! ChatNode is an AI chatbot builder that can help you create a chatbot. You can train ChatGPT on your own data, such as websites, PDFs, docs, or text, and add a chat widget to your website. ChatNode offers different pricing plans, including a free plan that allows you to test it out.',
				sender: 'bot'
			}
		];
	};

	let arrow: HTMLDivElement;
	let outerHeight: number;
	let outerWidth: number;
	let scrollY: number;

	let trigO: number;
	let trigA: number;
	let arrowRotation: number;

	const trig = () => {
		const arrowPosition = arrow.getBoundingClientRect();
		const trigO = outerHeight - (arrowPosition.top + arrow.offsetHeight / 2) - 52;
		const trigA = outerWidth - (arrowPosition.left + arrow.offsetWidth / 2) - 52;
		const theta = Math.atan(trigO / trigA);

		console.log(outerHeight);
		arrowRotation = theta;
	};

	demoChat();
</script>

<svelte:head>
	<title>ChatNode | Train ChatGPT on your data</title>
	<meta
		name="description"
		content="Build your own AI assistant for your website or create an internal research tool by training ChatGPT on any data you'd like."
	/>
	<link rel="“canonical”" href="https://www.chatnode.ai" />
</svelte:head>

<svelte:window bind:scrollY bind:outerHeight bind:outerWidth on:scroll={trig} />

<section>
	<div class="grid container lg:grid-cols-2 items-center gap-8 mx-auto min-h-[80vh]">
		<div class="max-lg:text-center">
			<h2
				class="mt-6 mb-6 w-[11ch] text-5xl lg:text-7xl 2xl:text-8xl tracking-tight font-extrabold text-secondary max-w-[8em] max-lg:mx-auto"
			>
				Train ChatGPT on your data
			</h2>

			<div class="text-3xl font-bold max-w-[24ch] leading-10"><spa class="mr-2">Build a chatbot to answer any queries on your</spa> <MorphingText /></div>

			<div class="flex items-center max-lg:justify-center">
				<div class="mt-20 flex gap-4">
					<a href="/register" class="btn btn-primary btn-lg -ml-1">Create your free chatbot</a>
				</div>
			</div>
			<p class="text-sm mt-2">No credit card required</p>
		</div>
		<div>
			<div
				class="mockup-window border-4 border-secondary bg-base-100 max-w-4xl mx-auto relative overflow-visible"
			>
				<div class="absolute bottom-20 left-6 z-10" hidden={messages.length > 3}>
					<div class="join">

						<div class="join-item badge badge-accent badge-lg rounded-b-none font-bold ml-2">Try Me</div>
						<span class="join-item badge badge-lg badge-outline border-accent bg-black font-bold text-xs">I'm trained on ChatNode</span>
					</div>
				</div>
				<div class="flex justify-center p-4 pt-0 h-[50vh] border-t border-base-300">
					<div class="w-full">
						<Chat
							modelId="befbfc87e25911db"
							bind:messages
							avatar="https://res.cloudinary.com/duoacapcy/image/upload/v1687011043/ChatNode-Logo-Avatar_fdyalc.svg"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="bg-black animated-gradent-bg min-h-screen flex justify-center items-center">
	<video controls width="1792" height="1080" class="max-w-5xl shadow-2xl rounded-md" autoplay muted>
		<source src="/Long demo.mp4" type="video/mp4" />
		Your browser does not support the video tag.
	</video>
</section>

<section id="feature-vids" class="container py-8">
	<div class="grid grid-cols-2 gap-2">
		<button
			class="btn h-20 text-xl btn-primary {activeTab == 0 ? 'active' : 'btn-outline'}"
			on:click={() => (activeTab = 0)}>Train</button
		>
		<button
			class="btn h-20 text-xl btn-secondary {activeTab == 1 ? 'active' : 'btn-outline'}"
			on:click={() => (activeTab = 1)}>Integrate</button
		>
	</div>
	<div
		class="grid grid-cols-[auto_32rem] gap-4 mt-4 {activeTab == 0
			? 'bg-primary'
			: 'bg-secondary'} p-6 rounded-md transition-colors duration-1000"
	>
		{#if activeTab === 0}
			<video controls width="1792" height="1080" class="rounded-md" autoplay muted in:fade>
				<source src="/Long demo.mp4" type="video/mp4" />
				Your browser does not support the video tag.
			</video>
			<div class="p-10 text-primary-content rounded-md bg-white/50">
				<h2 class="text-2xl font-bold mb-4">
					Simple and fast scraping of entire websites, huge pdfs or simple custom text.
				</h2>
				<p class="text-lg">
					Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero, quisquam magni quos
					deserunt quasi nesciunt. Sit asperiores similique explicabo voluptatem minus illo commodi
					temporibus error harum nesciunt. Deserunt, vero dolorem.
				</p>
			</div>
		{/if}
		{#if activeTab === 1}
			<video controls width="1792" height="1080" class="rounded-md" autoplay muted in:fade>
				<source src="/Long demo.mp4" type="video/mp4" />
				Your browser does not support the video tag.
			</video>
			<div class="p-10 text-primary-content rounded-md bg-white/50">
				<h2 class="text-2xl font-bold mb-4">
					Once your bot has all the answers, deploy it on your website, share a url or integrate it
					with Slack
				</h2>
				<p class="text-lg">
					Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero, quisquam magni quos
					deserunt quasi nesciunt. Sit asperiores similique explicabo voluptatem minus illo commodi
					temporibus error harum nesciunt. Deserunt, vero dolorem.
				</p>
			</div>
		{/if}
	</div>
</section>

<section class="py-20 container !max-w-7xl">
	<div class="flex justify-center">
		<h2 class="font-bold text-3xl relative py-4 px-8">
			<div class="dot-corners">
				<div />
				<div />
			</div>
			Ways to Share
		</h2>
	</div>

	<div class="grid md:grid-cols-2 divide-x divide-neutral my-10">
		<div class="px-6 text-center">
			<div class="mockup-window bg-neutral shadow-lg p-4 pb-8">
				<h3 class="font-bold mb-4">Embed</h3>
				<div class="inline-block h-4 w-24 bg-base-100 rounded-full mx-auto mb-3" />
				<div class="inline-block h-4 w-16 bg-base-100 rounded-full mx-auto mb-3" />
				<div class="p-2 bg-base-200 border-primary/50 rounded-lg border mx-8">
					<div>
						<div class="chat chat-start">
							<div class="chat-bubble w-48" />
						</div>
						<div class="chat chat-end">
							<div class="chat-bubble w-32" />
						</div>
					</div>
				</div>
				<div class="h-2 w-64 bg-base-100 rounded-full mx-auto mt-6 my-2" />
				<div class="h-2 w-56 bg-base-100 rounded-full mx-auto my-2" />
			</div>
		</div>

		<div class="text-center flex flex-col px-6" onclick="toggleChat()">
			<div class="mockup-window relative bg-neutral shadow-lg p-4 h-full">
				<h3 class="font-bold mb-4">Popup Chat</h3>
				<div
					bind:this={arrow}
					class="absolute w-12 left-1/4 top-1/2 flex items-center justify-center aspect-square text-4xl text-primary"
					style="transform: rotate({arrowRotation}rad);"
				>
					&rarr;
					<div
						class="absolute top-0 left-0 radial-progress text-primary/50"
						style="--size: 3rem; --value: 30; --thickness: 2px; transform: rotate({arrowRotation *
							15}rad);"
					/>
				</div>

				<div class="absolute bottom-4 right-4">
					<div class="max-w-xs">
						<div class="p-2 bg-base-200 border-primary/50 rounded-lg border">
							<div>
								<div class="chat chat-start">
									<div class="chat-bubble w-48" />
								</div>
								<div class="chat chat-end">
									<div class="chat-bubble w-32" />
								</div>
							</div>
						</div>
						<div class="flex items-center justify-end mt-2">
							<div role="button" style="outline: 0; border: none; width:32px; height: 32px;">
								<svg class="fill-primary" clip-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" version="1.1" viewBox="0 0 64 64" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g><path d="m0 32c0-17.673 14.327-32 32-32s32 14.327 32 32-14.327 32-32 32-32-14.327-32-32z" class="fill-base-100"/><path d="m26 16c-5.5228 0-10 4.4772-10 10v12c0 5.5228 4.4772 10 10 10h19.5c1.3807 0 2.5-1.1193 2.5-2.5v-19.5c0-5.5228-4.4772-10-10-10h-12zm-0.75 16c0 1.1046-0.8954 2-2 2s-2-0.8954-2-2 0.8954-2 2-2 2 0.8954 2 2zm8.75 0c0 1.1046-0.8954 2-2 2s-2-0.8954-2-2 0.8954-2 2-2 2 0.8954 2 2zm6.75 2c1.1046 0 2-0.8954 2-2s-0.8954-2-2-2-2 0.8954-2 2 0.8954 2 2 2z" fill-rule="evenodd"/></g></svg>
								</div>
							</div>
					</div>
				</div>
			</div>
		</div>
		<!-- <div class="p-6 text-center">
			<h3 class="font-bold mb-2">URL</h3>

			<input
				type="text"
				class="block input input-bordered input-primary w-full"
				value="chatnode.ai"
			/>
		</div> -->
	</div>
</section>

<section class="text-center py-20 container">
	<div class="flex justify-center">
		<h2 class="font-bold text-3xl relative py-4 px-8">
			<div class="dot-corners">
				<div />
				<div />
			</div>
			Some Use Cases
		</h2>
	</div>
	<div class="grid grid-cols-4 gap-8 my-10">
		{#each ['Michael made an Air BnB assistant to answer his guests questions about checkin/out, hosue rules, the neighborhood and more.', 'Joanne is answering fewer questions about the products in her ecommerce store after feeding all of her customer support emails into her bot.', "Eric is finding missing info on his marketing websites after reviewing answers to basic questions about the site's purpose.", 'Simba is asking questions about her own notes shes taken in meetings to help her remember what was said.	'] as _, i}
			<div class="card bg-neutral">
				<div class="card-body justify-center">
					<div class="card-title">
						{_}
					</div>
				</div>
			</div>
		{/each}
	</div>
	<p class="text-xl mb-10 max-w-[26rem] mx-auto leading-8">
		Our most creative member each month gets a free upgrade and a free month on us.
	</p>
	<button class="btn btn-primary btn-outline">What are yours?</button>
	<a href="twitter.com" class="block text-xs text-primary/80 mt-2">@ChatNode</a>
</section>

<div class="py-20 bg-[url('/grid.png')] bg-[length:1vw] relative">
	<div class="absolute inset-0 bg-gradient-to-b from-base-200 via-transparent to-base-200 shadow-base-200" />
	<div class="flex justify-center">
		<h2 class="font-bold text-3xl relative py-4 px-4 w-[22vw] text-center text-secondary">
			<div class="dot-corners">
				<div />
				<div />
			</div>
			Other Features
		</h2>
	</div>
	<Features />
</div>

<section id="pricing" class="bg-base-300py py-10 lg:py-20">
	<div class="container">
		<h2 class="text-center font-bold text-3xl">Pricing</h2>
		<PricingGrid />
	</div>
</section>

<div
	class="fixed bg-secondary p-4 pl-6 pr-24 h-[6.5rem] items-center bottom-0 left-0 right-0 flex justify-between -z-10"
>
	<div class="text-secondary-content font-bold text-lg">Still have questions?</div>
	<div class="text-secondary-content text-lg">Ask our own chatbot &rarr;</div>
</div>

<!-- <div class="alert alert-info fixed bottom-24 max-w-[24rem] right-5 leading-7 text-center z-10">Ask me something about ChatNode! You can have a chat bot just like this on your website.</div> -->

<style lang="postcss">
	:global(body) {
		@apply !mb-[6.5rem];
	}

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
	.dot-corners {
		@apply absolute inset-0 text-base leading-none;
	}

	.dot-corners div {
		@apply absolute left-0 right-0 text-secondary;
	}

	.dot-corners div:first-child {
		@apply top-0;
	}

	.dot-corners div::before {
		content: '';
		@apply absolute left-0 w-1 h-1 rounded-full bg-secondary/50;
	}
	.dot-corners div::after {
		content: '';
		@apply absolute right-0 w-1 h-1 rounded-full bg-secondary/50;
	}

	.dot-corners div:last-child {
		@apply bottom-0;
	}
</style>
