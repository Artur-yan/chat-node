<script>
	import Chat from "$lib/components/Chat.svelte";

	let messages = [
		{
			text: "Hi, how can I help you?",
			sender: 'bot'
		}
	]

	let isThinking = false;

	// wait 3 seconds adn then add to messges array
	const addMessages = async (message, sender = 'bot') => {
		await new Promise(r => setTimeout(r, 1000));
		messages = [...messages, {
			text: "I want to build a chat bot.",
			sender: 'user'
		}];
		isThinking = true
		await new Promise(r => setTimeout(r, 3000));
		messages = [...messages, {
			text: "To build a chatbot, sign up for an account, then click create from the dashboard.",
			sender: 'bot'
		}];
		isThinking = false
		await new Promise(r => setTimeout(r, 1500));
		messages = [...messages, {
			text: "What data can I train my chatbot on?",
			sender: 'user'
		}];
		isThinking = true
		await new Promise(r => setTimeout(r, 2000));
		isThinking = false
		messages = [...messages, {
			text: "Chatbots can be trained on any text, pdf, or website.",
			sender: 'bot'
		}];
		await new Promise(r => setTimeout(r, 1000));
		messages = [...messages, {
			text: "How many chatbots are included in the free plan?",
			sender: 'user'
		}];
		isThinking = true
		await new Promise(r => setTimeout(r, 2000));
		isThinking = false
		messages = [...messages, {
			text: "One chatbot is included in the free plan.",
			sender: 'bot'
		}];

	};

	addMessages()

</script>

<section>
	<div
		class="container gap-8 items-center px-4 mx-auto lg:px-6 pt-2 pb-20"
	>
	<h2 class="mb-6 text-5xl tracking-tight font-extrabold text-center text-secondary">
		Fire your customer support
	</h2>
	<div class="mockup-window border-4 border-secondary bg-base-100 max-w-4xl mx-auto">
		<div class="flex justify-center p-4 h-[50vh] border-t border-base-300">
			<div class="w-full">
				<Chat modelId="000" {messages} />
			</div>
		</div>
	  </div>
		<div class="leading-loose">
			<p class="my-10 font-light text-xl max-w-3xl text-center mx-auto">
				Train the highly advanced AI chatbot on any text, file or website you choose. Use it
				internally or publish it to your website to answer your customers' questions.
			</p>
			<div class="text-center">
				<a href="/register" class="btn btn-primary btn-lg">
					Try for free
				</a>
				<a href="/register" class="btn btn-ghost text-primary">
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
	</div>
</section>

<section id="how-it-works" class=" px-10 pt-12 pb-32">
	<h2 class="text-2xl font-bold mb-6 text-center">How it works</h2>
	<div class="grid grid-cols-3 gap-4 max-w-6xl mx-auto">
		<div class="card">
			<div class="card-body">
			  <h2 class="card-title">
				Train on your data
			  </h2>
			  <p>Websites, pdfs, docs, text, spreadsheets and more...</p>
			</div>
		  </div>
		<div class="card">
			<div class="card-body">
			  <h2 class="card-title">
				Use the bot internally
			  </h2>
			  <p>Keep your bot private for research or testing pruposes.</p>
			</div>
		  </div>
		<div class="card">
			<div class="card-body">
			  <h2 class="card-title">
				Deploy it in the public
			  </h2>
			  <p>Publish to your website or get a public url to share.</p>
			</div>
		  </div>
	</div>
</section>



<style lang="postcss">
	#how-it-works .card{
		@apply text-black text-xl bg-secondary;
	}

	#how-it-works .card-title{
		@apply text-2xl font-bold mb-4;
	}
</style>