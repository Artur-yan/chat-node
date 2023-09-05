<script lang="ts">
	import '../../app.postcss';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Plausible from 'plausible-tracker';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { PUBLIC_ENVIRONMENT, PUBLIC_PLAUSIBLE_DOMAIN, PUBLIC_PLAUSIBLE_API_HOST } from '$env/static/public';

	onMount(() => {
		const { enableAutoPageviews } = Plausible({
			domain: PUBLIC_PLAUSIBLE_DOMAIN,
			apiHost: PUBLIC_PLAUSIBLE_API_HOST
		});
		enableAutoPageviews();
	});
</script>

<svelte:head>
	<link rel="canonical" href="https://www.chatnode.ai{$page.url.pathname}" />

	{#if PUBLIC_ENVIRONMENT === 'production'}
		<!-- Google Tag Manager -->
		<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
			new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
			j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
			'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
			})(window,document,'script','dataLayer','GTM-THN99BCW');</script>
		<!-- End Google Tag Manager -->
		<script>
			// Rewardful
			(function (w, r) {
				w._rwq = r;
				w[r] =
					w[r] ||
					function () {
						(w[r].q = w[r].q || []).push(arguments);
					};
			})(window, 'rewardful');
		</script>
		{@html `<script id="profitwell-js" data-pw-auth="64cdfa4a4526d24d3a185319fc6ca127">
	(function(i,s,o,g,r,a,m){i[o]=i[o]||function(){(i[o].q=i[o].q||[]).push(arguments)}; a=s.createElement(g);m=s.getElementsByTagName(g)[0];a.async=1;a.src=r+'?auth='+s.getElementById(o+'-js').getAttribute('data-pw-auth');m.parentNode.insertBefore(a,m);})(window,document,'profitwell','script','https://public.profitwell.com/js/profitwell.js');
	profitwell('start', {});
	</script>`}
		<script async src="https://r.wdfl.co/rw.js" data-rewardful="1564fe"></script>
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
				alt=""
			/>
		</noscript>
	{/if}

	<script
		src="https://www.chatnode.ai/embed.js"
		data-chatbot-id="befbfc87e25911db"
		data-color-1="#0E1729"
		data-color-2="#3ABFF7"
	></script>
</svelte:head>

<Header />

<main id="main" class="flex-1">
	{#if PUBLIC_ENVIRONMENT === 'production'}
		<!-- Google Tag Manager (noscript) -->
		<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-THN99BCW"
			height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
		<!-- End Google Tag Manager (noscript) -->
	{/if}

	<slot />
</main>

<Footer />
