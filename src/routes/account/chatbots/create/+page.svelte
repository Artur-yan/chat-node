<script lang="ts">
    import ChatWindow from '../../../(chat)/ChatWindow.svelte';
    import ChatBubble from '../../../(chat)/ChatBubble.svelte';
    import ChatInput from '../../../(chat)/ChatInput.svelte';
	import ColorPicker from 'svelte-awesome-color-picker';
	import { Dropzone, Tabs, TabItem } from 'flowbite-svelte';

	import Stepper from './Stepper.svelte';
	import TrainingStatus from '$lib/components/TrainingStatus.svelte';

    let theme = {
		bg: '#FFFFFF',
		gptBubble: '#E9E9E9',
		userBubble: '#2C6BED',
		gptBubbleText: '#222222',
		userBubbleText: '#FFFFFF'
	};
	
	let welcomeMsg = "What can I help you with?"

	let step = 1;

	let files: FileList | undefined

	let textModel: string
	let training = false
	let trainingMessage = "Training your chatbot";

	$: console.log(files)

	const handleUpload = async (files) => {
		training = true
		step = 2
		try {
			const res = await fetch('https://chat-base-xxvbz.ondigitalocean.app/new_model', {
				method: 'POST',
				headers: {
					"Content-Type": 'application/json'
				},
				body: JSON.stringify({					
					data_type: "file",
					train_key: files[0],
					user_id: "000"
				})
			})
			const data = await res.json()
			training = false
			trainingMessage = "Your chatbot is ready to go!"
			console.log(data)
		} catch (err) {
			console.error(err)
			training = true
			trainingMessage = "There was an error training your chatbot."

		}
	}

	const handleTextSubmit = async (text: string) => {
		training = true
		step = 2
		try {
			const res = await fetch('https://chat-base-xxvbz.ondigitalocean.app/new_model', {
				method: 'POST',
				headers: {
					"Content-Type": 'application/json'
				},
				body: JSON.stringify({					
					data_type: "text",
					train_key: text,
					user_id: "000"
				})
			})
			const data = await res.json()
			training = false
			trainingMessage = "Your chatbot is ready to go!"
		} catch (err) {
			console.error(err)
		}
	}

</script>


<div class="container mt-10">
	
	
		<div class="flex w-full justify-between items-center mb-10">
			<h1 class="mb-6 font-bold w-1/4">Create a new chatbot</h1>
			<div class="w-3/4">
				<Stepper {step} />
			</div>
		</div>
		
		<form method="POST">
			{#if step == 1}
			<h2>How would you like to train your chatbot?</h2>

				<div class="flex w-full justify-stretch text-center text-secondary-500 mb-10">
					<div class="border border-primary-500 w-1/3 p-4 rounded-l-xl bg-primary-900">Paste Text</div>
					<div class="border border-primary-500 w-1/3 p-4">Upload File</div>
					<div class="border border-primary-500 w-1/3 p-4 rounded-r-xl">URL</div>
				</div>
				<div>
					<textarea name="textModel" class="h-80 max-h-screen text-xs w-full" bind:value={textModel} />
					<button type="button" on:click={() => handleTextSubmit(textModel)}>Train Bot</button>
				</div>

				<!-- <div>
					<span slot="title">Document</span>
					<Dropzone id='dropzone' class="p-2" bind:files>
						{#if files}
							<ul class="text-slate-900 text-left w-full">
								{#each files as file}
									<li class="p-2 rounded border border-primary-600 font-bold text-sm text-primary-00">{file.name}</li>
								{/each}
							</ul>
						{:else}
							<div class="flex flex-col items-center py-4">
								<svg aria-hidden="true" class="mb-3 w-10 h-10 " fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
								<p class="mb-2 text-sm "><span class="font-semibold">Click to upload</span> or drag and drop</p>
								<p class="text-xs ">PDFs only (max 300MB)</p>
							</div>
						{/if}
					</Dropzone>
				</div>
				<div>
					<span slot="title">Website</span>
					<p class="text-sm text-gray-500 dark:text-gray-400"><b>Settings:</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
				</div> -->

			{:else if step == 2}
				<div class="grid grid-cols-2 gap-4">
					<div>
						<h2>Customize</h2>
						<label for="welcome-msg">Welcome Message</label>
						<input name="welcome-msg" bind:value={welcomeMsg} type="text" class="w-3/4" />
						<!-- <fieldset class="p-6 pb-8 gap-2 mt-8 border border-primary-500 rounded-lg">
							<legend class="label px-2">Customize colors</legend>
							<ColorPicker bind:hex={theme.bg} label="Background Color" />
							<ColorPicker bind:hex={theme.gptBubble} label="GPT Bubble" />
							<ColorPicker bind:hex={theme.userBubble} label="User Bubble" />
						</fieldset> -->
					</div>
					<div>
						<div class="p-4 border border-slate-400 rounded-lg self-start">
							<ChatWindow {theme}>
								<svelte:fragment slot="messages">
									{#if training}
										<ChatBubble message={welcomeMsg} />
										<ChatBubble message="I'm trying to build a chatbot!" sender="user" />
										<ChatBubble message="Great, I can help you with that!"  />
									{:else}
										<ChatBubble message={welcomeMsg} />
										<ChatBubble message="I've been trained and I'm ready to respond with your custom data. Type a message below to test it out." />
									{/if}
								</svelte:fragment>
								<div slot="input">
									<ChatInput autofocus={false} />
								</div>
							</ChatWindow>
						</div>
					</div>
				</div>
			{/if}
		</form>

	<TrainingStatus visible={step == 2} {training} {trainingMessage} />
</div>

<style lang="postcss">
h2{
	@apply text-xl font-light mb-4;
}

label,
.label{
	@apply text-sm block mb-1;
}

input,
textarea{
	@apply p-2 rounded;
}

.help{
	@apply text-slate-400 text-xs mt-1; 
}

.card{
	@apply bg-slate-700 p-4 rounded-lg text-slate-200 border border-slate-500;
}

.card h3{
	@apply text-sm font-bold;
}
</style>