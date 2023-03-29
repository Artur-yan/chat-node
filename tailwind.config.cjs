/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: {
					100: '#F3F9FF',
					200: '#E6F3FF',
					300: '#CCE7FF',
					400: '#99CFFF',
					500: '#66B8FF',
					600: '#4DA3FF',
					700: '#338EFF',
					800: '#1A79FF',
					900: '#0064FF'
				}
			}
		}
	},
	plugins: []
};
