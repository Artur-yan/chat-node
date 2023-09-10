import { error } from '@sveltejs/kit';
import { v2 as cloudinary } from 'cloudinary';
import { prismaClient } from '$lib/server/prisma';

cloudinary.config({
	cloud_name: 'duoacapcy',
	api_key: '816214673719747',
	api_secret: 'l5lOGqfr4Ew65LNzC1agYGXg07A',
	secure: true
});

const allowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];

const updateAvatarImg = async (bot_id: string, avatarImg: string, public_id: string) => {
	await prismaClient.bots.update({
		where: {
			id: bot_id
		},
		data: {
			avatar_img: avatarImg,
			cloudinary_public_id: public_id
		}
	});
};

export const actions = {
	updateAvatarImg: async ({ request, locals, params }) => {
		const user = await locals.auth.validateUser();

		if (!user.session) {
			throw error(401, 'Unauthorized');
		}

		const form = await request.formData();

		const avatarImg = form.get('avatar-img');
		const exisitingCloudinaryPublicId = form.get('existing-cloudinary-public-id');
		const buffer = Buffer.from(await avatarImg?.arrayBuffer());
		const base64 = buffer.toString('base64');

		if (!allowedFileTypes.includes(avatarImg?.type)) {
			throw error(400, 'Invalid file type');
		} else if (avatarImg?.size > 4000000) {
			throw error(400, 'File is too large');
		} else {
			if (exisitingCloudinaryPublicId) {
				await cloudinary.uploader.destroy(exisitingCloudinaryPublicId);
			}
			await cloudinary.uploader
				.upload(`data:${avatarImg.type};base64,${base64}`, {
					folder: 'avatars',
					width: 256,
					height: 256,
					crop: 'fit',
					eager: [{ width: 80, height: 80 }]
				})
				.then(async (result) => {
					await updateAvatarImg(params.id, result.secure_url, result.public_id);
				});
		}

		return {
			success: true
		};
	},

	removeAvatarImg: async ({ request, locals, params }) => {
		const user = await locals.auth.validateUser();

		if (!user.session) {
			throw error(401, 'Unauthorized');
		}

		const form = await request.formData();

		const exisitingCloudinaryPublicId = form.get('existing-cloudinary-public-id');

		try{
			
			await cloudinary.uploader.destroy(exisitingCloudinaryPublicId);
	
			await prismaClient.bots.update({
				where: {
					id: params.id
				},
				data: {
					avatar_img: null,
					cloudinary_public_id: null
				}
			});

		} catch (error) {
			console.log(error);
			return {
				success: false
			};
			
		}

		return {
			success: true
		};
	}

};
