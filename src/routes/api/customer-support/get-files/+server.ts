import { SUPPORT_PASSCODE, CB_TOKEN } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
let prismaClient = new PrismaClient();

export const GET = async ({ url }) => {
	const passcode = url.searchParams.get('passcode');
	const customerId = url.searchParams.get('botId');
	const offset = url.searchParams.get('offset') || 0;
	const includeUrls = url.searchParams.get('url');
	const verbose = url.searchParams.get('verbose');

	if (passcode !== SUPPORT_PASSCODE) {
		return json({ error: 'Invalid passcode' });
	}

	let source: string[];
	if (includeUrls === 'true') {
		source = ['WEB_SCRAPE'];
	} else {
		source = ['PDF', 'TEXT', 'XLSX', 'CSV', 'DOCX', 'MD', 'RTF', 'TSV', 'PPTX', 'JSON', 'RAW_TEXT'];
	}

	const bodyJson = JSON.stringify({
		pagination: {
			limit: 250,
			offset
		},
		filters: {
			source
		}
	});

	const options = {
		method: 'POST',
		headers: {
			authorization: `Bearer ${CB_TOKEN}`,
			'Content-Type': 'application/json',
			'customer-id': customerId
		},
		body: bodyJson
	};

	try {
		const response = await fetch('https://api.carbon.ai/user_files_v2', options);

		const data = await response.json();
		const formatedData = data.results.map((item: any) => {
			return {
				id: item.id,
				name: item.name,
				source: item.source,
				created_at: item.created_at,
				updated_at: item.updated_at,
				status: item.sync_status,
				error_message: item.sync_error_message
			};
		});
		return json(verbose === 'true' ? data : formatedData);
	} catch (e) {
		console.error('Unexpected error:', e.message);
		return json({ error: 'Unexpected error' });
	}
};
