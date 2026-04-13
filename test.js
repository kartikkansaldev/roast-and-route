const API_KEY = "AIzaSyCoN7xNoI7WPTI_Ohfwk4vGb8FZi7-wxFk";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        contents: [{
            parts: [{ text: "Hello" }]
        }]
    })
})
.then(r => {
    console.log("Status:", r.status);
    return r.text();
})
.then(data => console.log("Response:", data))
.catch(err => console.error("Error:", err));
