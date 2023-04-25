const id = document.currentScript.getAttribute('data-chatbot-id');

const body = document.querySelector('body');

let chatOpen = false;

function toggleChat() {
    if(chatOpen) {
        document.getElementById(`chatbot-${id}`).style.display = 'none';
    } else {
        document.getElementById(`chatbot-${id}`).style.display = 'block';
    }
    chatOpen = !chatOpen;
}

const html = `
<div style="position:fixed; bottom: 10px; right: 10px; z-index;50; overflow: visible;">
    <div style="border-radius: 12px; padding: 12px; background-color: #0F172A;display: none; position: absolute; bottom: 60px; right: 0; width: 360px; height: 600px;" id="chatbot-${id}">
        <iframe src="https://www.gptchatbot.ai/embed/${id}" width="100%" height="100%" style="visibility: hidden; border: none;" onload="this.style.visibility = 'visible';"></iframe>
    </div>
    <button style="outline: 0; border: none; border-radius: 32px;background-color: #818CF8; padding: 12px; position: absolute; bottom: 0; right: 0;" onclick="toggleChat()"><svg fill="none" height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg"><g stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m12 22c5.5228 0 10-4.4772 10-10 0-5.52285-4.4772-10-10-10-5.52285 0-10 4.47715-10 10 0 2.663 1.04094 5.0829 2.73812 6.875l-2.01131 2.2955c-.2832.3232-.05367.8295.37607.8295z"/><path d="m7 9h10"/><path d="m7 13h4"/></g></svg></button>
</div>
`

body.insertAdjacentHTML('beforeend', html);