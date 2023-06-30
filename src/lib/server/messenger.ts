import { PUBLIC_SITE_URL } from '$env/static/public';
import { APIClient, SendEmailRequest } from "customerio-node";

const customerIO = new APIClient("eabf404902465647b9c563d6a8535681");

const sendAccountEmailConfirmation = (email: string, uuid: string) => {
	const confirmationEmail = new SendEmailRequest({
	  transactional_message_id: "email_verificaton",
	  identifiers: {
		email: email,
	  },
	  to: email,
	  message_data: {
		passwordResetURL: `${PUBLIC_SITE_URL}/account/confirm/${uuid}`
	  }
	});

	customerIO.sendEmail(confirmationEmail)
	  .then(res => console.log(res))
	  .catch(err => console.log(err.statusCode, err.message))
}
const sendAccountEmailUpdateConfirmation = (email: string, uuid: string) => {
	const confirmationEmail = new SendEmailRequest({
	  transactional_message_id: "email_update_verificaton",
	  identifiers: {
		email: email,
	  },
	  to: email,
	  message_data: {
		passwordResetURL: `${PUBLIC_SITE_URL}/account/confirm/${uuid}?update=true`
	  }
	});

	customerIO.sendEmail(confirmationEmail)
	  .then(res => console.log(res))
	  .catch(err => console.log(err.statusCode, err.message))
}

export { sendAccountEmailConfirmation, sendAccountEmailUpdateConfirmation };