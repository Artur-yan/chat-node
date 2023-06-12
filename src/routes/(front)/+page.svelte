<script>
	import Img from '@zerodevx/svelte-img';
	import Chat from '$lib/components/Chat.svelte';
	import screenshot2 from '$lib/assets/internal-research-screenshot.jpg?run';
	import screenshotAddData from '$lib/assets/chatnode-add-data-screenshot.jpg?run';
	import screenshotPublish from '$lib/assets/chatnode-publish-settings-screenshot.jpg?run';
	// import difference1 from '$lib/assets/difference-1.jpg?run';
	// import difference2 from '$lib/assets/difference-2.jpg?run';
	// import difference3 from '$lib/assets/difference-3.jpg?run';
	import PricingGrid from '$lib/components/PricingGrid.svelte';
	import Features from '$lib/components/Features.svelte';
	import ContactSection from '$lib/components/ContactSection.svelte';

	let isThinking = false;
	let messages = [
		{
			text: 'Hi, how can I help you?',
			sender: 'bot'
		}
	];

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

<section class="bg-base-100">
	<div class="grid container lg:grid-cols-2 items-center gap-8 pb-10 pt-16 mx-auto">
		<div class="max-lg:text-center">
			<a
				class="btn btn-accent btn-outline rounded-full mb-4 btn-sm border-accent border bg-white/10"
				href="/blog/slack-integration"
				><span class="badge badge-accent badge-sm mr-1">New</span> Slack Integration &rarr;</a
			>

			<h2
				class="mb-6 text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl tracking-tight font-extrabold text-secondary max-w-[8em] max-lg:mx-auto"
			>
				Train ChatGPT on your data
			</h2>

			<div class="flex items-center max-lg:justify-center" />
			<div class="mt-10 flex gap-4">
				<a href="/register" class="btn btn-primary btn-outline">Create your chatbot &rarr;</a>
			</div>
		</div>
		<div>
			<div class="mockup-window border-4 border-secondary bg-base-100 max-w-4xl mx-auto">
				<div class="flex justify-center p-4 pt-0 h-[50vh] border-t border-base-300">
					<div class="w-full">
						<Chat modelId="18f636e1ca1e80c2" {messages} avatar="data:image/png;base64,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" />
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<Features />

<!-- <section id="how-it-works" class="px-10 pt-12 pb-32 bg-base-300">
	<h2 class="text-4xl 2xl:text-5xl font-bold mb-6 text-center">How it works</h2>
	<div class="container grid md:grid-cols-3 gap-10 mx-auto">
		<a href="#your-data" class="group card">
			<figure>
				<Img src={difference1} />
			</figure>
			<div class="card-body">
				<h2 class="card-title">Train on your data</h2>
				<p>Websites, pdfs, docs, or text</p>
				<div
					class="text-base translate-y-1/2 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-y-0"
				>
					<div class="card-actions">
						<div class="btn">Learn More</div>
					</div>
				</div>
			</div>
		</a>
		<a href="#internal-use" class="group card">
			<figure>
				<Img src={difference2} />
			</figure>

			<div class="card-body">
				<h2 class="card-title">Use the bot internally</h2>
				<p>Keep your bot private for research or testing purposes</p>
				<div
					class="text-base translate-y-1/2 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-y-0"
				>
					<div class="card-actions">
						<div class="btn">Learn More</div>
					</div>
				</div>
			</div>
		</a>
		<a href="#deploy-publically" class="group card">
			<figure>
				<Img src={difference3} />
			</figure>
			<div class="card-body">
				<h2 class="card-title">Deploy it publically</h2>
				<p>Publish to your website or get a url to share with everyone</p>
				<div
					class="text-base translate-y-1/2 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-y-0"
				>
					<div class="card-actions">
						<div class="btn">Learn More</div>
					</div>
				</div>
			</div>
		</a>
	</div>
</section> -->

