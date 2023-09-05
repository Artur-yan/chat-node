<script lang="ts">
	import type { LayoutData } from './$types';
	import { PUBLIC_ENVIRONMENT, PUBLIC_PLAUSIBLE_DOMAIN, PUBLIC_PLAUSIBLE_API_HOST } from '$env/static/public';

	import '../../app.postcss';
	import HeaderAdmin from '$lib/components/HeaderAdmin.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import Plausible from 'plausible-tracker';
	import { onMount } from 'svelte';
	import { alert } from '$lib/stores';
	import systemSettings from '$lib/systemSettings';

	export let data: LayoutData;

	onMount(() => {
		if (PUBLIC_ENVIRONMENT === 'production') {
			const { enableAutoPageviews } = Plausible({
				domain: PUBLIC_PLAUSIBLE_DOMAIN,
				apiHost: PUBLIC_PLAUSIBLE_API_HOST
		});
			enableAutoPageviews();
		}
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
		<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
			new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
			j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
			'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
			})(window,document,'script','dataLayer','GTM-THN99BCW');</script>
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
		profitwell('start', { 'user_email': '${data.user.user.email}' });
		</script>`}
	{/if}
	<script
		src="https://www.chatnode.ai/embed.js"
		data-chatbot-id="befbfc87e25911db"
		data-color-1="#0E1729"
		data-color-2="#3ABFF7"
	></script>
</svelte:head>

<HeaderAdmin />

<main class="flex flex-col flex-1">

	{#if PUBLIC_ENVIRONMENT === 'production'}
		<!-- Google Tag Manager (noscript) -->
		<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-THN99BCW"
			height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
		<!-- End Google Tag Manager (noscript) -->
	{/if}

	<slot />
</main>

<Toast />
