<script>
	import Icon from '@iconify/svelte';
</script>

<section
	class="text-center flex flex-col"
>
	<div class="flex items-end justify-center">
		<div>
			<h2><Icon icon="iconoir:code" width={32} />Embed anywhere</h2>
		<div class="dot dot-bl"></div>

		</div>
		<div>
		
			<h2><Icon icon="fluent:chat-12-regular" width={30} />Chatbot</h2>
		<div class="dot dot-bl"></div>
		<div class="dot dot-br"></div>


		</div>
	</div>
	<div class="flex items-end justify-center">
	
		<div>
		
			<h2>
				<Icon icon="ic:twotone-invert-colors" width={32} />Multiple data sources
			</h2>
		</div>
		<div>
		
			<h2>
				<Icon icon="ri:exchange-funds-fill" width={32} />Test & Modify Fast
			</h2>
		<div class="dot dot-bl"></div>
		<div class="dot dot-br"></div>
			<p>
		</div>
		<div>
		
			<h2><Icon icon="ic:round-person-4" width={32} />Custom prompts</h2>
		</div>
	</div>
	<div class="flex items-end justify-center">
	<div>
	
		<h2><Icon icon="devicon:slack" width={24} />Slack integration</h2>
	</div>
	<div>
	
		<h2><Icon icon="ic:twotone-invert-colors" width={32} />Custom design</h2>
	</div>
	</div>
</section>

<style lang="postcss">
	section > div {
		@apply items-stretch;
	}
	section > div > div {
		@apply w-[25vw] pb-12 pt-14 px-2 -m-[0.5px] relative border border-accent/10 shadow-xl;
	}

	h2 {
		@apply text-lg font-bold tracking-wide flex flex-col items-center gap-2;
	}

	p {
		@apply max-w-2xl;
	}

	.dot{
		@apply absolute w-1 h-1 rounded-full bg-secondary z-10;
	}

	.dot-bl {
		@apply -bottom-[0.125rem] -left-[0.125rem];
	}

	.dot-br {
		@apply -bottom-[0.125rem] -right-[0.125rem];
	}

	.dot-tl {
		@apply -top-[0.125rem] -left-[0.125rem];
	}

	.dot-tr {
		@apply -top-[0.125rem] -right-[0.125rem];
	}
</style>
