const fbEvent = async (event: string, emails: Array<string>, amountSpent = 0) => {
	await fetch('/api/fb-track', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			event,
			emails,
			amountSpent
		})
	});
};

export default fbEvent;
