import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
	cloud_name: 'duoacapcy',
	api_key: '816214673719747',
	api_secret: 'l5lOGqfr4Ew65LNzC1agYGXg07A'
	// secure: true
});

export const actions = {
	updateAvatarImg: async ({ request, locals }) => {
		const data = await request.formData();

		const avatarImg = data.get('albumImage')?.valueOf() as File;

		let stream = cloudinary.uploader.upload_stream(
			{
				folder: 'avatars'
			},
			(error, result) => {
				console.log(error, result);
			}
		);
	}
};
