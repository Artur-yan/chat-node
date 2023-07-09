<script lang="ts">

    import { defaultSettings } from '$lib/models';
	import ColorPicker from 'svelte-awesome-color-picker';
	import themes from '$lib/chatThemes';

    let settings = defaultSettings;
	let customTheme;
	let selectedTheme = settings.theme.name || 'default';
    let files: FileList;

    const handleAvatarUpload = async () => {
        console.log(files)
            let body = new FormData();
            body.append('file', files[0])
            console.log(body)
            const res = await fetch('/api/avatar', {
                method: 'POST',
                body
            })
    }

    if ((selectedTheme = 'custom')) {
		customTheme = settings.theme;
	}

	$: if (selectedTheme !== 'custom') {
		settings.theme = themes[selectedTheme];
	} else {
		settings.theme = customTheme;
	}

</script>

<div class="container mb-10">
    <form class="join" on:submit={handleAvatarUpload}>
        <input type="file" accept=".jpg, .png, .svg" class="join-item file-input file-input-bordered w-full" class:file-input-primary={!files} bind:files />
        <input type="submit" class="btn join-item border-primary border-l-0" value="Upload" class:btn-primary={files} />
    </form>
    <div class="themes">
        <div>
            <input
                class="hidden"
                type="radio"
                id="default"
                name="theme"
                value="default"
                bind:group={selectedTheme}
            />
            <label for="default">ChatNode</label>
        </div>
        <div>
            <input
                class="hidden"
                type="radio"
                id="meta-dark"
                name="theme"
                value="meta-dark"
                bind:group={selectedTheme}
            />
            <label for="meta-dark">Meta dark</label>
        </div>
        <div>
            <input
                class="hidden"
                type="radio"
                id="ios-light"
                name="theme"
                value="ios-light"
                bind:group={selectedTheme}
            />
            <label for="ios-light">iOS light</label>
        </div>
        <div>
            <input
                class="hidden"
                type="radio"
                id="ios-dark"
                name="theme"
                value="ios-dark"
                bind:group={selectedTheme}
            />
            <label for="ios-dark">iOS dark</label>
        </div>
        <div>
            <input
                class="hidden"
                type="radio"
                id="neutral"
                name="theme"
                value="neutral"
                bind:group={selectedTheme}
            />
            <label for="neutral">Neutral</label>
        </div>
        <div>
            <input
                class="hidden"
                type="radio"
                id="custom"
                name="theme"
                value="custom"
                bind:group={selectedTheme}
            />
            <label for="custom">Custom</label>
        </div>
    </div>
    {#if selectedTheme == 'custom'}
        <div class="grid grid-cols-2 gap-4 my-4">
            <ColorPicker bind:hex={settings.theme.bg} isPopup={false} label="Background" />
            <ColorPicker
                bind:hex={settings.theme.botBubbleBG}
                isPopup={false}
                label="Bot Bubble Background"
            />
            <ColorPicker
                bind:hex={settings.theme.botBubbleText}
                isPopup={false}
                label="Bot Bubble Text"
            />
            <ColorPicker
                bind:hex={settings.theme.userBubbleBG}
                isPopup={false}
                label="User Bubble Background"
            />
            <ColorPicker
                bind:hex={settings.theme.userBubbleText}
                isPopup={false}
                label="User Bubble Text"
            />
            <ColorPicker bind:hex={settings.theme.inputBG} isPopup={false} label="Input Background" />
            <ColorPicker bind:hex={settings.theme.inputText} isPopup={false} label="Input Text" />
            <ColorPicker bind:hex={settings.theme.inputBorder} isPopup={false} label="Input Border" />
            <ColorPicker
                bind:hex={settings.theme.sendButtonBG}
                isPopup={false}
                label="Send Button Background"
            />
            <ColorPicker
                bind:hex={settings.theme.sendButtonIconColor}
                isPopup={false}
                label="Send Button Icon"
            />
        </div>
    {/if}
</div>


<style lang="postcss">
	.themes {
		@apply flex items-center gap-2 flex-wrap;
	}

	.themes label {
		@apply btn btn-sm;
	}

	.themes input:checked + label {
		@apply btn-primary;
	}
</style>