const systemSettings = {
	maintenanceAlert: false,
	maintenanceMsg: 'OpenAI is currently experiencing outages affecting ChatNode services. <a href="https://status.openai.com/" target="_blank">https://status.openai.com/</a>'
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
