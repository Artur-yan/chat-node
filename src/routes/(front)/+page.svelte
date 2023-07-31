<script>
	import Img from '@zerodevx/svelte-img';
	import Chat from '$lib/components/Chat.svelte';
	import screenshot2 from '$lib/assets/internal-research-screenshot.jpg?run';
	import screenshotAddData from '$lib/assets/chatnode-add-data-screenshot.jpg?run';
	import screenshotPublish from '$lib/assets/chatnode-publish-settings-screenshot.jpg?run';
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
				href="https://www.producthunt.com/posts/chatnode?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-chatnode"
				target="_blank"
				><img
					src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=399772&theme=light"
					alt="ChatNode - Train&#0032;ChatGPT&#0032;on&#0032;your&#0032;own&#0032;data&#0044;&#0032;in&#0032;seconds | Product Hunt"
					style="width: 250px; height: 54px; display: inline-block;"
					width="250"
					height="54"
				/></a
			>
			<!-- <a
				class="btn btn-accent btn-outline h-auto rounded-full mt-4 btn-sm border-accent border bg-white/10"
				href="https://www.producthunt.com/posts/chatnode?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-chatnode"
				><span class="badge badge-accent badge-sm mr-1 hidden md:flex">🤍</span> We're live on Product Hunt today. Please suport us!</a
			> -->

			<h2
				class="mt-6 mb-6 text-5xl lg:text-6xl 2xl:text-7xl tracking-tight font-extrabold text-secondary max-w-[8em] max-lg:mx-auto"
			>
				Train ChatGPT on your data
			</h2>

			<div class="flex items-center max-lg:justify-center">
				<div class="mt-10 flex gap-4">
					<a href="/register" class="btn btn-primary btn-outline">Create your chatbot &rarr;</a>
				</div>
			</div>
		</div>
		<div>
			<div class="mockup-window border-4 border-secondary bg-base-100 max-w-4xl mx-auto">
				<div class="flex justify-center p-4 pt-0 h-[50vh] border-t border-base-300">
					<div class="w-full">
						<Chat
							modelId="befbfc87e25911db"
							{messages}
							avatar="https://res.cloudinary.com/duoacapcy/image/upload/v1687011043/ChatNode-Logo-Avatar_fdyalc.svg"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<Features />

<section id="how-it-works" class="bg-white text-base-100">
	<div class="py-8 lg:py-20 bg-secondary/50">
		<h2 class="p-4 md:pl-10 lg:pl-20 text-3xl lg:text-5xl font-bold mb-10">
			What makes ChatNode different?
		</h2>
		<div class="grid md:grid-cols-5 md:gap-8 lg:gap-20" id="your-data">
			<div class="md:col-span-2 md:col-start-4">
				<Img
					class="w-full h-full object-cover object-left md:rounded-l-xl shadow-2xl shadow-secondary"
					src={screenshotAddData}
					alt="Screenshot of training GPT ChatBot on the ChatNode website"
					width={2970}
					height={1537}
					sizes="(min-width: 768px) 30vw, 100vw"
				/>
			</div>

			<div class="md:col-span-3 p-8 lg:pl-20 py-10 md:row-start-1">
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

			<div class="md:col-span-2">
				<Img
					class="w-full h-full object-cover object-right rounded-r-xl shadow-2xl shadow-secondary"
					src={screenshot2}
					alt="Screenshot of training GPT ChatBot on the ChatNode website"
					width={2102}
					height={1404}
					sizes="(min-width: 768px) 30vw, 100vw"
				/>
			</div>

			<div class="md:col-span-3 md:col-start-3 p-8 md:py-10 lg:pr-20 scroll-m-10" id="internal-use">
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
			<div class="md:col-span-2 md:col-start-4">
				<Img
					class="w-full h-full object-cover object-left md:rounded-l-xl shadow-2xl shadow-secondary"
					src={screenshotPublish}
					alt="Screenshot of training GPT ChatBot on the ChatNode website"
					width={2998}
					height={1782}
					sizes="(min-width: 768px) 30vw, 100vw"
				/>
			</div>
			<div
				class="md:col-span-3 p-8 lg:pl-20 md:py-10 scroll-m-10 md:row-start-3"
				id="deploy-publically"
			>
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
			@apply fixed inset-0 bottom-auto z-20 shadow-lg;
		}
	</style>
</div>

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
