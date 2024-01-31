/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	plugins: [require('daisyui'), require('@tailwindcss/container-queries')],
	daisyui: {
		themes: [
			{
				night: {
					...require('daisyui/src/theming/themes')['[data-theme=night]'],
					primary: '#3ABFF8',
					secondary: '#828DF8',
					accent: '#F471B5',
					neutral: '#1D283A',
					'base-100': '#0F1729',
					'base-200': '#0E1426',
					'base-300': '#0C1222',
					info: '#0CA6E9',
					success: '#2BD4BD',
					warning: '#F4C152',
					error: '#FB6F84'
				}
			}
		]
	}
};
