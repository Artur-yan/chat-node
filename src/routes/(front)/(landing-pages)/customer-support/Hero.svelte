<script lang="ts">
	import Chat from '$lib/components/Chat.svelte';
	import { defaultSettings } from '$lib/models';
	import themes from '$lib/chatThemes';
	import AOS from 'aos';
	import { onMount } from 'svelte';
	import IntersectionObserver from '$lib/components/IntersectionObserver.svelte';

	import 'aos/dist/aos.css';
	import WaysToShare from '../../(homepage)/WaysToShare.svelte';

	let chatSettings = {
		...defaultSettings
	};
	//chatSettings.theme.resetButton = '#FFFFFF88';

	let messages = [];

	const demoChat = async () => {
		chatSettings.theme = themes['default'];
		//chatSettings.theme.bg = '#FFFFFFEE';

		messages = [
			{
				text: "👋 Hi, I'm here to help you create your AI chatbot",
				sender: 'bot'
			},
			{
				text: 'I want to create an AI Customer Support Agent',
				sender: 'user'
			},
			{
				text: "That's great! With ChatNode, you can easily build an AI Customer Support Agent to quickly respond to customer inquiries 24/7. Your chatbot is trained on your website, PDFs, and more. [https://www.chatnode.ai/register](https://www.chatnode.ai/register)",
				sender: 'bot'
			}
		];
	};
	const demoChatPart2 = async () => {
		chatSettings.theme = themes['meta-dark'];

		messages = [
			{
				text: 'Do you have customer support scripts, product spec docs or FAQs as documents? You can easily upload those to train your chatbot on.',
				sender: 'bot'
			},
			{
				text: 'What types of files can I upload?',
				sender: 'user'
			},
			{
				text: 'You can upload any text file, such as PDF, DOC, TXT, CSV, XLS, etc.',
				sender: 'bot'
			}
		];
	};
	const demoChatPart3 = async () => {
		chatSettings.theme = themes['ios-light'];

		messages = [
			{
				text: 'Would you like to crawl a website for data?',
				sender: 'bot'
			},
			{
				text: 'Yes, how do I add URLs'
			},
			{
				text: 'Add the url of any website and we will scrape it and any sub-pages for text to train your chatbot on. You can select which pages to include and can always add or remove urls later.',
				sender: 'bot'
			}
		];
	};
	const demoChatPart4 = async () => {
		chatSettings.theme = themes['ios-dark'];

		messages = [
			{
				text: "A prompt allows you to change the tone and behavior of your chatbot's personality.",
				sender: 'bot'
			},
			{
				text: 'Can I use the prompt to make my chatbot speak like a customer support agent?'
			},
			{
				text: 'Absolutely! You can prompt your chatbot to ask certain questions up-front, respond differently based on the answer and provide contact information or hand over the chat to Crisp if the chatbot is unable to answer the question. Get creative!',
				sender: 'bot'
			}
		];
	};
	const demoChatPart5 = async () => {
		chatSettings.theme = themes['default'];

		messages = [
			{
				text: 'You can customize the colors of everything, hide or show the send button, change the greeting, add a header and more!',
				sender: 'bot'
			},
			{
				text: 'What if I am bad at design?'
			},
			{
				text: 'No problem! We have a bunch of pre-made themes you can choose from.',
				sender: 'bot'
			}
		];
	};

	const showcaseTheme = (themeName) => {
		chatSettings.theme = themes[themeName];
	};

	let topSectionIntersecting = false;
	let uploadSectionIntersecting = false;
	let urlSectionIntersecting = false;
	let promptSectionIntersecting = false;
	let brandSectionIntersecting = false;

	$: if (topSectionIntersecting) {
		demoChat();
	}
	$: if (uploadSectionIntersecting) {
		demoChatPart2();
	}
	$: if (urlSectionIntersecting) {
		demoChatPart3();
	}
	$: if (promptSectionIntersecting) {
		demoChatPart4();
	}
	$: if (brandSectionIntersecting) {
		demoChatPart5();
	}

	onMount(() => {
		AOS.init();
		demoChat();
	});
</script>

