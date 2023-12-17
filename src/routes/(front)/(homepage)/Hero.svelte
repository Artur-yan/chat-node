<script lang="ts">
	import Chat from '$lib/components/Chat.svelte';
	import { defaultSettings } from '$lib/models';

	let chatSettings = {
		...defaultSettings
	};
	chatSettings.theme.resetButton = '#FFFFFF88';
	chatSettings.headerEnabled = false;

	import MorphingText from '$lib/components/MorphingText.svelte';

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
				text: "That's great! With ChatNode, you can easily build your own chatbot. You can train the chatbot using your own data and add it to your website. You can customize the chatbot's appearance, name, suggestions, and even the welcome message. If you have any specific questions or need assistance with the process, feel free to ask!",
				sender: 'bot'
			}
		];
	};

	demoChat();
</script>
<section>
	<div class="grid container lg:grid-cols-2 items-center gap-8 mx-auto pt-[5vh] pb-[10vh]">
		<div class="max-lg:text-center">
			<h1
				class="my-6 w-[11ch] text-[10vw] sm:text-4xl md:text-5xl lg:text-7xl 2xl:text-8xl tracking-tight font-extrabold text-secondary max-w-full max-lg:mx-auto"
			>
				Train ChatGPT on your data
			</h1>

			<div
				class="text-2xl md:text-3xl lg:text-4xl font-bold max-w-[20ch] lg:max-w-[24ch] md:leading-10 max-lg:mx-auto"
			>
				<span class="mr-2 max-lg:block">Build a chatbot to answer any questions on your</span>
				<MorphingText />
			</div>

			<div class="flex items-center max-lg:justify-center">
				<div class="mt-16 flex gap-4">
					<a href="/register" class="btn btn-primary md:btn-lg -ml-1">Create A free chatbot</a>
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
						<div class="join-item badge badge-accent badge-lg rounded-b-none font-bold ml-2">
							Try Me
						</div>
						<span
							class="join-item badge badge-lg badge-outline border-accent bg-black font-bold text-xs"
						>
							I'm trained on ChatNode
						</span>
					</div>
				</div>
				<div
					class="flex justify-center p-1 md:p-4 pt-0 min-h-[50vh] h-[20rem] border-t border-base-300"
				>
					<div class="w-full">
						<Chat
							modelId="befbfc87e25911db"
							bind:messages
							avatar="https://res.cloudinary.com/duoacapcy/image/upload/v1687011043/ChatNode-Logo-Avatar_fdyalc.svg"
							settings={chatSettings}
							userId="5uDVaFgS32peeLl"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
