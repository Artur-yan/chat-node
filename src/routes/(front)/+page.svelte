<script>
	import Img from '@zerodevx/svelte-img';
	import Chat from '$lib/components/Chat.svelte';
	import Accordian from '$lib/components/Accordian.svelte';
	import screenshot2 from '$lib/assets/internal-research-screenshot.jpg?run';
	import screenshotAddData from '$lib/assets/chatnode-add-data-screenshot.jpg?run';
	import screenshotPublish from '$lib/assets/chatnode-publish-settings-screenshot.jpg?run';
	import difference1 from '$lib/assets/difference-1.jpg?run';
	import difference2 from '$lib/assets/difference-2.jpg?run';
	import difference3 from '$lib/assets/difference-3.jpg?run';
	import PricingGrid from '$lib/components/PricingGrid.svelte';
	import Features from '$lib/components/Features.svelte';

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
	<title>ChatNode | Train ChatGPT on your own data</title>
	<meta
		name="description"
		content="Build your own AI assistant for your website or create an internal research tool by training ChatGPT on any data you'd like."
	/>
</svelte:head>


<section class="bg-base-100">
	<div class="grid container lg:grid-cols-2 items-center gap-8 pb-10 pt-16 mx-auto">
		<div class="max-lg:text-center">
			<h2
				class="mb-6 text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl tracking-tight font-extrabold text-secondary max-w-[8em] max-lg:mx-auto"
			>
				Train ChatGPT on your own data
			</h2>

			<div class="flex items-center max-lg:justify-center">
				<a
					class="btn btn-accent btn-outline rounded-full my-2 btn-sm border-accent border bg-white/10"
					href="/blog/slack-integration"
					><span class="badge badge-accent badge-sm mr-1">New</span> Slack Integration &rarr;</a
				>
			</div>
			<div class="mt-16">
				<a href="/register" class="btn btn-primary">Create your chatbot</a>
				<a href="#difference" class="btn btn-ghost text-primary">
					Learn More
					<svg
						class="ml-1 w-4 h-4"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
						><path
							fill-rule="evenodd"
							d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/></svg
					>
				</a>
			</div>
		</div>
		<div>

			<div class="mockup-window border-4 border-secondary bg-base-100 max-w-4xl mx-auto">
				<div class="flex justify-center p-4 pt-0 h-[50vh] border-t border-base-300">
					<div class="w-full">
						<Chat modelId="7c92a03849aa49c4" {messages} />
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<Features />

<section id="how-it-works" class="px-10 pt-12 pb-32 bg-base-300">
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
</section>

<section id="difference" class="bg-white text-base-100">
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

