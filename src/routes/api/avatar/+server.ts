import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from '$env/static/private';

cloudinary.config({
	cloud_name: 'duoacapcy',
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET
	// secure: true
});

function blobToBase64(blob) {
	return new Promise((resolve, _) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result);
		reader.readAsDataURL(blob);
	});
}

export const POST = async ({ request }) => {
	const data = await request.formData();
	const file = data.get('file');

	const base64Img = await blobToBase64(file);

	cloudinary.uploader.upload(base64Img).then((result) => {
		return new Response(JSON.stringify({ body: result }));
	});

	return new Response(JSON.stringify({ body: 'result' }));
};
