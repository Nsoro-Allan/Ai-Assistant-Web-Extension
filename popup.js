// Replace 'YOUR_GEMINI_API_KEY_HERE' with your actual Gemini API key
const apiKey = 'AIzaSyBUFOndNmGDu3L-CJ9kcYOJLqU2wSY9AF4';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('searchForm').addEventListener('submit', handleSubmit);
});

async function handleSubmit(e) {
    e.preventDefault();
    const query = document.getElementById('searchInput').value;
    if (!query) return;

    addMessageToChat('User', query);
    document.getElementById('searchInput').value = '';

    try {
        const response = await sendToGemini(query);
        addMessageToChat('AI', response);
    } catch (error) {
        addMessageToChat('System', 'Error: ' + error.message);
    }
}

function addMessageToChat(sender, message) {
    const chatArea = document.getElementById('chatArea');
    const messageElement = document.createElement('p');
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatArea.appendChild(messageElement);
    chatArea.scrollTop = chatArea.scrollHeight;
}

async function sendToGemini(query) {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    const fullUrl = `${url}?key=${apiKey}`;

    try {
        const response = await fetch(fullUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: query
                            }
                        ]
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error details:', error);
        throw new Error(`Failed to get response from Gemini: ${error.message}`);
    }
}