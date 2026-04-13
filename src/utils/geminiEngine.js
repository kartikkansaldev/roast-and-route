const API_KEY = import.meta.env.NEXT_PUBLIC_GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;

export async function generateBloopResponse(promptText, sassLevel, userBalance, isScannerContext = false, foodOrderCount = 0) {
    if (!API_KEY || API_KEY === 'undefined' || API_KEY.trim() === '') {
        console.error("CRITICAL ERROR: Gemini API Key is missing or undefined.");
        return "Hey, you forgot to add the API key in Vercel!";
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;
    
    let systemPrompt;

    if (isScannerContext) {
        systemPrompt = `The user scanned: ${promptText}. The user has ₹${userBalance}. The current AI personality mode is: ${sassLevel}. 
Rule 1: If the scanned merchant is Myntra, Zara, Steam, or Amazon, you MUST assume it is a luxury and strictly output [IMPULSE].
Rule 2: The user has ordered food ${foodOrderCount} times so far. If the scanned merchant is Swiggy or Zomato AND the foodOrderCount is less than 2, output [ESSENTIAL]. However, if the scanned merchant is Swiggy or Zomato AND the foodOrderCount is 2 or greater, you MUST output [IMPULSE] and roast them for ordering takeout too much.
If the scanned item is a person's name, a peer-to-peer transfer, groceries, or medical, you MUST output the exact word [ESSENTIAL] at the very beginning of your response. If it is clothes, gadgets, or luxury, output [IMPULSE]. Then, write a response strictly matching the ${sassLevel} persona (Chill = Polite, Sassy = Sarcastic, Ruthless = Savage/Mean).`;
    } else {
        if (sassLevel === 'Chill') {
            systemPrompt = `You are Bloop, a polite financial advisor. The user has ₹${userBalance}. Answer their query gently.`;
        } else if (sassLevel === 'Sassy') {
            systemPrompt = `You are Bloop, a sarcastic financial advisor. The user has ₹${userBalance}. Tease them.`;
        } else {
            systemPrompt = `You are Bloop, a savage financial roaster. The user has ₹${userBalance}. Destroy their ego.`;
        }
    }

    systemPrompt += `\nSTRICT RULE: You must write a complete, punchy response of up to 10 words maximum. You must finish your sentence completely and never stop halfway.`;
    
    if (!isScannerContext) {
        systemPrompt += `\nDO NOT use markdown, DO NOT use asterisks (*), DO NOT output labels like 'Draft 1'. Output ONLY pure, unformatted plain text.`;
    }

    console.log("API Key Status: Loaded successfully.");

    const fullPromptText = `${systemPrompt}\n\nUser: ${promptText}`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: fullPromptText }]
                }],
                generationConfig: {
                    temperature: 0.9,
                    maxOutputTokens: 500,
                }
            })
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Gemini SDK HTTP Error ${response.status}:`, errorBody);
            throw new Error(`Google AI SDK Error: ${response.status}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        console.log("RAW AI RESPONSE:", text);

        if (!text) throw new Error('Empty response from Google AI.');

        return text;
    } catch (err) {
        console.error("Gemini API Request Failed:", err);

        if (isScannerContext) {
            // Fallback: classify based on common patterns
            const lower = promptText.toLowerCase();
            const essentialKeywords = ['grocery', 'medical', 'hospital', 'clinic', 'electric', 'water', 'gas', 'school', 'college', 'rent', 'bigbasket', 'dmart', 'more', 'reliance fresh'];
            const wasteKeywords = ['zara', 'h&m', 'nike', 'adidas', 'starbucks', 'dominos', 'swiggy', 'zomato', 'amazon', 'flipkart', 'myntra', 'ajio', 'gaming', 'steam'];

            if (essentialKeywords.some(k => lower.includes(k))) {
                return '[ESSENTIAL] Responsible purchase. Approved. ✅';
            }
            if (wasteKeywords.some(k => lower.includes(k))) {
                return '[IMPULSE] Another unnecessary purchase? Your wallet is begging for mercy. 💀';
            }
            return '[ESSENTIAL] Sending money to a friend. Be careful out there. 🫡';
        }

        return "Sorry, my brain glitched for a sec. Try again! 🤖";
    }
}
