// File: /api/analyze.js

export default async function handler(req, res) {
    // 1. Only allow POST requests (when the frontend sends data)
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    // 2. Get the team names sent from your index.html file
    const { teamNames } = req.body;

    try {
        // 3. Talk to the actual AI API securely
        // We use process.env.AI_API_KEY so the key is hidden in Vercel's secure settings!
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.AI_API_KEY}` 
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // You can use OpenAI, or free alternatives like Groq/Gemini
                messages: [
                    { 
                        role: "system", 
                        content: "You are a Genshin Impact expert. Analyze this team's synergy, point out energy issues, and suggest one character swap. Output in HTML format." 
                    },
                    { 
                        role: "user", 
                        content: `Analyze this team: ${teamNames}` 
                    }
                ]
            })
        });

        const data = await response.json();
        const aiText = data.choices[0].message.content;

        // 4. Send the AI's answer back to your frontend securely
        res.status(200).json({ result: aiText });

    } catch (error) {
        res.status(500).json({ error: "Failed to connect to AI" });
    }
}