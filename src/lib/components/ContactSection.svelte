<script>
	import Accordian from '$lib/components/Accordian.svelte';
	import Chat from '$lib/components/Chat.svelte';
</script>

<section class="container grid md:grid-cols-2 gap-8 py-10 bg-base-300">
	<div>
		<h2 class="text-2xl font-bold mb-2 text-secondary">Contact</h2>

		<a href="mailto:contact@chatnode.ai" class="btn btn-outline">contact@chatnode.ai</a>

		<h2 class="text-2xl font-bold mb-4 mt-10 text-secondary">FAQs</h2>
		<div class="space-y-4">
			<Accordian>
				<div slot="title">Is there a free plan?</div>
				Yes, just by signing up you get 30 message credits and 1 chatbot. You can use these to test out
				ChatNode and see if it works for you.
			</Accordian>
			<Accordian>
				<div slot="title">How much data can I give one chatbot?</div>
				Free plan: 100K tokens (~5MB) | Basic: 400K tokens (~24MB) | Pro: 800K tokens (~50MB) | Entreprise:
				1M tokens (~75MB)
			</Accordian>

			<Accordian>
				<div slot="title">Does it support other languages?</div>
				Yes, ChatNode supports about 95 languages. You can have your sources in any language and ask
				it questions in any language.
			</Accordian>

			<a href="/faq" class="btn btn-block btn-outline">View all</a>
		</div>
	</div>

	<div class="flex flex-col">
		<h2 class="text-xl font-bold mb-4 text-secondary">More questions? Try our own AI chatbot</h2>
		<div class="h-full">
			<iframe
				src="https://www.chatnode.ai/embed/befbfc87e25911db"
				width="100%"
				height="100%"
				style="visibility: hidden; border: none;"
				onload="this.style.visibility='visible';"
				title="ChatNode AI Assistant"
			/>
		</div>
	</div>
</section>
