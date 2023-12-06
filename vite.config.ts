import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { imagetools } from '@zerodevx/svelte-img/vite';
import fs from 'fs';

// Function to handle the robots.txt file
function handleRobotsFile() {
	const env = process.env.VITE_ENV || 'development';
	const sourceFile = `static/robots.${env}.txt`;
	const destinationFile = 'static/robots.txt';

	fs.copyFileSync(sourceFile, destinationFile);
}

handleRobotsFile();

export default defineConfig({
	plugins: [sveltekit(), imagetools()],
});