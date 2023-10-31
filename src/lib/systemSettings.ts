const systemSettings = {
	maintenanceAlert: false,
	maintenanceMsg:
		'Cloudflare is currently experiencing outages affecting ChatNode services.'
};

const domainBlacklist = [
	'givmail.com',
	'givmail.io',
	'givmail.co',
	'inboxbear.com',
	'vomoto.com',
	'fexpost.com'
];

export { systemSettings, domainBlacklist };
