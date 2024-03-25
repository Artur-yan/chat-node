<button
  class="send-button btn btn-square btn-sm border-none rounded-lg join-item focus-within:outline-none absolute right-2 bottom-[0.4375rem]"
  type="submit"
  name="Send"
  style="background-color: var(--sendButtonBG); color: var(--sendButtonIconColor);"
>
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
    <path
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M9.912 12H4L2.023 4.135A.662.662 0 0 1 2 3.995c-.022-.721.772-1.221 1.46-.891L22 12L3.46 20.896c-.68.327-1.464-.159-1.46-.867a.66.66 0 0 1 .033-.186L3.5 15"
    />
  </svg>
</button>

<style lang="postcss">
	.send-button:focus {
		background-color: var(--sendButtonIconColor) !important;
		color: var(--sendButtonBG) !important;
	}
	@keyframes message {
		0% {
			opacity: 0.5;
			transform: scale(0.75);
		}
		60% {
			transform: scale(1.05);
		}
		100% {
			opacity: 1;
			transform: scale(1);
			overflow: visible;
		}
	}
</style>