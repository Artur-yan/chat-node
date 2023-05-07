<script lang="ts">
	import type { LayoutData } from './$types';

	import '../../app.postcss';
	import Header from '$lib/components/Header.svelte';
	import Toast from '$lib/components/Toast.svelte';

	export let data: LayoutData;
</script>

<Header user={data.user} />

<slot />

<Toast />
