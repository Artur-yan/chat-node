const cmsPath = 'https://cms.chatnode.ai';
const apiKey = 'API-0abe8486ae9683f1dfd7fe8565ee10cf82dddea2';

export const load = async () => {
	const data = await fetch(`${cmsPath}/api/content/items/post`, {
		method: 'GET',
		headers: {
			'api-key': apiKey
		}
	});
	const posts = await data.json();

	const fetchPostImages = async () => {
		let postImages = [];
		for (let i = 0; i < posts.length; i++) {
			const res = await fetch(
				`${cmsPath}/api/assets/image/${posts[i].img._id}?m=thumbnail&w=666&h=480`,
				{
					method: 'GET',
					headers: {
						'api-key': apiKey
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
