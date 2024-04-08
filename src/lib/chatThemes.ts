const themes = {
	default: {
		name: 'default',
		bg: '#0F172A',
		headerBG: '#0F172A',
		headerTitle: '#38BDF7',
		headerShadow: '#282b5aa3',
		statusMessage: 'Online',
		statusColor: '#40F135',
		resetButton: '#FFFFFF',
		botBubbleBG: '#898CF8',
		botBubbleText: '#00074B',
		userBubbleBG: '#1E293B',
		userBubbleText: '#B5CDF5',
		inputBG: '#FFFFFF',
		inputText: '#000',
		inputBorder: 'transparent',
		sendButtonBG: '#FFFFFF',
		sendButtonIconColor: '#38BDF7',
		popupButtonBG: '#3ABFF7',
		popupButtonIcon: '#0F172A',
		popupButtonMessageBG: '#0F172A',
		popupButtonMessageTextColor: '#38BDF7',
		popupButtonMessageGlowColor: '#ffffff4d',
		suggestedQuestionsBG: '#898CF8',
		suggestedQuestionsShadow: '#333333',
		feedbackBGColor: '#6467B2',
		feedbackIconColor: '#FFFFFF',
		poweredByChatNodeColor: '#898CF8'
	},
	'meta-dark': {
		name: 'meta-dark',
		bg: '#242526',
		headerBG: 'transparent',
		headerTitle: '#FFFFFF',
		headerShadow: '#333333',
		statusMessage: 'Online',
		statusColor: '#40F135',
		resetButton: '#666768',
		botBubbleBG: '#0084FF',
		botBubbleText: '#FFFFFF',
		userBubbleBG: '#3E4042',
		userBubbleText: '#E4E6EB',
		inputBG: '#3A3B3C',
		inputText: '#E4E6EB',
		inputBorder: 'transparent',
		sendButtonBG: '#3A3B3C',
		sendButtonIconColor: '#666768',
		popupButtonBG: '#0084FF',
		popupButtonIcon: '#FFFFFF',
		popupButtonMessageBG: '#FFFFFF',
		popupButtonMessageTextColor: '#0084FF',
		popupButtonMessageGlowColor: '#666768',
		suggestedQuestionsBG: '#0084FF',
		suggestedQuestionsShadow: '#333333',
		feedbackBackground: '#333333',
		feedbackIconColor: '#0F172A',
		poweredByChatNodeColor: '#3194FE'
	},
	'ios-dark': {
		name: 'ios-dark',
		bg: '#000000',
		headerBG: 'transparent',
		headerTitle: '#FFFFFF',
		headerShadow: '#242526',
		statusMessage: 'Online',
		statusColor: '#40F135',
		resetButton: '#3093FF',
		botBubbleBG: '#3093FF',
		botBubbleText: '#FFFFFF',
		userBubbleBG: '#26252A',
		userBubbleText: '#FFFFFF',
		inputBG: '#000000',
		inputText: '#FFFFFF',
		inputBorder: '#4A494E',
		sendButtonBG: '#3093FF',
		sendButtonIconColor: '#FFFFFF',
		popupButtonBG: '#3093FF',
		popupButtonIcon: '#000000',
		popupButtonMessageBG: '#000000',
		popupButtonMessageTextColor: '#3093FF',
		popupButtonMessageGlowColor: '#4A494E',
		suggestedQuestionsBG: '#0084FF',
		suggestedQuestionsShadow: '#333333',
		feedbackBGColor: '#333333',
		feedbackIconColor: '#FFFFFF',
		poweredByChatNodeColor: '#FFFFFF'
	},
	'ios-light': {
		name: 'ios-light',
		bg: '#FFFFFF',
		headerBG: 'transparent',
		headerTitle: '#000000',
		headerShadow: '#BBBBBE',
		statusMessage: 'Online',
		statusColor: '#3093FF',
		resetButton: '#3093FF',
		botBubbleBG: '#3194FE',
		botBubbleText: '#FFFFFF',
		userBubbleBG: '#E9E9EB',
		userBubbleText: '#000000',
		inputBG: '#FFFFFF',
		inputText: '#000000',
		inputBorder: '#BBBBBE',
		sendButtonBG: '#3194FE',
		sendButtonIconColor: '#FFFFFF',
		popupButtonBG: '#3194FE',
		popupButtonIcon: '#FFFFFF',
		popupButtonMessageBG: '#FFFFFF',
		popupButtonMessageTextColor: '#3194FE',
		popupButtonMessageGlowColor: '#BBBBBE',
		suggestedQuestionsBG: '#0084FF',
		suggestedQuestionsShadow: '#4A494E',
		feedbackBGColor: '#BBBBBE',
		feedbackIconColor: '#333333',
		poweredByChatNodeColor: '#333333'
	},
	neutral: {
		name: 'neutral',
		bg: '#666666',
		headerBG: 'transparent',
		headerTitle: '#FFFFFF',
		headerShadow: '#555555',
		statusMessage: 'Online',
		statusColor: '#40F135',
		resetButton: '#00000060',
		botBubbleBG: '#333333',
		botBubbleText: '#FFFFFF',
		userBubbleBG: '#555555',
		userBubbleText: '#FFFFFF',
		inputBG: '#FFFFFF',
		inputText: '#000000',
		inputBorder: '#BBBBBE',
		sendButtonBG: '#333333',
		sendButtonIconColor: '#FFFFFF',
		popupButtonBG: '#333333',
		popupButtonIcon: '#FFFFFF',
		popupButtonMessageBG: '#FFFFFF',
		popupButtonMessageTextColor: '#333333',
		popupButtonMessageGlowColor: '#00000060',
		suggestedQuestionsBG: '#333333',
		suggestedQuestionsShadow: '#4A494E',
		feedbackIconColor: '#333333',
		poweredByChatNodeColor: '#ffffff'
	},
	dracula: {
		name: 'dracula',
		bg: '#282A36', // Background color
		headerBG: '#44475A', // Current Line color for header background
		headerTitle: '#F8F8F2', // Foreground color for header title
		headerShadow: '#6272A4', // Comment color for header shadow
		statusMessage: 'Online',
		statusColor: '#50FA7B', // Green color for status
		resetButton: '#FF5555', // Red color for reset button
		botBubbleBG: '#44475A', // Current Line color for bot bubble background
		botBubbleText: '#F8F8F2', // Foreground color for bot bubble text
		userBubbleBG: '#BD93F9', // Background color for user bubble
		userBubbleText: '#F8F8F2', // Foreground color for user bubble text
		inputBG: '#F8F8F2', // Foreground color for input background
		inputText: '#282A36', // Background color for input text
		inputBorder: '#6272A4', // Comment color for input border
		sendButtonBG: '#BD93F9', // Purple color for send button background
		sendButtonIconColor: '#F8F8F2', // Foreground color for send button icon
		popupButtonBG: '#FF79C6', // Pink color for popup button background
		popupButtonIcon: '#F8F8F2', // Foreground color for popup button icon
		popupButtonMessageBG: '#F8F8F2', // Foreground color for popup message background
		popupButtonMessageTextColor: '#282A36', // Background color for popup message text
		popupButtonMessageGlowColor: '#FF79C6', // Pink color for popup message glow
		suggestedQuestionsBG: '#BD93F9', // Purple color for suggested questions background
		suggestedQuestionsShadow: '#6272A4', // Comment color for suggested questions shadow
		feedbackIconColor: '#8BE9FD', // Cyan color for feedback icon
		poweredByChatNodeColor: '#F8F8F2' // Foreground color for 'Powered By' text
	},
	custom: {
		name: 'custom',
		bg: '#666666',
		headerBG: 'transparent',
		headerTitle: '#FFFFFF',
		headerShadow: '#555555',
		statusMessage: 'Online',
		statusColor: '#40F135',
		resetButton: '#00000060',
		botBubbleBG: '#333333',
		botBubbleText: '#FFFFFF',
		userBubbleBG: '#555555',
		userBubbleText: '#FFFFFF',
		inputBG: '#FFFFFF',
		inputText: '#000000',
		inputBorder: '#BBBBBE',
		sendButtonBG: '#333333',
		sendButtonIconColor: '#FFFFFF',
		popupButtonBG: '#333333',
		popupButtonIcon: '#FFFFFF',
		popupButtonMessageBG: '#666666',
		popupButtonMessageTextColor: '#FFFFFF',
		popupButtonMessageGlowColor: '#00000060',
		suggestedQuestionsBG: '#333333',
		suggestedQuestionsShadow: '#4A494E',
		feedbackIconColor: '#333333',
		poweredByChatNodeColor: '#ffffff'
	}
};

export default themes;