<section>
	<IntersectionObserver bind:intersecting={topSectionIntersecting} top={0} />

	<div
		class="grid container lg:grid-cols-[4fr_3fr] items-stretch gap-8 md:gap-12 lg:gap-16 mx-auto pt-[10vh] pb-[10vh]"
	>
		<div class="max-lg:text-center">
			<div class="pb-20 h-screen">
				<div>
					<h2
						class="my-6 text-[8vw] sm:text-3xl md:text-4xl lg:text-6xl 2xl:text-7xl tracking-tight font-extrabold text-secondary max-w-full max-lg:mx-auto"
					>AI Customer Support<div class="text-primary">Agent for Crisp</div>
					</h2>
					<div
						class="text-2xl md:text-3xl lg:text-4xl font-bold max-w-[24ch] lg:max-w-[40ch] md:leading-10 max-lg:mx-auto"
					>
						Offload 80% of your customer’s queries
					</div>
					<div class="flex items-center max-lg:justify-center">
						<div class="mt-16 flex gap-4 mr-4">
							<a href="/register" class="btn btn-primary">Sign up For Free</a>
						</div>
						<div class="mt-16 flex gap-4">
							<a href="#demo" class="btn btn-secondary">Demo</a>
						</div>
					</div>
					<p class="text-sm mt-2">No credit card required</p>
				</div>
			</div>

			<section class="md:h-screen md:min-h-40em] pb-10">
				<div class="md:sticky top-20 py-10">
					<IntersectionObserver bind:intersecting={uploadSectionIntersecting} top={0} />

					<h2 class="text-5xl font-bold flex items-center gap-4">
						<span
							class="aspect-square font-extralight border-primary text-xl text-primary border rounded-full h-8 items-center flex justify-center text-center"
						>
							1
						</span>
						<span>Upload Your Files...</span>
					</h2>
					<div class="table my-10 table-zebra text-lg">
						<tbody>
							<tr data-aos="fade-right">
								<td>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										viewBox="0 0 384 512"
									>
										<path
											fill="currentColor"
											d="M181.9 256.1c-5-16-4.9-46.9-2-46.9c8.4 0 7.6 36.9 2 46.9zm-1.7 47.2c-7.7 20.2-17.3 43.3-28.4 62.7c18.3-7 39-17.2 62.9-21.9c-12.7-9.6-24.9-23.4-34.5-40.8zM86.1 428.1c0 .8 13.2-5.4 34.9-40.2c-6.7 6.3-29.1 24.5-34.9 40.2zM248 160h136v328c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V24C0 10.7 10.7 0 24 0h200v136c0 13.2 10.8 24 24 24zm-8 171.8c-20-12.2-33.3-29-42.7-53.8c4.5-18.5 11.6-46.6 6.2-64.2c-4.7-29.4-42.4-26.5-47.8-6.8c-5 18.3-.4 44.1 8.1 77c-11.6 27.6-28.7 64.6-40.8 85.8c-.1 0-.1.1-.2.1c-27.1 13.9-73.6 44.5-54.5 68c5.6 6.9 16 10 21.5 10c17.9 0 35.7-18 61.1-61.8c25.8-8.5 54.1-19.1 79-23.2c21.7 11.8 47.1 19.5 64 19.5c29.2 0 31.2-32 19.7-43.4c-13.9-13.6-54.3-9.7-73.6-7.2zM377 105L279 7c-4.5-4.5-10.6-7-17-7h-6v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zm-74.1 255.3c4.1-2.7-2.5-11.9-42.8-9c37.1 15.8 42.8 9 42.8 9z"
										/>
									</svg>
								</td>
								<td class="w-full">Customer Handbook.pdf</td>
							</tr>
							<tr data-aos="fade-right">
								<td>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										viewBox="0 0 512 512"
									>
										<path
											fill="currentColor"
											d="M453.547 273.449H372.12v-40.714h81.427v40.714zm0 23.264H372.12v40.714h81.427v-40.714zm0-191.934H372.12v40.713h81.427V104.78zm0 63.978H372.12v40.713h81.427v-40.713zm0 191.934H372.12v40.714h81.427V360.69zm56.242 80.264c-2.326 12.098-16.867 12.388-26.58 12.796H302.326v52.345h-36.119L0 459.566V52.492L267.778 5.904h34.548v46.355h174.66c9.83.407 20.648-.291 29.197 5.583c5.991 8.608 5.41 19.543 5.817 29.43l-.233 302.791c-.29 16.925 1.57 34.2-1.978 50.892zm-296.51-91.256c-16.052-32.57-32.395-64.909-48.39-97.48c15.82-31.698 31.408-63.512 46.937-95.327c-13.203.64-26.406 1.454-39.55 2.385c-9.83 23.904-21.288 47.169-28.965 71.888c-7.154-23.323-16.634-45.774-25.3-68.515c-12.796.698-25.592 1.454-38.387 2.21c13.493 29.78 27.86 59.15 40.946 89.104c-15.413 29.081-29.837 58.57-44.785 87.825c12.737.523 25.475 1.047 38.212 1.221c9.074-23.148 20.357-45.424 28.267-69.038c7.096 25.359 19.135 48.798 29.023 73.051c14.017.99 27.976 1.862 41.993 2.676zM484.26 79.882H302.326v24.897h46.53v40.713h-46.53v23.265h46.53v40.713h-46.53v23.265h46.53v40.714h-46.53v23.264h46.53v40.714h-46.53v23.264h46.53v40.714h-46.53v26.897H484.26V79.882z"
										/>
									</svg>
								</td>
								<td>CS-conversation-history.xls</td>
							</tr>
							<tr data-aos="fade-right">
								<td>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										viewBox="0 0 512 512"
									>
										<path
											fill="currentColor"
											d="M488.877 52.447H302.306V5.92h-34.779L0 52.563v406.99l265.957 46.527h36.349v-46.353h174.59c9.887-.465 20.879.291 29.37-5.757c6.804-10.41 5.06-23.438 5.641-35.186V75.012c1.221-13.26-9.77-23.903-23.03-22.565zm-294.862 282.59c-9.712 5.06-24.252-.233-35.767.581c-7.735-38.5-16.75-76.768-23.67-115.443c-6.805 37.57-15.645 74.79-23.438 112.128c-11.166-.581-22.39-1.28-33.615-2.035c-9.655-51.18-20.995-102.01-30.01-153.305c9.945-.465 19.948-.872 29.893-1.221c5.99 37.047 12.795 73.919 18.03 111.024c8.2-38.036 16.574-76.071 24.717-114.106c11.05-.64 22.1-1.105 33.15-1.687c7.735 39.257 15.644 78.455 24.019 117.537c6.572-40.361 13.841-80.607 20.879-120.91c11.631-.407 23.263-1.047 34.836-1.745c-13.143 56.355-24.659 113.176-39.024 169.182zm290.212 97.069H302.306v-36.527h151.21v-23.263h-151.21v-29.079h151.21v-23.263h-151.21v-29.08h151.21v-23.262h-151.21v-29.08h151.21V215.29h-151.21v-29.08h151.21v-23.263h-151.21v-29.079h151.21v-23.263h-151.21v-30.71h181.921v352.21z"
										/>
									</svg>
								</td>
								<td>FAQ.doc</td>
							</tr>
						</tbody>
					</div>
				</div>
			</section>
			<section class="md:h-screen md:min-h-[40em] pb-10">
				<div class="md:sticky top-20 py-10">
					<IntersectionObserver bind:intersecting={urlSectionIntersecting} top={0} />

					<h2 class="text-5xl font-bold flex items-center gap-4">
						<span
							class="aspect-square font-extralight border-primary text-xl text-primary border rounded-full h-8 items-center flex justify-center text-center"
						>
							2
						</span>
						<span>Connect Any URLs...</span>
					</h2>
					<div class="table my-10 table-zebra text-lg">
						<tbody>
							<tr data-aos="fade-right">
								<td>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="28"
										height="28"
										viewBox="0 0 20 20"
									>
										<g fill="currentColor">
											<path
												fill-rule="evenodd"
												d="M1.5 10a8.5 8.5 0 1 0 17 0a8.5 8.5 0 0 0-17 0Zm16 0a7.5 7.5 0 1 1-15 0a7.5 7.5 0 0 1 15 0Z"
												clip-rule="evenodd"
											/>
											<path
												fill-rule="evenodd"
												d="M6.5 10c0 4.396 1.442 8 3.5 8s3.5-3.604 3.5-8s-1.442-8-3.5-8s-3.5 3.604-3.5 8Zm6 0c0 3.889-1.245 7-2.5 7s-2.5-3.111-2.5-7S8.745 3 10 3s2.5 3.111 2.5 7Z"
												clip-rule="evenodd"
											/>
											<path
												d="m3.735 5.312l.67-.742c.107.096.221.19.343.281c1.318.988 3.398 1.59 5.665 1.59c1.933 0 3.737-.437 5.055-1.19a5.59 5.59 0 0 0 .857-.597l.65.76c-.298.255-.636.49-1.01.704c-1.477.845-3.452 1.323-5.552 1.323c-2.47 0-4.762-.663-6.265-1.79a5.81 5.81 0 0 1-.413-.34Zm0 9.388l.67.74c.107-.096.221-.19.343-.28c1.318-.988 3.398-1.59 5.665-1.59c1.933 0 3.737.436 5.055 1.19c.321.184.608.384.857.596l.65-.76a6.583 6.583 0 0 0-1.01-.704c-1.477-.844-3.452-1.322-5.552-1.322c-2.47 0-4.762.663-6.265 1.789c-.146.11-.284.223-.413.34ZM2 10.5v-1h16v1H2Z"
											/>
										</g>
									</svg>
								</td>
								<td class="w-full">https://www.chatnode.ai</td>
							</tr>
							<tr data-aos="fade-right">
								<td />
								<td>
									<div class="flex gap-6 text-base">
										<span>↳</span>
										<span>/about</span>
										<span>/features</span>
										<span>/faq</span>
										<span>/contact</span>
									</div>
								</td>
							</tr>
							<tr data-aos="fade-right">
								<td>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="28"
										height="28"
										viewBox="0 0 24 24"
									>
										<path
											fill="currentColor"
											d="M6.104 5.91c.584.474.802.438 1.898.365l10.332-.62c.22 0 .037-.22-.036-.256l-1.716-1.24c-.329-.255-.767-.548-1.606-.475l-10.005.73c-.364.036-.437.219-.292.365l1.425 1.13Zm.62 2.408v10.87c0 .585.292.803.95.767l11.354-.657c.657-.036.73-.438.73-.912V7.588c0-.474-.182-.73-.584-.693l-11.866.693c-.438.036-.584.255-.584.73Zm11.21.583c.072.328 0 .657-.33.694l-.547.109v8.025c-.475.256-.913.402-1.278.402c-.584 0-.73-.183-1.168-.73l-3.579-5.618v5.436l1.133.255s0 .657-.914.657l-2.519.146c-.073-.146 0-.51.256-.584l.657-.182v-7.187l-.913-.073c-.073-.329.11-.803.621-.84l2.702-.181l3.724 5.69V9.887l-.95-.109c-.072-.402.22-.693.585-.73l2.52-.146ZM4.131 3.429l10.406-.766c1.277-.11 1.606-.036 2.41.547l3.321 2.335c.548.401.731.51.731.948v12.805c0 .803-.292 1.277-1.314 1.35l-12.085.73c-.767.036-1.132-.073-1.534-.584L3.62 17.62c-.438-.584-.62-1.021-.62-1.533V4.706c0-.657.292-1.204 1.132-1.277Z"
										/>
									</svg>
								</td>
								<td>https://www.notion.so/chatnode/f6afe9e92</td>
							</tr>
							<tr data-aos="fade-right">
								<td>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="28"
										height="28"
										viewBox="0 0 24 24"
									>
										<g fill="none">
											<path
												d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"
											/>
											<path
												fill="currentColor"
												d="M13.586 2A2 2 0 0 1 15 2.586L19.414 7A2 2 0 0 1 20 8.414V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2ZM12 4H6v16h12V10h-4.5A1.5 1.5 0 0 1 12 8.5V4Zm3 10a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2h6Zm-5-4a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2Zm4-5.586V8h3.586L14 4.414Z"
											/>
										</g>
									</svg>
								</td>
								<td>https://docs.google.com/document/d/UV4u9uH0Q</td>
							</tr>
						</tbody>
					</div>
				</div>
			</section>

			<section class="md:h-screen md:min-h-[50em]">
				<div class="md:sticky top-20 py-10">
					<IntersectionObserver bind:intersecting={promptSectionIntersecting} top={0} />

					<h2 class="text-5xl font-bold flex items-center gap-4">
						<span
							class="aspect-square font-extralight border-primary text-xl text-primary border rounded-full h-8 items-center flex justify-center text-center"
						>
							3
						</span>
						<span>Customize Your Prompt.</span>
					</h2>
					<div
						class="my-10 rounded-xl bg-neutral p-4 leading-7 md:leading-8 md:text-lg font-light max-w-2xl"
					>
						I want you to act as a customer support AI for ChatNode that I am having a conversation
						with. Your name is "ChatNode AI". You will provide me with answers related to ChatNode.
						You will be as detailed as possible. Refuse to answer any question not about the text or
						ChatNode. Never break character. Always answer in the same language as the queston you
						are asked.
					</div>
				</div>
			</section>

			<section class="md:h-screen md:min-h-[50em]">
				<div class="md:sticky top-20 py-10">
					<IntersectionObserver bind:intersecting={brandSectionIntersecting} top={0} />
					<h2 class="text-5xl font-bold flex items-center gap-4 mb-10">
						<span
							class="aspect-square font-extralight border-primary text-xl text-primary border rounded-full h-8 items-center flex justify-center text-center"
						>
							4
						</span>
						<span>Add Your Branding</span>
					</h2>
					<div class="card bg-neutral card-compact mb-4">
						<div class="card-body">
							<div class="themes">
								<button
									class="btn bg-[#0F172A] text-[#818CF8]"
									on:click={() => showcaseTheme('default')}
								>
									Default
								</button>
								<button
									class="btn bg-[#3A3B3C] text-[#0084FF]"
									on:click={() => showcaseTheme('meta-dark')}
								>
									Meta Dark
								</button>
								<button
									class="btn bg-[white] text-[#3093FF]"
									on:click={() => showcaseTheme('ios-light')}
								>
									iOS Light
								</button>
								<button
									class="btn bg-[black] text-[#3093FF]"
									on:click={() => showcaseTheme('ios-dark')}
								>
									iOS Dark
								</button>
								<button
									class="btn bg-[#666666] text-[#333333]"
									on:click={() => showcaseTheme('neutral')}
								>
									Neutral
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section class="md:h-screen md:min-h-[50em]">
				<div class="md:sticky top-20 py-10">
					<IntersectionObserver bind:intersecting={brandSectionIntersecting} top={0} />
					<h2 class="text-5xl font-bold flex items-center gap-4 mb-10">
						<span
							class="aspect-square font-extralight border-primary text-xl text-primary border rounded-full h-8 items-center flex justify-center text-center"
						>
							5
						</span>
						<span>Connect to Crisp for live agent handling</span>
					</h2>
					<div
						class="my-10 rounded-xl bg-neutral p-4 leading-7 md:leading-8 md:text-lg font-light max-w-2xl"
					>
						The AI will solve 80% of your customer’s queries and hand off the chat to your Crisp if it can’t answer.
					</div>
				</div>
			</section>
		</div>

		<div>
			<div
				id="chat-wrapper"
				class="md:sticky top-1/4 rounded-2xl border-secondary bg-base-100 max-w-4xl mx-auto overflow-hidden h-[calc(50vh)]"
				data-aos="fade-up"
			>
				<Chat
					modelId="befbfc87e25911db"
					bind:messages
					settings={chatSettings}
					userId="5uDVaFgS32peeLl"
				/>
			</div>
		</div>
	</div>
</section>

<section>
	<WaysToShare />
</section>
