<script lang="ts">
    	let arrow: HTMLDivElement;
	let innerHeight: number;
	let innerWidth: number;
	let scrollY: number;

	let arrowRotation: number;

	const trig = () => {
		const arrowPosition = arrow.getBoundingClientRect();
		const trigO = innerHeight - arrowPosition.top - 72;
		const trigA = innerWidth - arrowPosition.left - 72;
		const theta = Math.atan(trigO / trigA);

		arrowRotation = theta;
	};
</script>

<svelte:window bind:scrollY bind:innerHeight bind:innerWidth on:scroll={trig} />


<section class="py-20 container !max-w-7xl">
	<div class="flex justify-center">
		<h2 class="font-bold text-3xl relative py-4 px-8">
			<div class="dot-corners">
				<div />
				<div />
			</div>
			Ways to Share
		</h2>
	</div>

	<div class="md:grid md:grid-cols-2 my-10">
		<div class="p-6 text-center border-r border-b border-neutral">
			<h3 class="font-bold mb-4 text-xl flex items-center justify-center gap-2">
				<div class="text-secondary">
					<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
						><path
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M13.5 6L10 18.5m-3.5-10L3 12l3.5 3.5m11-7L21 12l-3.5 3.5"
						/></svg
					>
				</div>
				Embed
			</h3>

			<div class="mockup-window bg-neutral shadow-lg p-4 pb-8">
				<div class="inline-block h-4 w-24 bg-base-100 rounded-full mx-auto mb-3" />
				<div class="inline-block h-4 w-16 bg-base-100 rounded-full mx-auto mb-3" />
				<div class="p-2 bg-base-200 border-accent rounded-lg border mx-8">
					<div>
						<div class="chat chat-start">
							<div class="chat-bubble w-48" />
						</div>
						<div class="chat chat-end">
							<div class="chat-bubble w-32" />
						</div>
					</div>
				</div>
				<div class="h-2 w-64 bg-base-100 rounded-full mx-auto mt-6 my-2" />
				<div class="h-2 w-56 bg-base-100 rounded-full mx-auto my-2" />
			</div>
		</div>

		<div class="text-center flex flex-col p-6 border-b border-neutral" onclick="toggleChat()">
			<h3 class="font-bold mb-4 text-xl flex items-center justify-center gap-2">
				<div class="text-secondary">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
						><g transform="translate(24 0) scale(-1 1)"
							><g fill="none"
								><path
									d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"
								/><path
									fill="currentColor"
									d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10H4a2 2 0 0 1-2-2v-8C2 6.477 6.477 2 12 2Zm0 2a8 8 0 0 0-8 8v8h8a8 8 0 1 0 0-16Zm0 10a1 1 0 0 1 .117 1.993L12 16H9a1 1 0 0 1-.117-1.993L9 14h3Zm3-4a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2h6Z"
								/></g
							></g
						></svg
					>
				</div>
				Popup Chat
			</h3>
			<div class="mockup-window relative bg-neutral shadow-lg p-4 h-full min-h-[240px]">
				<div
					bind:this={arrow}
					class="absolute z-10 w-12 left-1/4 top-1/2 flex items-center justify-center aspect-square text-4xl text-primary transition-transform duration-75"
					style="transform: rotate({arrowRotation}rad);"
				>
					<div>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="rotate-[135deg]"
							width="48"
							height="48"
							viewBox="0 0 15 15"
							><path
								fill="currentColor"
								d="M4.5 0h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 .854.354L2.5 3.207l11.646 11.647l.708-.708L3.207 2.5L4.854.854A.5.5 0 0 0 4.5 0Z"
							/></svg
						>
					</div>
					<div
						class="absolute -top-[1.5rem] -left-[1.5rem] radial-progress text-primary/20"
						style="--size: 6rem; --value: 50; --thickness: 4px; transform: rotate({arrowRotation *
							15}rad);"
					/>
				</div>

				<div class="absolute bottom-4 right-4">
					<div class="max-w-xs">
						<div class="p-2 bg-base-200 border-accent rounded-lg border">
							<div>
								<div class="chat chat-start">
									<div class="chat-bubble w-48" />
								</div>
								<div class="chat chat-end">
									<div class="chat-bubble w-32" />
								</div>
							</div>
						</div>
						<div class="flex items-center justify-end mt-2">
							<div role="button" style="outline: 0; border: none; width:32px; height: 32px;">
								<svg
									class="fill-primary"
									clip-rule="evenodd"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-miterlimit="10"
									version="1.1"
									viewBox="0 0 64 64"
									xml:space="preserve"
									xmlns="http://www.w3.org/2000/svg"
									><g
										><path
											d="m0 32c0-17.673 14.327-32 32-32s32 14.327 32 32-14.327 32-32 32-32-14.327-32-32z"
											class="fill-base-100"
										/><path
											d="m26 16c-5.5228 0-10 4.4772-10 10v12c0 5.5228 4.4772 10 10 10h19.5c1.3807 0 2.5-1.1193 2.5-2.5v-19.5c0-5.5228-4.4772-10-10-10h-12zm-0.75 16c0 1.1046-0.8954 2-2 2s-2-0.8954-2-2 0.8954-2 2-2 2 0.8954 2 2zm8.75 0c0 1.1046-0.8954 2-2 2s-2-0.8954-2-2 0.8954-2 2-2 2 0.8954 2 2zm6.75 2c1.1046 0 2-0.8954 2-2s-0.8954-2-2-2-2 0.8954-2 2 0.8954 2 2 2z"
											fill-rule="evenodd"
										/></g
									></svg
								>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="p-6 border-r border-neutral">
			<h3 class="font-bold mb-4 text-xl flex items-center justify-center gap-2">
				<div class="text-secondary">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
						><g transform="translate(24 0) scale(-1 1)"
							><g fill="none"
								><path
									d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"
								/><path
									fill="currentColor"
									d="M10.232 10.231a5 5 0 0 1 6.89-.172l.181.172l2.828 2.829a5 5 0 0 1-6.89 7.243l-.18-.172l-2.122-2.122a1 1 0 0 1 1.32-1.497l.094.083l2.122 2.122a3 3 0 0 0 4.377-4.1l-.135-.143l-2.828-2.829a3 3 0 0 0-4.243 0a1 1 0 0 1-1.414-1.414ZM3.868 3.867a5 5 0 0 1 6.89-.172l.181.172L13.06 5.99a1 1 0 0 1-1.32 1.497l-.094-.083l-2.121-2.121A3 3 0 0 0 5.147 9.38l.135.144l2.829 2.829a3 3 0 0 0 4.242 0a1 1 0 1 1 1.415 1.414a5 5 0 0 1-6.89.172l-.182-.172l-2.828-2.829a5 5 0 0 1 0-7.07Z"
								/></g
							></g
						></svg
					>
				</div>
				URL
			</h3>

			<div class="mockup-browser bg-neutral h-full">
				<div class="mockup-browser-toolbar">
					<div class="input text-sm text-accent items-center !flex">
						https://www.yoursharelink.com
					</div>
				</div>
				<div class="p-4 pb-16 bg-base-200">
					<div>
						<div class="chat chat-start">
							<div class="chat-bubble w-48" />
						</div>
						<div class="chat chat-end">
							<div class="chat-bubble w-32" />
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="p-6">
			<h3 class="font-bold mb-4 text-xl flex items-center justify-center gap-2">
				<div class="text-secondary">
					<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
						><path
							fill="currentColor"
							d="M6 15a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2h2v2m1 0a2 2 0 0 1 2-2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-5m2-8a2 2 0 0 1-2-2a2 2 0 0 1 2-2a2 2 0 0 1 2 2v2H9m0 1a2 2 0 0 1 2 2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5m8 2a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-2v-2m-1 0a2 2 0 0 1-2 2a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2a2 2 0 0 1 2 2v5m-2 8a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-2h2m0-1a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-5Z"
						/></svg
					>
				</div>

				Slack
			</h3>

			<div class="mockup-browser bg-neutral h-full">
				<div class="mockup-browser-toolbar">
					<div class="input text-sm text-accent items-center !flex">
						https://yourworkspace.slack.com
					</div>
				</div>
				<div class="grid grid-cols-[100px_auto] h-full bg-base-300">
					<div class="bg-neutral">
						<ul class="space-y-2 mx-4">
								<li class="rounded-full h-1 bg-base-300" />
								<li class="rounded-full h-1 bg-base-300" />
								<li class="rounded-full h-1 bg-base-300" />
						</ul>
						<hr class="border-base-100 my-4" />
						<ul class="space-y-2 mx-4">
								<li class="rounded-full h-1 bg-base-100" />
								<li class="rounded-full h-1 bg-accent" />
								<li class="rounded-full h-1 bg-base-100" />
								<li class="rounded-full h-1 bg-base-100" />
								<li class="rounded-full h-1 bg-base-100" />
						</ul>
					</div>
					<div>
						<ul class="space-y-2 m-4">
							<li class="rounded-full h-1 bg-white/20 w-1/2" />
							<li class="rounded-full h-1 bg-white/20 w-1/3" />
							<li class="rounded-full h-1 bg-white/20 w-3/4" />
							<li class="rounded-full h-1 bg-white/20 w-1/2" />
						</ul>
						<hr class="border-neutral my-4" />
						<ul class="space-y-2 m-4">
							<li class="rounded-full h-1 bg-white/20 w-3/5" />
							<li class="rounded-full h-1 bg-white/20 w-2/3" />
							<li class="rounded-full h-1 bg-white/20 w-5/12" />
							<li class="rounded-full h-1 bg-white/20 w-7/12" />
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>