const cmsPath = 'https://cms.chatnode.ai';
const apiKey = 'API-0abe8486ae9683f1dfd7fe8565ee10cf82dddea2';

export const load = async () => {
	const data = await fetch(`${cmsPath}/api/content/items/roadmap`, {
		method: 'GET',
		headers: {
			'api-key': apiKey
		}
	});
	const roadmap = await data.json();

	return {
		roadmap
	};
};
