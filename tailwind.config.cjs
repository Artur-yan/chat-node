/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: {
					50: '#FBF3FB',
					100: '#F6E4F5',
					200: '#EEC9EB',
					300: '#E2A2DD',
					400: '#D374CC',
					500: '#AA36A2',
					600: '#973090',
					700: '#842A7E',
					800: '#74256F',
					900: '#511A4E',
					950: '#2B0E29'
				},
				secondary: {
					50: '#FFFEF5',
					100: '#FFFEF5',
					200: '#FFFEEB',
					300: '#FFFDE0',
					400: '#FFFDD1',
					500: '#FFFCC2',
					600: '#F5E900',
					700: '#D6CB00',
					800: '#B3AA00',
					900: '#807900',
					950: '#5C5700'
				}
			}
		}
	}
};