<section id="how-it-works" class="bg-white text-base-100">
	<div class="py-8 lg:py-20 bg-secondary/50">
		<h2 class="p-4 md:pl-10 lg:pl-20 text-3xl lg:text-5xl font-bold mb-10">
			What makes ChatNode different?
		</h2>
		<div class="grid gap-y-20 md:grid-cols-5 gap-20" id="your-data">
			<div class="md:col-span-3 p-8 md:pl-20 py-10">
				<h3>Train on your data</h3>
				<div>
					<p>
						GPT Chatbot has the ability to quickly learn from a diverse range of sources. With this
						unique functionality, you can effortlessly train your bot by providing any URL of your
						choice. The AI swiftly extracts essential information and trains within a mere 10
						seconds!
					</p>

					<p>
						In addition to URLs, you have the option to directly copy and paste text into the
						training platform for quick learning.
					</p>

					<p>
						To further diversify your bot's knowledge, you can even upload PDF documents that you
						would like it to be educated on.
					</p>
				</div>
			</div>
			<div class="max-md:hidden col-span-2">
				<Img
					class="w-full h-full object-cover object-left rounded-l-xl shadow-2xl shadow-secondary"
					src={screenshotAddData}
					alt="Screenshot of training GPT ChatBot on the ChatNode website"
					width={2970}
					height={1537}
					sizes="35vw"
				/>
			</div>
			<div class="max-md:hidden col-span-2">
				<Img
					class="w-full h-full object-cover object-right rounded-r-xl shadow-2xl shadow-secondary"
					src={screenshot2}
					alt="Screenshot of training GPT ChatBot on the ChatNode website"
					width={2102}
					height={1404}
				/>
			</div>
			<div class="md:col-span-3 md:col-start-3 p-8 md:py-10 md:pr-20 scroll-m-10" id="internal-use">
				<h3>Use the bot internally</h3>
				<h4>Revolutionizing Data Access with Chatbots for Company Teams.</h4>
				<div>
					<p>
						In today's corporate world, our advanced chatbot provides instant access to vital
						information from various sources, streamlining company operations and collaboration.
					</p>

					<h4>Effortless Integration:</h4>
					<p>
						Our chatbot's seamless integration into a company's workflow tools ensures efficient
						access to crucial data from multiple repositories, enhancing problem-solving and
						innovation.
					</p>

					<h4>24/7 Support:</h4>
					<p>
						The chatbot's responsive nature offers organizations on-demand assistance, promoting
						informed decision-making and increased productivity.
					</p>

					<h4>Time and Cost Efficiency:</h4>
					<p>
						The chatbot's instant data retrieval capabilities save valuable time and reduce costs,
						allowing team members to focus on critical tasks that drive company growth.
					</p>

					<h4>Knowledge Sharing:</h4>
					<p>
						The chatbot centralizes vital information acquired from diverse sources, enabling
						effective knowledge sharing across teams.
					</p>

					<p>
						In summary, our chatbot significantly enhances company team communication,
						collaboration, and decision-making—a valuable as set in today's competitive business
						landscape.
					</p>
				</div>
			</div>
			<div class="md:col-span-3 p-8 md:pl-20 md:py-10 scroll-m-10" id="deploy-publically">
				<h3>Deploy it in public</h3>
				<div>
					<h4>Transforming Customer Support with Chatbot Integration.</h4>

					<p>
						Our advanced chatbot catalyzes a self-service revolution for your company website,
						providing instant, round-the-clock answers to customer queries while reducing the
						support team's workload.
					</p>

					<h4>Intelligent Assistance:</h4>
					<p>
						By handling routine inquiries, the chatbot streamlines support processes, improves
						response times, and allows your team to focus on complex issues, enhancing customer
						satisfaction.
					</p>

					<h4>Adaptable Knowledge Base:</h4>
					<p>
						Trained on diverse sources and regularly updated, our chatbot offers accurate and
						context-aware answers, customized to your company’s domain and branding.
					</p>

					<p>
						In summary, our chatbot delivers a powerful, efficient, and cost-effective support
						experience that meets the evolving demands of today's digital landscape.
					</p>
				</div>
			</div>
			<div class="max-md:hidden col-span-2">
				<Img
					class="w-full h-full object-cover object-left rounded-l-xl shadow-2xl shadow-secondary"
					src={screenshotPublish}
					alt="Screenshot of training GPT ChatBot on the ChatNode website"
					width={2998}
					height={1782}
				/>
			</div>
		</div>
	</div>
</section>

<section id="pricing" class="bg-base-300py py-10 lg:py-20">
	<div class="container">
		<h2 class="text-center font-bold text-3xl">Pricing</h2>
		<PricingGrid />
	</div>
</section>

<ContactSection />

<div>
	<style lang="postcss">
		body {
			@apply pt-10;
		}
		#header {
			@apply fixed inset-0 bottom-auto z-10 shadow-lg;
		}
	</style>
</div>

<style lang="postcss">
	#how-it-works {
		@apply text-lg 2xl:text-2xl;
	}

	#how-it-works h3 {
		@apply text-2xl md:text-4xl 2xl:text-5xl font-bold mb-10;
	}
	#how-it-works h4 {
		@apply text-xl 2xl:text-3xl font-bold mt-6 mb-1 2xl:mb-4;
	}
	#how-it-works p {
		@apply mb-5 2xl:mb-12;
	}
</style>
