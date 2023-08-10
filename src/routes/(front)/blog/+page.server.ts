const cmsPath = 'https://cms.chatnode.ai'
const apiKey = 'API-0abe8486ae9683f1dfd7fe8565ee10cf82dddea2'


export const load = async () => {
	const data = await fetch(`${cmsPath}/api/content/items/post`, {
		method: 'GET',
		headers: {
			'api-key': apiKey
		}
	});
	const posts = await data.json();
	// console.log(posts)


	let images = []

	for(let i = 0; i < posts.length; i++) {
		console.log(posts[i].img._id)

		const url = `${cmsPath}/api/assets/image/${posts[i].img._id}?m=thumbnail&w=666&h=480`
		console.log(url)

		const img = await fetch(url, {
			method: 'GET',
			headers: {
				'api-key': apiKey
			}
		})

		const imgSrc = await img.json()

		images.push(imgSrc)
	};

	console.log(images)

	return {
		posts
	};
};
