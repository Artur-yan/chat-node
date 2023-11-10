import { auth } from '$lib/server/lucia';

import { fail, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	changePassword: async ({ request, locals }) => {
		const form = await request.formData();
		const password = form.get('password');
		const confirmPassword = form.get('confirm-password');
		const email = String(form.get('email')).toLowerCase();
		if (password !== confirmPassword) {
			return fail(400, {
				message: 'Passwords do not match'
			});
		} else if (
			!password ||
			typeof password !== 'string' ||
			!confirmPassword ||
			typeof confirmPassword !== 'string'
		) {
			return fail(400, {
				message: 'Invalid input'
			});
		} else {
			const key = await auth.updateKeyPassword('username', email, password);
		}
	}
};
