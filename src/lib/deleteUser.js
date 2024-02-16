import { PrismaClient } from '@prisma/client';
let prismaClient = new PrismaClient();

const email = 'hbs.upwork@gmail.com';

async function deleteUser() {
	try {
		const user = await prismaClient.authUser.findUnique({
			where: {
				email: email
			}
		});

		if (user) {
			const id = user.id;
			await prismaClient.authUser.delete({
				where: {
					id: id
				}
			});
			console.log(`User with email ${email} has been deleted.`);
		} else {
			console.log(`User with email ${email} not found.`);
		}
	} catch (error) {
		console.error('Error in deleting user:', error);
	}
}

deleteUser();
