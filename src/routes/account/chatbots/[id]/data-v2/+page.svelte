<script lang="ts">
	import { PUBLIC_CHAT_API_URL } from '$env/static/public';
	import AddModelDataV2 from '$lib/components/AddModelDataV2.svelte';
	import { alert, currentBot } from '$lib/stores.js';
	import Accordian from '$lib/components/Accordian.svelte';
	import { getText, updateText } from '$lib/textSource';
	import { onMount } from 'svelte';
	import { PUBLIC_EMBED_URL } from '$env/static/public';
	import BotStatus from '$lib/components/BotStatus.svelte';
	import WebScraping from '$lib/components/data/WebScraping.svelte';
	import Files from '$lib/components/data/Files.svelte';
	import Text from '$lib/components/data/Text.svelte';

	export let data;

	let { urls } = data.modelData;
	let trainingStatus: any = undefined;
	let modelId = data.model.id;
	let sourceToDelete: Object;
	let activeDataTab: string;
	let textSourceToEdit: Object;
	let textSourceValue: string;
	let selectedUrls: Array<string> = [];
	let trainingOnLoad = data.modelData.areTraining.length > 0;

	if (Object.keys(urls).length) {
		activeDataTab = 'urls';
	} else if (data.modelData?.files.length) {
		activeDataTab = 'files';
	} else if (data.modelData?.texts.length) {
		activeDataTab = 'text';
	} else if (data.modelData?.legacyUrls.length) {
		activeDataTab = 'legacy-urls';
	}

	function gatherSubUrlsS3Keys(base_url: string) {
		let s3Keys = [];
		data.modelData?.urls[base_url].forEach((urlObj) => {
			s3Keys.push(urlObj.s3_key);
		});

		return s3Keys;
	}

	function sanitizeS3KeyAsId(s3_key: string) {
		return 'id-' + s3_key.replace(/\//g, '--');
	};

	async function deleteBotSource(s3_keys: Array<string>, base_url: string | undefined) {
		let body = new FormData();
		body.append('user_id', data.model.user_id);
		body.append('session_id', data.session.sessionId);
		body.append('bot_id', data.model.id);
		body.append('s3_keys', s3_keys);

		const res = await fetch(PUBLIC_CHAT_API_URL + '/api/delete-data', {
			method: 'POST',
			body
		});

		if (res.ok) {
			$alert = { msg: 'Data deleted', type: 'success' };

			if (base_url) {
				const elem = document.getElementById(base_url);
				elem.remove();
			} else {
				const elem = document.getElementById(sanitizeS3KeyAsId(sourceToDelete.s3_key));
				elem.remove();
			}
		}
	}

	async function updateBotSources(s3_keys: Array<string>) {
		console.log('updating sources', s3_keys);
		if (s3_keys.length === 0) {
			trainingStatus = 'ready';
			console.log('no sources to update');
			return;
		}
		trainingStatus = 'training';

		let incompleteSourcesS3Keys: Array<string> = [];

		let res = await fetch('/api/data-sources/update', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				s3_keys
			})
		});

		let updatedDataSources = await res.json();

		updatedDataSources.forEach((source) => {
			const row = document.getElementById(sanitizeS3KeyAsId(source.s3_key));
			row.setAttribute('data-training-status', source.status);
			row.querySelector('.training-status').innerHTML = source.status || 'error';
			row.querySelector('.token-count').innerHTML = source.token_count || '-';
			if (source.status !== 'trained') {
				incompleteSourcesS3Keys.push(source.s3_key);
			}
		});

		await new Promise((r) => setTimeout(r, 3000));

		updateBotSources(incompleteSourcesS3Keys);
	}

	async function editTextSource(textObj) {
		textSourceToEdit = null;
		textSourceValue = null;
		editTextSourceModal.showModal();

		const res = await getText(
			textObj.id,
			new Array(textObj.s3_key),
			data.model.user_id,
			data.session.sessionId
		);
		textSourceToEdit = res;
		textSourceValue = Object.values(res)[0];
	}

	async function handleTextUpdate(source_key: string, text: string) {
		await updateText(source_key, data.model.id, text, data.model.user_id, data.session.sessionId);
		updateBotSources([source_key])
	}

	async function retrainUrls(s3_keys: Array<string>) {
		s3_keys.forEach((s3_key) => {
			const row = document.getElementById(sanitizeS3KeyAsId(s3_key));
			row?.setAttribute('data-training-status', 'starting');
			row.querySelector('.training-status').innerHTML = 'starting';
		});

		let body = new FormData();
		body.append('user_id', data.model.user_id);
		body.append('session_id', data.session.sessionId);
		body.append('chat_key', data.model.id);
		body.append('source_keys', s3_keys);

		const res = await fetch(PUBLIC_CHAT_API_URL + '/api/retrain-urls', {
			method: 'POST',
			body
		});

		if (res.ok) {
			updateBotSources(s3_keys);
		}
	}

	onMount(() => {
		const objsToCheck = Object.values(data.modelData?.urls)
		const urlsToCheck = objsToCheck.map((obj) => {
			return obj.map((urlObj) => {
				return urlObj.s3_key;
			});
		}).flat();

		if(data.modelData?.areTraining.length > 0) {
			updateBotSources(urlsToCheck);
		} else {
			trainingStatus = 'ready';
		}
	});
</script>

<svelte:head>
	<title>Data v2 | {data.model.name} | ChatNode</title>
</svelte:head>

<div class="container grid md:grid-cols-3 lg:grid-cols-[auto_32rem] gap-4 my-4">
	<div class="grid grid-cols-3 gap-8 my-4">
		<WebScraping />
		<Files />
		<Text />
	</div>
	<div>
		<div
			class="h-[calc(100vh_-_16rem)] sticky top-4 mb-10 hidden sm:block rounded-2xl overflow-hidden"
		>
		<iframe class="w-full h-full" src="{PUBLIC_EMBED_URL}/{$currentBot.id}" frameborder="0"></iframe>
		</div>
	</div>
</div>

<style lang="postcss">
	tr[data-training-status='trained'] .training-status {
		@apply hidden;
	}
	tr[data-training-status='training'] .training-status {
		@apply badge-primary;
	}
	tr:is([data-training-status='training'], [data-training-status='scraping']) .training-status {
		@apply animate-pulse;
	}
	tr[data-training-status='failed'] .training-status {
		@apply !badge-error;
	}
</style>
