import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { dev } from '$app/environment';
import { prisma } from '@lucia-auth/adapter-prisma';
import { prismaClient } from '$lib/server/prisma';

export const auth = lucia({
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	adapter: prisma(prismaClient, {
		user: 'AuthUser',
		key: 'AuthKey',
		session: 'AuthSession'
	}),
	getUserAttributes: (user) => {
		return {
			username: user.email,
			email: user.email,
			status: user.status,
			api_key: user.api_key,
			default_openai_key: user.default_openai_key,
			tracking_status: user.tracking_status
		};
	}
});

export type Auth = typeof auth;
