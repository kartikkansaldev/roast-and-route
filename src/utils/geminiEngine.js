const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

export async function generateBloopResponse(promptText, sassLevel, userBalance, isScannerContext = false, foodOrderCount = 0) {
    if (!API_KEY || API_KEY === 'undefined' || API_KEY.trim() === '') {
        console.error("CRITICAL ERROR: VITE_GROQ_API_KEY is missing or undefined.");
        return "Hey, you forgot to add the Groq API key in Vercel!";
    }

    let systemPrompt;

    if (isScannerContext) {
        systemPrompt = `You are Bloop, a ${sassLevel} AI financial coach. The user has ₹${userBalance}.
Rule 1: If the scanned merchant is Myntra, Zara, Steam, Amazon, or PS5, you MUST output [IMPULSE].
Rule 2: The user has ordered food ${foodOrderCount} times so far. If the merchant is Swiggy or Zomato AND foodOrderCount < 2, output [ESSENTIAL]. If foodOrderCount >= 2, output [IMPULSE] and roast them for ordering too much takeout.
Rule 3: If the item is a person's name, P2P transfer, groceries, or medical, output [ESSENTIAL]. If it is clothes, gadgets, gaming, or luxury, output [IMPULSE].
Persona: Chill = Polite & encouraging. Sassy = Sarcastic & witty. Ruthless = Savage & brutal.
STRICT FORMAT: Start your response with EXACTLY [ESSENTIAL] or [IMPULSE]. Then write a punchy, complete sentence of up to 10 words. Never truncate. Never use markdown or asterisks.`;
    } else {
        if (sassLevel === 'Chill') {
            systemPrompt = `You are Bloop, a friendly and polite financial advisor. The user has ₹${userBalance}. Answer their query gently and helpfully.`;
        } else if (sassLevel === 'Sassy') {
            systemPrompt = `You are Bloop, a sarcastic financial advisor who loves teasing. The user has ₹${userBalance}. Roast their financial decisions with wit.`;
        } else {
            systemPrompt = `You are Bloop, a savage financial roaster. The user has ₹${userBalance}. Absolutely destroy their ego about their spending habits.`;
        }
        systemPrompt += `\nSTRICT RULE: Write a complete, punchy response of up to 10 words maximum. Finish your sentence completely. DO NOT use markdown, asterisks, or labels like 'Draft 1'. Output ONLY pure plain text.`;
    }

    console.log("Groq API Key Status: Loaded ✅");
    console.log("Sending to Groq:", { model: MODEL, promptText });

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: promptText }
                ],
                temperature: 0.9,
                max_tokens: 120,
            })
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Groq API Error [HTTP ${response.status}]:`, errorBody);
            if (response.status === 401) {
                return "Groq API key is invalid or expired. Check Vercel env vars!";
            }
            if (response.status === 404) {
                return "Groq API URL not found. Check the endpoint config!";
            }
            throw new Error(`Groq HTTP ${response.status}: ${errorBody}`);
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content?.trim();
        console.log("RAW GROQ RESPONSE:", text);

        if (!text) throw new Error('Empty response from Groq.');

        return text;
    } catch (err) {
        console.error("Groq API Request Failed:", err.message);

        if (isScannerContext) {
            const lower = promptText.toLowerCase();
            const essentialKeywords = ['grocery', 'medical', 'hospital', 'clinic', 'electric', 'water', 'gas', 'school', 'college', 'rent', 'bigbasket', 'dmart', 'reliance fresh'];
            const wasteKeywords = ['zara', 'h&m', 'nike', 'adidas', 'starbucks', 'dominos', 'swiggy', 'zomato', 'amazon', 'flipkart', 'myntra', 'ajio', 'gaming', 'steam', 'ps5'];

            if (essentialKeywords.some(k => lower.includes(k))) return '[ESSENTIAL] Responsible purchase. Approved. ✅';
            if (wasteKeywords.some(k => lower.includes(k))) return '[IMPULSE] Another unnecessary purchase? Your wallet weeps. 💀';
            return '[ESSENTIAL] Sending money to a friend. Stay safe out there. 🫡';
        }

        return `SYSTEM ERROR: ${err.message}`;
    }
}
