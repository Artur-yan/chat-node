import { error } from '@sveltejs/kit';
import { v2 as cloudinary } from 'cloudinary';
import { prismaClient } from '$lib/server/prisma';
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from '$env/static/private';

cloudinary.config({
	cloud_name: 'duoacapcy',
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET,
	secure: true
});

const allowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/gif'];

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

const updatePopupImg = async (bot_id: string, popupImg: string, public_id: string) => {
	await prismaClient.bots.update({
		where: {
			id: bot_id
		},
		data: {
			chat_button_img: popupImg,
			cloudinary_public_id_popup: public_id
		}
	});
};

export const actions = {
	updateAvatarImg: async ({ request, params }) => {
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

	removeAvatarImg: async ({ request, params }) => {
		const form = await request.formData();

		const exisitingCloudinaryPublicId = form.get('existing-cloudinary-public-id');

		try {
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
			console.error(error);
			return {
				success: false
			};
		}

		return {
			success: true
		};
	},

	updatePopupImg: async ({ request, params }) => {
		console.log('updatePopupImg');
		const popupImgForm = await request.formData();

		const popupImg = popupImgForm.get('chat-button-img');
		const exisitingCloudinaryPublicIdPopup = popupImgForm.get(
			'existing-cloudinary-public-id-popup'
		);

		const buffer = Buffer.from(await popupImg?.arrayBuffer());
		const base64 = buffer.toString('base64');

		if (!allowedFileTypes.includes(popupImg?.type)) {
			throw error(400, 'Invalid file type');
		} else if (popupImg?.size > 4000000) {
			throw error(400, 'File is too large');
		} else {
			if (exisitingCloudinaryPublicIdPopup) {
				await cloudinary.uploader.destroy(exisitingCloudinaryPublicIdPopup);
			}
			await cloudinary.uploader
				.upload(`data:${popupImg.type};base64,${base64}`, {
					folder: 'popups',
					width: 256,
					height: 256,
					crop: 'fit',
					eager: [{ width: 80, height: 80 }]
				})
				.then(async (result) => {
					await updatePopupImg(params.id, result.secure_url, result.public_id);
				});
		}

		return {
			success: true
		};
	},

	removePopupImg: async ({ request, params }) => {
		const form = await request.formData();

		const exisitingCloudinaryPublicIdPopup = form.get('existing-cloudinary-public-id-popup');

		try {
			await cloudinary.uploader.destroy(exisitingCloudinaryPublicIdPopup);

			await prismaClient.bots.update({
				where: {
					id: params.id
				},
				data: {
					chat_button_img: null,
					cloudinary_public_id_popup: null
				}
			});
		} catch (error) {
			console.error(error);
			return {
				success: false
			};
		}

		return {
			success: true
		};
	}
};
