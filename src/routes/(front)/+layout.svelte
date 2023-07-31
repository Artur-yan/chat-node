<script lang="ts">
	import '../../app.postcss';
	import Header from '$lib/components/Header.svelte';
	import type { LayoutData } from './$types';
	import Footer from '$lib/components/Footer.svelte';
	import Plausible from 'plausible-tracker';
	import { onMount } from 'svelte';

	onMount(() => {
		const { enableAutoPageviews } = Plausible({
			domain: 'chatnode.ai',
			apiHost: 'https://www.chatnode.ai/events'
		});
		enableAutoPageviews();
	});

	export let data: LayoutData;
</script>

<svelte:head>
	<script
		src="https://www.chatnode.ai/embed.js"
		data-chatbot-id="befbfc87e25911db"
		data-color-1="#0E1729"
		data-color-2="#3ABFF7"
	></script>
	<script>
		(function (w, r) {
			w._rwq = r;
			w[r] =
				w[r] ||
				function () {
					(w[r].q = w[r].q || []).push(arguments);
				};
		})(window, 'rewardful');
	</script>
	<script async src="https://r.wdfl.co/rw.js" data-rewardful="1564fe"></script>
	<!-- Facebook Pixel Code -->
	<!-- Facebook Pixel Code -->
	<!-- Facebook Pixel Code -->
	<script>
		!(function (f, b, e, v, n, t, s) {
			if (f.fbq) return;
			n = f.fbq = function () {
				n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
			};
			if (!f._fbq) f._fbq = n;
			n.push = n;
			n.loaded = !0;
			n.version = '2.0';
			n.queue = [];
			t = b.createElement(e);
			t.async = !0;
			t.src = v;
			s = b.getElementsByTagName(e)[0];
			s.parentNode.insertBefore(t, s);
		})(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
		fbq('init', '588241380143151');
		fbq('track', 'PageView');
	</script>
	<noscript>
		<img
			height="1"
			width="1"
			src="https://www.facebook.com/tr?id=588241380143151&ev=PageView
	&noscript=1"
		/>
	</noscript>
	<!-- End Facebook Pixel Code -->
</svelte:head>

<Header user={data.user} includePageLinks={true} />

<main id="main">
	<slot />
</main>

<Footer />
