import lucia from 'lucia-auth';
import { sveltekit } from 'lucia-auth/middleware';
import prisma from '@lucia-auth/adapter-prisma';
import { dev } from '$app/environment';
import { prismaClient } from '$lib/server/prisma';

export const auth = lucia({
	adapter: prisma(prismaClient),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	transformDatabaseUser: (user) => {
		return {
			userId: user.id,
			email: user.email,
			status: user.status,
			api_key: user.api_key
		};
	}
});

export type Auth = typeof auth;
