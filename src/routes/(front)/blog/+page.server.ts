import { CMS_API_KEY } from '$env/static/private';
import { PUBLIC_CMS_PATH } from '$env/static/public';

export const load = async () => {
	const data = await fetch(`${PUBLIC_CMS_PATH}/api/content/items/post`, {
		method: 'GET',
		headers: {
			'api-key': CMS_API_KEY
		}
	});
	const posts = await data.json();

	const fetchPostImages = async () => {
		let postImages = [];
		for (let i = 0; i < posts.length; i++) {
			const res = await fetch(
				`${PUBLIC_CMS_PATH}/api/assets/image/${posts[i].img._id}?m=thumbnail&w=666&h=480`,
				{
					method: 'GET',
					headers: {
						'api-key': CMS_API_KEY
					}
				}
			);

			const img = await res.text();

			postImages.push({ thumbnail: img });
		}

		return postImages;
	};

	return {
		posts: posts,
		streamed: {
			postImages: fetchPostImages()
		}
	};
};
