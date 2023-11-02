import { CMS_API_KEY } from '$env/static/private'
import { PUBLIC_CMS_PATH } from '$env/static/public'

export const load = async () => {

	async function fetchTestimonials() {
		const testimonials = await fetch(`${PUBLIC_CMS_PATH}/api/content/tree/testimonials`, {
			method: 'GET',
			headers: {
				'api-key': CMS_API_KEY
			}
		});
		return await testimonials.json();
	}

	return {
        streamed: {
			testimonials: fetchTestimonials()
        }
	};
};
