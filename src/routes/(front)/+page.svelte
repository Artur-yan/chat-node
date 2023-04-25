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

<section class=" bg-slate-950">
	<div
		class="container gap-8 items-center py-8 px-4 mx-auto xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6"
	>
	<div class="mockup-window border border-base-300 bg-base-100">
		<div class="flex justify-center p-4 h-[50vh] border-t border-base-300">
			<div class="w-full">
				<Chat modelId="000" {messages} disabled {isThinking} />
			</div>
		</div>
	  </div>
		<div class="leading-loose">
			<h2 class="mb-6 text-2xl tracking-tight font-extrabold">
				Chat GPT empowered with your data.
			</h2>
			<p class="mb-10 font-light text-xl">
				Train thje highly advanced AI chat bot on any text, file or website you choose. Use it
				internally or make or publish it to your website to answer your customers' questons.
			</p>
			<a href="/register" class="btn text-primary">
				Get started
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
