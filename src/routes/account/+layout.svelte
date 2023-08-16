<script lang="ts">
	import type { LayoutData } from './$types';

	import '../../app.postcss';
	import HeaderAdmin from '$lib/components/HeaderAdmin.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import Plausible from 'plausible-tracker';
	import { onMount } from 'svelte';
	import { alert } from '$lib/stores';
	import systemSettings from '$lib/systemSettings';

	export let data: LayoutData;

	onMount(() => {
		const { enableAutoPageviews } = Plausible({
			domain: 'chatnode.ai',
			apiHost: 'https://www.chatnode.ai/events'
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
	<script
		src="https://www.chatnode.ai/embed.js"
		data-chatbot-id="befbfc87e25911db"
		data-color-1="#0E1729"
		data-color-2="#3ABFF7"
	></script>
</svelte:head>

<HeaderAdmin user={data.user} />

<main class="flex flex-col flex-1">
	<slot />
</main>

<Toast />
