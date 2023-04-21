<script>
	import Chat from "$lib/components/Chat.svelte";

	let messages = [
		{
			text: "Hello, how can I help you?",
			sender: "bot"
		},
		{
			text: "I want to buy a new car",
		},
		{
			text: "What kind of car do you want?",
			sender: "bot"
		},
		{
			text: "I want a red one",
		},
		{
			text: "What is your budget?",
			sender: "bot"
		}
	]
</script>

<section class=" bg-slate-950">
	<div
		class="container gap-8 items-center py-8 px-4 mx-auto xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6"
	>
	<div class="mockup-window border border-base-300 bg-base-100">
		<div class="flex justify-center p-4 h-[50vh] border-t border-base-300">
			<div class="w-full">
				<Chat modelId="000" {messages} disabled />
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
