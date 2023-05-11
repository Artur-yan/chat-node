<script>
	import Img from '@zerodevx/svelte-img';
	import Chat from '$lib/components/Chat.svelte';
	import Accordian from '$lib/components/Accordian.svelte';
	import screenshot1 from '$lib/assets/screenshot-1.jpg?run';
	import screenshot2 from '$lib/assets/internal-research-screenshot.jpg?run';
	import screenshotAddData from '$lib/assets/chatnode-add-data-screenshot.jpg?run';
	import screenshotPiublish from '$lib/assets/chatnode-publish-settings-screenshot.jpg?run';
	import PricingGrid from '$lib/components/PricingGrid.svelte';

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
		await new Promise((r) => setTimeout(r, 3000));
		messages = [
			...messages,
			{
				text: 'To build a chatbot, sign up for an account, then click create from the dashboard.',
				sender: 'bot'
			}
		];
		isThinking = false;
		await new Promise((r) => setTimeout(r, 1500));
		messages = [
			...messages,
			{
				text: 'What data can I train my chatbot on?',
				sender: 'user'
			}
		];
		isThinking = true;
		await new Promise((r) => setTimeout(r, 2000));
		isThinking = false;
		messages = [
			...messages,
			{
				text: 'Chatbots can be trained on any text, pdf, or website.',
				sender: 'bot'
			}
		];
		await new Promise((r) => setTimeout(r, 1000));
		messages = [
			...messages,
			{
				text: 'Where can I use my chatbot?',
				sender: 'user'
			}
		];
		isThinking = true;
		await new Promise((r) => setTimeout(r, 2000));
		isThinking = false;
		messages = [
			...messages,
			{
				text: 'Your chatbot can be published to any website as an embed or popup chat window, or kept private as an internal tool for research purposes.',
				sender: 'bot'
			}
		];
	};

	demoChat();
</script>

<section>
	<div class="container gap-8 items-center px-4 py-[5vh] mx-auto lg:px-6">
		<h2 class="mb-6 text-5xl tracking-tight font-extrabold text-center text-secondary">
			Train ChatGPT on your own data
		</h2>
		<div class="mockup-window border-4 border-secondary bg-base-100 max-w-4xl mx-auto">
			<div class="flex justify-center h-[50vh] border-t border-base-300">
				<div class="w-full">
					<Chat modelId="" {messages} />
				</div>
			</div>
		</div>
		<!-- <p class="my-10 font-light text-xl max-w-3xl text-center mx-auto">
				Train the highly advanced AI chatbot on any text, file or website you choose. Use it
				internally or publish it to your website to answer your customers' questions.
			</p> -->
		<div class="my-10 text-center">
			<a href="/register" class="btn btn-primary btn-lg"> Try for free </a>
			<a href="#difference" class="btn btn-ghost text-primary">
				Learn More
				<svg
					class="ml-2 -mr-1 w-5 h-5"
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
</section>

<section id="how-it-works" class="px-10 pt-12 pb-32 bg-base-300">
	<h2 class="text-4xl 2xl:text-5xl font-bold mb-6 text-center">How it works</h2>
	<div class="container grid md:grid-cols-3 gap-10 mx-auto">
		<a href="#difference" class="group card">
			<div class="card-body">
				<!-- <div class="absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-base-100 aspect-square w-12 flex items-center justify-center text-white border-secondary border rounded-full">1</div> -->
				<h2 class="card-title">Train on your data</h2>
				<p>Websites, pdfs, docs, text, spreadsheets and more...</p>
				<div
					class="text-base mt-4 translate-y-1/2 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-y-0"
				>
					<!-- <p>Input any url you want your bot to be trained on. It takes less than 10 seconds.</p>
					<p>You can also add copy/paste texts as well as any PDF to be trained on.</p> -->
					<div class="card-actions justify-end">
						<div class="btn">Learn More</div>
					</div>
				</div>
			</div>
		</a>
		<a href="#difference-2" class="group card">
			<div class="card-body">
				<h2 class="card-title">Use the bot internally</h2>
				<p>Keep your bot private for research or testing purposes.</p>
				<div
					class="text-base mt-4 translate-y-1/2 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-y-0"
				>
					<!-- <p>You can then export an iframe of the bot anywhere</p>
					<p>Use it to train your team or to look for a specific answer.</p> -->
					<div class="card-actions justify-end">
						<div class="btn">Learn More</div>
					</div>
				</div>
			</div>
		</a>
		<a href="#difference-3" class="group card">
			<div class="card-body">
				<h2 class="card-title">Deploy it in public</h2>
				<p>Publish to your website or get a url to share with everyone.</p>
				<div
					class="text-base mt-4 translate-y-1/2 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-y-0"
				>
					<!-- <p>Export the bot on your website and fire your customer support team.</p>
					<p>Your customers can ask any questions and get instant answers trained on your data.</p> -->
					<div class="card-actions justify-end">
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
			What Makes GPT ChatBot <span class="">Different?</span>
		</h2>
		<div class="grid gap-y-20 md:grid-cols-5 gap-20">
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
					alt="Screenshot of training GPT ChatBot on the gptchatbot.ai website"
					width={2970}
					height={1537}
					sizes="35vw"
				/>
			</div>
			<div class="max-md:hidden col-span-2">
				<Img
					class="w-full h-full object-cover object-right rounded-r-xl shadow-2xl shadow-secondary"
					src={screenshot2}
					alt="Screenshot of training GPT ChatBot on the gptchatbot.ai website"
					width={2102}
					height={1404}
				/>
			</div>
			<div class="md:col-span-3 md:col-start-3 p-8 md:py-10 md:pr-20 scroll-m-10" id="difference-2">
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
			<div class="md:col-span-3 p-8 md:pl-20 md:py-10 scroll-m-10" id="difference-3">
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
					src={screenshotPiublish}
					alt="Screenshot of training GPT ChatBot on the gptchatbot.ai website"
					width={2998}
					height={1782}
				/>
			</div>
		</div>
	</div>
