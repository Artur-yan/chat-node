<script lang="ts">
  export let avatar: string | undefined;
</script>

<div class="chat chat-start">
  {#if avatar}
    <div class="chat-image avatar">
      <div class="w-10 rounded-full">
        <img src={avatar} alt="" />
      </div>
    </div>
  {/if}
  <div
    class="chat-bubble"
    style="background-color: var(--botBubbleBG); color: var(--botBubbleText)"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <circle cx="4" cy="12" r="3" fill="currentColor">
        <animate
          id="svgSpinners3DotsBounce0"
          attributeName="cy"
          begin="0;svgSpinners3DotsBounce1.end+0.25s"
          calcMode="spline"
          dur="0.6s"
          keySplines=".33,.66,.66,1;.33,0,.66,.33"
          values="12;6;12"
        />
      </circle>
      <circle cx="12" cy="12" r="3" fill="currentColor">
        <animate
          attributeName="cy"
          begin="svgSpinners3DotsBounce0.begin+0.1s"
          calcMode="spline"
          dur="0.6s"
          keySplines=".33,.66,.66,1;.33,0,.66,.33"
          values="12;6;12"
        />
      </circle>
      <circle cx="20" cy="12" r="3" fill="currentColor">
        <animate
          id="svgSpinners3DotsBounce1"
          attributeName="cy"
          begin="svgSpinners3DotsBounce0.begin+0.2s"
          calcMode="spline"
          dur="0.6s"
          keySplines=".33,.66,.66,1;.33,0,.66,.33"
          values="12;6;12"
        />
      </circle>
    </svg>
  </div>
</div>