<section class="container py-20">
	<h2 class="text-4xl text-center 2xl:text-5xl font-bold mb-8">FAQ</h2>

	<div class="grid lg:grid-cols-2 gap-4">
		<div class="space-y-4">
			<Accordian>
				<div slot="title">Is there a free plan?</div>
				Yes, just by signing up you get 30 message credits and 1 chatbot. You can use these to test out
				ChatNode and see if it works for you.
			</Accordian>
			<Accordian>
				<div slot="title">How do message work?</div>
				One AI response with gpt-3.5-turbo costs 1 message credit.
			</Accordian>
			<Accordian>
				<div slot="title">What counts as one chatbot?</div>
				One chatbot means a chatbot that contains specific data and can answer any question about this
				data. Even if it was created using multiple documents, urls or text.
			</Accordian>
			<Accordian>
				<div slot="title">How many users can use my chatbot?</div>
				If your chatbot is private, only you have access to it. If you decide to make it public, anyone
				with the link will be able to interact with it.
			</Accordian>
			<Accordian>
				<div slot="title">When are my message credits renewed?</div>
				Your message credits are renewed at the start of every calendar month regardless of when you
				subscribed. So if you subscribe on the 15th of the month, you will your message credits for that
				month and they will be renewed on the 1st of the next month.
			</Accordian>
			<Accordian>
				<div slot="title">How do I know how many tokens are in my document?</div>
				Once you attach your document for upload, ChatNode will show you the tokens count of the attached
				document.
			</Accordian>
			<Accordian>
				<div slot="title">Can I upload multiple files to one chatbot?</div>
				Yes, if you have a paid plan you can upload multiple files to one chatbot. Just click 'add data'
				and you can add another file.
			</Accordian>
			<Accordian>
				<div slot="title">How much data can I give one chatbot?</div>
				Free plan: 100K tokens (~5MB) | Basic: 400K tokens (~24MB) | Pro: 800K tokens (~50MB) | Entreprise:
				1M tokens (~75MB)
			</Accordian>
			<Accordian>
				<div slot="title">What is ChatNode?</div>
				ChatNode is an AI chatbot builder, it trains ChatGPT on your data and lets you add a chat widget
				to your website. Just upload a document or add a link to your website and get a chatbot that
				can answer any question about their content.
			</Accordian>
			<Accordian>
				<div slot="title">What should my data look like?</div>
				Currently, you can upload file (.pdf, .txt, .doc, .docx), paste text, or add a link to your website
				to be scraped.
			</Accordian>
		</div>
		<div class="space-y-4">
			<Accordian>
				<div slot="title">Can I give my chatbots instructions?</div>
				Yes, you can edit the system prompt and give your chatbot a name, personality traits and instructions
				on how to answer questions ex. (only answer in French).
			</Accordian>
			<Accordian>
				<div slot="title">Where is my data stored?</div>
				The content of the document is hosted on secure AWS servers in us-east.
			</Accordian>
			<Accordian>
				<div slot="title">Does it use ChatGPT or GPT-4?</div>
				Your chatbot uses ChatGPT (gpt-3.5-turbo).
			</Accordian>
			<Accordian>
				<div slot="title">How can I add my chatbot to my website?</div>
				You can embed an iframe or add a chat bubble to the bottom right of your website. To do that,
				create a chatbot and click « get embed code".
			</Accordian>
			<Accordian>
				<div slot="title">Does it support other languages?</div>
				Yes, ChatNode supports about 95 languages. You can have your sources in any language and ask
				it questions in any language.
			</Accordian>
			<Accordian>
				<div slot="title">Can I share a chatbot I created?</div>
				Yes, by default any chatbot you create is private but you can change the setting to make it public
				and send it to anyone.
			</Accordian>
			<Accordian>
				<div slot="title">How can I contact you?</div>
				You can reach out to us at contact@chatnode.ai or you can click on the live chat on the bottom
				right and talk to us directly.
			</Accordian>
			<Accordian>
				<div slot="title">Can I customize the chatbot?</div>
				Yes, you can change the color, chatbot icon, chatbot name, chatbot suggestions etc. You can also
				change the chatbot's welcome message.
			</Accordian>
			<Accordian>
				<div slot="title">How long does the training take?</div>
				It depends on the number of tokens (text length) you are training. But usually, it should be
				done within a few seconds or minutes.
			</Accordian>
		</div>
	</div>
	<style lang="postcss">
		body {
			@apply pt-10;
		}
		#header {
			@apply fixed inset-0 bottom-auto z-10 shadow-lg;
		}
	</style>
</section>

<style lang="postcss">
	#how-it-works .card {
		@apply relative overflow-hidden text-2xl mt-4 hover:mt-0 transition-all bg-secondary text-primary-content border-secondary border-2 focus:outline-4 outline-primary;
	}

	#how-it-works .card .card-body {
		@apply rounded-xl;
	}

	#how-it-works .card .btn {
		@apply btn-secondary;
	}

	#how-it-works .card-title {
		@apply xl:text-3xl 2xl:text-4xl font-bold;
	}

	#difference {
		@apply text-lg 2xl:text-2xl;
	}

	#difference h3 {
		@apply text-2xl md:text-4xl 2xl:text-5xl font-bold mb-10;
	}
	#difference h4 {
		@apply text-xl 2xl:text-3xl font-bold mt-6 mb-1 2xl:mb-4;
	}
	#difference p {
		@apply mb-5 2xl:mb-12;
	}
</style>
