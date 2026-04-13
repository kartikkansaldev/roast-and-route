const fetch = require('node-fetch');

const API_KEY = "AIzaSyCoN7xNoI7WPTI_Ohfwk4vGb8FZi7-wxFk";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;

const sassLevel = "Ruthless";
const userBalance = "62745";
const toneGuide = 'Be brutally honest and savage. Destroy their ego to save their wallet. No mercy.';
        
let systemPrompt = `You are Bloop, a Gen-Z AI financial advisor chatbot inside "Roast & Route", a fintech app.
Sass level: ${sassLevel}. ${toneGuide}
User balance: ₹${userBalance}.
Respond in max 2 sentences. Be concise. Use emojis sparingly.`

systemPrompt += `\nYou must always reply in complete, grammatically correct sentences. Do not cut off your thoughts.`
systemPrompt += `\nDO NOT use markdown, DO NOT use asterisks (*), DO NOT output labels like 'Draft 1'. Output ONLY pure, unformatted plain text. Keep it to 2 complete sentences.`

const fullPromptText = `${systemPrompt}\n\nUser: Should I buy a new gaming PC?`;

fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        contents: [{ parts: [{ text: fullPromptText }] }],
        generationConfig: { temperature: 0.9, maxOutputTokens: 150 }
    })
}).then(r => r.json()).then(data => {
    console.log(JSON.stringify(data, null, 2));
    const dt = data.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log("LENGTH: ", dt?.length);
    console.log("TEXT: ", dt);
}).catch(console.error);
