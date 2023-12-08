<script lang="ts">
	import '../../app.postcss';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Plausible from 'plausible-tracker';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import {
		PUBLIC_ENVIRONMENT,
		PUBLIC_PLAUSIBLE_DOMAIN,
		PUBLIC_PLAUSIBLE_API_HOST
	} from '$env/static/public';

	onMount(() => {
		const { enableAutoPageviews } = Plausible({
			domain: PUBLIC_PLAUSIBLE_DOMAIN,
			apiHost: PUBLIC_PLAUSIBLE_API_HOST
		});
		enableAutoPageviews();
	});
</script>

<svelte:head>
	<script
		type="text/javascript"
		src="https://app.termly.io/embed.min.js"
		data-auto-block="on"
		data-website-uuid="4f4e94f0-314b-43e8-a338-6dbd736a0242"
	></script>
	<link rel="canonical" href="https://www.chatnode.ai{$page.url.pathname}" />

	<script>
window.requestIdleCallback = window.requestIdleCallback ||
 function (cb) {
 return setTimeout(function () {
 var start = Date.now();
 cb({
 didTimeout: false,
 timeRemaining: function () {
 return Math.max(0, 50 - (Date.now() - start));
 }
 });
 }, 1);
}
function idleWrapper() {
 (function (h, o, t, j, a, r) {
			h.hj =
				h.hj ||
				function () {
					(h.hj.q = h.hj.q || []).push(arguments);
				};
			h._hjSettings = { hjid: 3497330, hjsv: 6 };
			a = o.getElementsByTagName('head')[0];
			r = o.createElement('script');
			r.async = 1;
			r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
			a.appendChild(r);
		})(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
}
window.requestIdleCallback(idleWrapper, {timeout: 10000});

		// (function (h, o, t, j, a, r) {
		// 	h.hj =
		// 		h.hj ||
		// 		function () {
		// 			(h.hj.q = h.hj.q || []).push(arguments);
		// 		};
		// 	h._hjSettings = { hjid: 3497330, hjsv: 6 };
		// 	a = o.getElementsByTagName('head')[0];
		// 	r = o.createElement('script');
		// 	r.async = 1;
		// 	r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
		// 	a.appendChild(r);
		// })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
	</script>

	{#if PUBLIC_ENVIRONMENT === 'production'}
		<!-- Google Tag Manager -->
		<!-- Google Tag Manager -->
		<script>
			(function (w, d, s, l, i) {
				w[l] = w[l] || [];
				w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
				var f = d.getElementsByTagName(s)[0],
					j = d.createElement(s),
					dl = l != 'dataLayer' ? '&l=' + l : '';
				j.async = true;
				j.src = 'https://web.chatnode.ai/zaxunjhy.js?id=' + i + dl;
				f.parentNode.insertBefore(j, f);
			})(window, document, 'script', 'dataLayer', 'GTM-THN99BCW');
		</script>
		<!-- End Google Tag Manager -->
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
			(function (j, i, m, o) {
				var s = document.createElement('script');

				s.type = 'text/javascript';
				s.async = true;
				s.src = 'https://undercity.usejimo.com/jimo-invader.js';
				j['JIMO_PROJECT_ID'] = '51210e7b-6983-43c8-be8d-652f4c5c3a2b';
				document.getElementsByTagName('head')[0].appendChild(s);
			})(window);
		</script>
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
		<noscript>
			<iframe
				src="https://www.googletagmanager.com/ns.html?id=GTM-THN99BCW"
				height="0"
				width="0"
				style="display:none;visibility:hidden"
				title="Google Tag Manager"
			/>
		</noscript>
		<!-- End Google Tag Manager (noscript) -->
	{/if}

	<slot />
</main>

<Footer />
