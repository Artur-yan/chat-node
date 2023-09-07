const id = document.currentScript.getAttribute('data-chatbot-id');
const color1 = document.currentScript.getAttribute('data-color-1') || '#3ABFF7';
const color2 = document.currentScript.getAttribute('data-color-2') || '#0E1729';
const openOnLoad = document.currentScript.hasAttribute('data-open');

let chatOpen = false;
let chatLoaded = false;



function preloadChat() {
	const chat = document.getElementById(`chatbot-${id}-chat`)


	if (!chatLoaded) {
		chat.innerHTML += iframe
		chatLoaded = true;
		console.log('loaded')
	}
}

function toggleChat() {
	const chat = document.getElementById(`chatbot-${id}-chat`)

	if (!chatLoaded) {
		chat.innerHTML += iframe
		chatLoaded = true;
	}
	if (chatOpen) {
		chat.style.display = 'none';
		chat.classList.remove('open');
	} else {
		chat.style.display = 'block';
		chat.classList.add('open');
	}
	chatOpen = !chatOpen;
}

if (openOnLoad) {
	toggleChat();
}
const iframe = `
<iframe src="https://www.chatnode.ai/embed/${id}?context=popup" width="100%" height="100%"></iframe>
`;
const html = `	
<div id="chatbot-${id}">
<div id="chatbot-${id}-chat">
<div id="close-btn-${id}" role="button" onclick="toggleChat()" aria-label="Close AI Chat">
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m7 7l10 10M7 17L17 7"/></svg>
</div>
</div>
    <div id="toggle-btn-${id}" role="button" onclick="toggleChat()" onmouseover="preloadChat()" aria-label="Open AI Chat">
	<svg clip-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" version="1.1" viewBox="0 0 64 64" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g><path d="m0 32c0-17.673 14.327-32 32-32s32 14.327 32 32-14.327 32-32 32-32-14.327-32-32z" fill="${color2}"/><path d="m26 16c-5.5228 0-10 4.4772-10 10v12c0 5.5228 4.4772 10 10 10h19.5c1.3807 0 2.5-1.1193 2.5-2.5v-19.5c0-5.5228-4.4772-10-10-10h-12zm-0.75 16c0 1.1046-0.8954 2-2 2s-2-0.8954-2-2 0.8954-2 2-2 2 0.8954 2 2zm8.75 0c0 1.1046-0.8954 2-2 2s-2-0.8954-2-2 0.8954-2 2-2 2 0.8954 2 2zm6.75 2c1.1046 0 2-0.8954 2-2s-0.8954-2-2-2-2 0.8954-2 2 0.8954 2 2 2z" fill="${color1}" fill-rule="evenodd"/></g></svg>
	</div>
	<style>
		#chatbot-${id} {
			z-index:9999999;
			overflow: visible;
		}
		#chatbot-${id}-chat{
			position: fixed;
			display: none; 
			border-radius: 18px 18px 0 0;
			overflow: hidden;
			position: fixed;
			bottom: 0;
			right: 0;
			left: 0;
			top: 60px;
			z-index: 9999999;
			transition: all 0.3s ease-in-out;
			opacity: 0;
		}
		#chatbot-${id}-chat.open{
			top:40px;
			opacity: 1;
		}

		#toggle-btn-${id}{
			box-sizing: content-box;
			position: fixed;
			outline: 0;
			border: none;
			bottom: 10px;
			right: 10px;
			width:56px;
			height: 56px;
			z-index: 9999998;
			cursor: pointer;
		}
		#chatbot-${id} iframe{
			border: none;
		}
		#close-btn-${id}{
			box-sizing: content-box;
			border: none;
			position: absolute;
			top:0.625rem;
			right: 0.625rem;
			z-index: 9;
			background: ${color2};
			color: ${color1};
			padding: 6px;
			width: 20px;
			height: 20px;
			border-radius: 20px;
			cursor: pointer;
		}

		@media(min-width: 768px){
			#chatbot-${id}-chat{
				width: 440px;
				height: calc(100vh - 114px);
				bottom: 72px;
				left: auto;
				top: auto !important;
				right: 10px;
				max-height: 600px;
				border-radius: 18px;
			}
		}

	</style>
</div>
`;
document.addEventListener('DOMContentLoaded', () => {
	const body = document.querySelector('body');
	body.insertAdjacentHTML('beforeend', html);
});