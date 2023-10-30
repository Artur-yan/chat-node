const systemSettings = {
	maintenanceAlert: true,
	maintenanceMsg:
		'OpenAI is currently experiencing outages preventing responses from being generated.'
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
