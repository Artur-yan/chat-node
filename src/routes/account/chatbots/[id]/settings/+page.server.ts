import { redirect } from '@sveltejs/kit';

export function load({params}) {
	throw redirect(307, `/account/chatbots/${params.id}/settings/prompts`);
}