</section>

<section id="pricing" class="bg-base-300py py-1 lg:py-20">
	<div class="container">
		<h2 class="text-center font-bold text-3xl">Pricing</h2>
		<PricingGrid currentPlan={null} />
	</div>
</section>

<section class="container py-20">
	<h2 class="text-4xl text-center 2xl:text-5xl font-bold mb-8">FAQ</h2>

	<div class="grid lg:grid-cols-2 gap-4">
		<div class="space-y-4">
			<Accordian>
				<div slot="title">Is there a free plan?</div>
				Yes, just by signing up you get 30 message credits and 1 chatbot. You can use these to test out chat leaf and see if it works for you.
			</Accordian>
			<Accordian>
				<div slot="title">How do message work?</div>
				One AI response with gpt-3.5-turbo costs 1 message credit.
			</Accordian>
			<Accordian>
				<div slot="title">What counts as one chatbot?</div>
				One chatbot means a chatbot that contains specific data and can answer any question about this data. Even if it was created using multiple documents, urls or text.
			</Accordian>
			<Accordian>
				<div slot="title">How many users can use my chatbot?</div>
				If your chatbot is private, only you have access to it. If you decide to make it public, anyone with the link will be able to interact with it.
			</Accordian>
			<Accordian>
				<div slot="title">When are my message credits renewed?</div>
				Your message credits are renewed at the start of every calendar month regardless of when you subscribed. So if you subscribe on the 15th of the month, you will your message credits for that month and they will be renewed on the 1st of the next month.
			</Accordian>
			<Accordian>
				<div slot="title">How do I know how many tokens are in my document?</div>
				Once you attach your document for upload, chat leaf will show you the tokens count of the attached document.
			</Accordian>
			<Accordian>
				<div slot="title">Can I upload multiple files to one chatbot?</div>
				Yes, if you have a paid plan you can upload multiple files to one chatbot. Just click 'add data' and you can add another file.
			</Accordian>
			<Accordian>
				<div slot="title">How much data can I give one chatbot?</div>
				Free plan: 100K tokens (~5MB) | Basic: 400K tokens (~24MB) | Pro: 800K tokens (~50MB) | Entreprise: 1M tokens (~75MB)
			</Accordian>
			<Accordian>
				<div slot="title">What is ChatNode?</div>
				ChatNode is an AI chatbot builder, it trains ChatGPT on your data and lets you add a chat widget to your website. Just upload a document or add a link to your website and get a chatbot that can answer any question about their content.
			</Accordian>
			<Accordian>
				<div slot="title">What should my data look like?</div>
				Currently, you can upload file (.pdf, .txt, .doc, .docx), paste text, or add a link to your website to be scraped.
			</Accordian>
		</div>
		<div class="space-y-4">
			<Accordian>
				<div slot="title">Can I give my chatbots instructions?</div>
				Yes, you can edit the system prompt and give your chatbot a name, personality traits and instructions on how to answer questions ex. (only answer in French).
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
				You can embed an iframe or add a chat bubble to the bottom right of your website. To do that, create a chatbot and click « get embed code".
			</Accordian>
			<Accordian>
				<div slot="title">Does it support other languages?</div>
				Yes, ChatNode supports about 95 languages. You can have your sources in any language and ask it questions in any language.
			</Accordian>
			<Accordian>
				<div slot="title">Can I share a chatbot I created?</div>
				Yes, by default any chatbot you create is private but you can change the setting to make it public and send it to anyone.
			</Accordian>
			<Accordian>
				<div slot="title">How can I contact you?</div>
				You can reach out to us at contact@chatnode.ai or you can click on the live chat on the bottom left and talk to us directly.
			</Accordian>
			<Accordian>
				<div slot="title">Can I customize the chatbot?</div>
				Yes, you can change the color, chatbot icon, chatbot name, chatbot suggestions etc. You can also change the chatbot's welcome message.
			</Accordian>
			<Accordian>
				<div slot="title">How long does the training take?</div>
				It depends on the number of tokens (text length) you are training. But usually, it should be done within a few seconds or minutes.
			</Accordian>
		</div>
	</div>
</section>

<style lang="postcss">
	#how-it-works .card {
		@apply relative overflow-hidden text-2xl shadow-xl shadow-accent/20 mt-4 hover:mt-0 transition-all bg-secondary text-primary-content hover:border-primary;
	}

	#how-it-works .card .card-body {
		@apply bg-primary/50 m-[1px] rounded-xl;
	}

	#how-it-works .card .btn {
		@apply btn-ghost self-end;
	}

	#how-it-works .card-title {
		@apply xl:text-3xl 2xl:text-4xl font-bold mb-4;
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
