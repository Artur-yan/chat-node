import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { dev } from '$app/environment';
import { prisma } from '@lucia-auth/adapter-prisma';
import { prismaClient } from '$lib/server/prisma';

export const auth = lucia({
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	adapter: prisma(prismaClient),
	getUserAttributes: (data) => {
		return {
			email: data.email,
			status: data.status,
			api_key: data.api_key,
			default_openai_key: data.default_openai_key
		};
	}
});

export type Auth = typeof auth;
