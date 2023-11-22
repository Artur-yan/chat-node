// // src/app.d.ts
// declare global {
// 	namespace App {
// 		interface Locals {
// 			auth: import('lucia-auth').AuthRequest;
// 		}
// 	}
// }

/// <reference types="lucia" />
declare global {
	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type DatabaseUserAttributes = { email: string };
		type DatabaseSessionAttributes = {};
	}
}

// THIS IS IMPORTANT!!!
export {};
