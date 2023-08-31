<script>
	import Accordian from '$lib/components/Accordian.svelte';
</script>

<svelte:head />

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
</section>
