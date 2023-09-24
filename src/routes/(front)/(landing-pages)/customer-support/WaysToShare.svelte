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



		<div class="text-center flex flex-col h-full">
			<div class="mockup-window relative bg-neutral shadow-lg h-full">
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
						>
							<path
								fill="currentColor"
								d="M4.5 0h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 .854.354L2.5 3.207l11.646 11.647l.708-.708L3.207 2.5L4.854.854A.5.5 0 0 0 4.5 0Z"
							/>
						</svg>
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
								>
									<g>
										<path
											d="m0 32c0-17.673 14.327-32 32-32s32 14.327 32 32-14.327 32-32 32-32-14.327-32-32z"
											class="fill-base-100"
										/>
										<path
											d="m26 16c-5.5228 0-10 4.4772-10 10v12c0 5.5228 4.4772 10 10 10h19.5c1.3807 0 2.5-1.1193 2.5-2.5v-19.5c0-5.5228-4.4772-10-10-10h-12zm-0.75 16c0 1.1046-0.8954 2-2 2s-2-0.8954-2-2 0.8954-2 2-2 2 0.8954 2 2zm8.75 0c0 1.1046-0.8954 2-2 2s-2-0.8954-2-2 0.8954-2 2-2 2 0.8954 2 2zm6.75 2c1.1046 0 2-0.8954 2-2s-0.8954-2-2-2-2 0.8954-2 2 0.8954 2 2 2z"
											fill-rule="evenodd"
										/>
									</g>
								</svg>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
