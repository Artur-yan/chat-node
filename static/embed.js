const id = document.currentScript.getAttribute('data-chatbot-id');
const color1 = document.currentScript.getAttribute('data-color-1') || '#3ABFF7';
const color2 = document.currentScript.getAttribute('data-color-2') || '#0E1729';
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
<div style="position:fixed; bottom: 20px; right: 20px; z-index:9999999; overflow: visible;">
    <div style="border-radius: 12px; overflow: hidden; background-color: #0F172A;display: none; position: fixed; bottom: 64px; right: 10px; width: 360px; max-width: calc(100% - 44px); height: calc(100vh - 114px); max-height: 600px;" id="chatbot-${id}">
        <iframe src="https://www.chatnode.ai/embed/${id}" width="100%" height="100%"></iframe>
    </div>
    <div role="button" style="outline: 0; border: none; position: absolute; bottom: 0; right: 0; width:64px; height: 64px;" onclick="toggleChat()">
	<svg xmlns="http://www.w3.org/2000/svg" width="66" height="65" fill="none" xmlns:v="https://vecta.io/nano"><g clip-path="url(#B)" filter="url(#A)"><path d="M65 32c0 17.673-14.327 32-32 32S1 49.673 1 32 15.327 0 33 0s32 14.327 32 32z" fill="${color2}"/><path fill-rule="evenodd" d="M27 16c-5.523 0-10 4.477-10 10v12c0 5.523 4.477 10 10 10h19.5a2.5 2.5 0 0 0 2.5-2.5V26c0-5.523-4.477-10-10-10H27zm-.75 16a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM35 32a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm6.75 2a2 2 0 1 0 0-4 2 2 0 1 0 0 4z" fill="${color1}"/></g><defs><filter id="A" x=".5" y="0" width="65" height="65" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="A"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="B"/><feOffset dy="0.5"/><feGaussianBlur stdDeviation=".25"/><feComposite in2="B" operator="out"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend in2="A"/><feBlend in="SourceGraphic"/></filter><clipPath id="B"><path fill="#fff" transform="translate(1)" d="M0 0h64v64H0z"/></clipPath></defs></svg>
		</div>
</div>
`;
document.addEventListener('DOMContentLoaded', () => {
	const body = document.querySelector('body');
	body.insertAdjacentHTML('beforeend', html);
});
