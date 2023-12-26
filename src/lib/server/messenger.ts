import { PUBLIC_SITE_URL } from '$env/static/public';
import { APIClient, SendEmailRequest } from 'customerio-node';
import { CUSTOMER_IO_API_KEY } from '$env/static/private';

const customerIO = new APIClient(CUSTOMER_IO_API_KEY);

const sendAccountEmailConfirmation = (email: string, uuid: string) => {
	const confirmationEmail = new SendEmailRequest({
		transactional_message_id: 'email_verificaton',
		identifiers: {
			email: email
		},
		to: email,
		message_data: {
			passwordResetURL: `${PUBLIC_SITE_URL}/account/confirm/${uuid}`
		}
	});

	customerIO
		.sendEmail(confirmationEmail)
		.then((res) => console.log(res))
		.catch((err) => console.log(err.statusCode, err.message));
};
const sendAccountEmailUpdateConfirmation = (email: string, uuid: string) => {
	const confirmationEmail = new SendEmailRequest({
		transactional_message_id: 'email_update_verificaton',
		identifiers: {
			email: email
		},
		to: email,
		message_data: {
			passwordResetURL: `${PUBLIC_SITE_URL}/account/confirm/${uuid}?update=true`
		}
	});

	customerIO
		.sendEmail(confirmationEmail)
		.then((res) => console.log(res))
		.catch((err) => console.log(err.statusCode, err.message));
};
const sendPasswordReset = (email: string, uuid: string) => {
	const confirmationEmail = new SendEmailRequest({
		transactional_message_id: 'reset_password',
		identifiers: {
			email: email
		},
		to: email,
		message_data: {
			passwordResetURL: `${PUBLIC_SITE_URL}/reset-password/${uuid}`
		}
	});

	customerIO
		.sendEmail(confirmationEmail)
		.then((res) => console.log(res))
		.catch((err) => console.log(err.statusCode, err.message));
};

export { sendAccountEmailConfirmation, sendAccountEmailUpdateConfirmation, sendPasswordReset };
