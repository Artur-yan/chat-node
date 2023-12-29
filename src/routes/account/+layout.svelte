<script lang="ts">
	import type { LayoutData } from './$types';
	import {
		PUBLIC_ENVIRONMENT,
		PUBLIC_PLAUSIBLE_DOMAIN,
		PUBLIC_PLAUSIBLE_API_HOST, PUBLIC_EMBED_URL
	} from "$env/static/public";

	import '../../app.postcss';
	import HeaderAdmin from '$lib/components/HeaderAdmin.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import Plausible from 'plausible-tracker';
	import { onMount } from 'svelte';
	import { alert } from '$lib/stores';
	import { systemSettings } from '$lib/systemSettings';
	import { slide } from 'svelte/transition';

	export let data: LayoutData;

	onMount(() => {
		const { enableAutoPageviews } = Plausible({
			domain: PUBLIC_PLAUSIBLE_DOMAIN,
			apiHost: PUBLIC_PLAUSIBLE_API_HOST
		});
		enableAutoPageviews();
	});

	if (systemSettings.maintenanceAlert) {
		alert.set({
			type: 'warning',
			msg: systemSettings.maintenanceMsg,
			duration: 2000 + systemSettings.maintenanceMsg.length * 50
		});
	}
</script>

<svelte:head>
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
		profitwell('start', { 'user_email': '${data.user.email}' });
		</script>`}
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

	<!-- {@html `<script>
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
		fbq('init', '588241380143151', {
			em: '${data.user.email}'
		});
		fbq('track', 'PageView');
	</script>`} -->
	<!-- <noscript>
		<img
			height="1"
			width="1"
			src="https://www.facebook.com/tr?id=588241380143151&ev=PageView
	&noscript=1"
			alt=""
		/>
	</noscript> -->

	<!-- <noscript>
		<img
			height="1"
			width="1"
			src="https://www.facebook.com/tr?id=588241380143151&ev=PageView
	&noscript=1"
			alt=""
		/>
	</noscript> -->
<!--	<script-->
<!--		src="https://www.chatnode.ai/embed.js"-->
<!--		data-chatbot-id="befbfc87e25911db"-->
<!--		data-color-1="#0E1729"-->
<!--		data-color-2="#3ABFF7"-->
<!--	></script>-->
	{@html `<script src="${PUBLIC_EMBED_URL}/${PUBLIC_BOT_ID}/popup.js"></script>`}

	<script>
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
	</script>
</svelte:head>

<HeaderAdmin />

<main class="flex flex-col flex-1">
	{#if data.subscription.plan === 1006 && !data.user.default_openai_key}
		<div class="container my-4">
			<div
				class="alert bg-neutral justify-between flex items-center border-warning"
				transition:slide
			>
				<div>
					<h3 class="text-lg font-bold text-warning">Default OpenAI API Key</h3>
					<p>
						Your agency plan requires entering a default OpenAI key. You can override the api key
						per bot.
					</p>
				</div>
				<a class="btn" href="/account/settings">Go to Settings</a>
			</div>
		</div>
	{/if}

	{#if PUBLIC_ENVIRONMENT === 'production'}
		<!-- Google Tag Manager (noscript) -->
		<noscript>
			<iframe
				src="https://www.googletagmanager.com/ns.html?id=GTM-THN99BCW"
				height="0"
				width="0"
				style="display:none;visibility:hidden"
			/>
		</noscript>
		<!-- End Google Tag Manager (noscript) -->
	{/if}

	<slot />
</main>

<Toast />
