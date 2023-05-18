const id = document.currentScript.getAttribute('data-chatbot-id');

let chatOpen = false;

function toggleChat() {
	if (chatOpen) {
		document.getElementById(`chatbot-${id}`).style.display = 'none';
	} else {
		document.getElementById(`chatbot-${id}`).style.display = 'block';
	}
	chatOpen = !chatOpen;
}

const html = `
<div style="position:fixed; bottom: 10px; right: 10px; z-index:50; overflow: visible;">
    <div style="border-radius: 12px; padding: 12px; background-color: #0F172A;display: none; position: fixed; bottom: 64px; right: 10px; width: 360px; max-width: calc(100% - 44px); height: calc(100vh - 114px); max-height: 600px;" id="chatbot-${id}">
        <iframe src="https://www.chatnode.ai/embed/${id}" width="100%" height="100%" style="visibility: hidden; border: none;" onload="this.style.visibility = 'visible';"></iframe>
    </div>
    <button style="outline: 0; border: none; border-radius: 24px;background-color: #818CF8; padding: 8px; position: absolute; bottom: 0; right: 0; width:48px; height: 48px;" onclick="toggleChat()">
	<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
	<g clip-path="url(#clip0_179_2)">
	<path d="M27.1879 30.6595C27.6214 31.4572 28.4667 31.9986 29.4384 31.9986C30.8521 31.9986 31.9982 30.8525 31.9982 29.4388C31.9982 28.4671 31.4567 27.6219 30.6591 27.1883L30.4409 28.643C30.6145 28.8615 30.7183 29.138 30.7183 29.4388C30.7183 30.1457 30.1453 30.7187 29.4384 30.7187C29.1376 30.7187 28.8611 30.615 28.6426 30.4413L27.1879 30.6595Z" fill="white"/>
	<path d="M20.5387 11.5973C20.5387 12.4477 19.8498 13.1371 18.9999 13.1371H18.487C17.6371 13.1371 16.9482 12.4477 16.9482 11.5973L16.9482 2.21216C16.9482 1.79662 16.6979 1.42002 16.3083 1.2755C14.0872 0.451551 11.6846 0.00140381 9.17706 0.00140381H1.30299C0.594777 0.00140381 0.0206574 0.575903 0.0206574 1.28459C0.0206574 3.78517 -0.0177353 6.28925 0.0127253 8.79014C0.0178245 9.20879 0.359541 9.54417 0.778225 9.54417L8.22834 9.54417C9.07819 9.54417 9.76714 10.2336 9.76714 11.084V11.5973C9.76714 12.4477 9.07819 13.1371 8.22834 13.1371L1.33758 13.1371C0.854196 13.1371 0.490309 13.5787 0.604836 14.0483C1.07731 15.9857 1.82451 17.8153 2.80279 19.4936C3.1086 20.0182 3.6795 20.3229 4.28675 20.3229H18.9999C19.8498 20.3229 20.5387 21.0123 20.5387 21.8627V22.376C20.5387 23.2264 19.8498 23.9158 18.9999 23.9158H7.53229C7.07227 23.9158 6.85306 24.4679 7.20243 24.7671C10.7888 27.8393 15.4468 29.6948 20.538 29.6948H29.6944V20.5323C29.6944 13.7414 26.3995 7.72048 21.3221 3.98312C20.9928 3.74072 20.5387 3.9818 20.5387 4.3907L20.5387 11.5973Z" fill="white"/>
	</g>
	<defs>
	<clipPath id="clip0_179_2">
	<rect width="32" height="32" fill="white"/>
	</clipPath>
	</defs>
	</svg>
		</button>
</div>
`;

document.addEventListener('DOMContentLoaded', () => {
	const body = document.querySelector('body');
	body.insertAdjacentHTML('beforeend', html);
});
