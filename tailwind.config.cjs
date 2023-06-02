/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	plugins: [require('daisyui')],
	daisyui: {
		themes: [
			{
				night: {
					...require("daisyui/src/theming/themes")["[data-theme=night]"],
					"base-200": "#0E1426",
					"base-300": "#0C1222"
				}
			}
		]
	}
};
