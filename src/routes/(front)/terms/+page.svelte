<script>
  import { onMount } from "svelte";

  onMount(() => {
    if (typeof window !== "undefined") {
      (function(d, s, id) {
    var js, tjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://app.termly.io/embed-policy.min.js";
    tjs.parentNode.insertBefore(js, tjs);
  }(document, 'script', 'termly-jssdk'));
    }
  });
</script>

<svelte:head>
	<title>Terms of Service | ChatNode</title>
	<meta
		name="description"
		content="Our services allow you to generate and use chatbots that are trained on your data."
	/>
	<link rel="“canonical”" href="https://www.chatnode.ai/terms" />
</svelte:head>

<div class="container">
  <div name="termly-embed" data-id="515d9ae0-2f38-497b-aace-c1250d149dd1"></div>
</div>