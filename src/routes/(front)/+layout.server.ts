import type { LayoutServerLoad } from '../$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const user = await locals.auth.validateUser();

	const scripts = `
	<script
	src="https://www.chatnode.ai/embed.js"
	data-chatbot-id="befbfc87e25911db"
	data-color-1="#0E1729"
	data-color-2="#3ABFF7"
	></script>
	`

	return { user, scripts };
};
