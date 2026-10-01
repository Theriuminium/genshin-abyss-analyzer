export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Only POST requests allowed' });
    
    const { teamNames } = req.body;

    try {
        // Using the bulletproof Native Gemini API endpoint
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.AI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are a Genshin Impact Spiral Abyss expert. Analyze the team synergy, point out energy issues, and suggest ONE F2P character swap for better performance. Format your response cleanly in HTML. Keep it under 2 paragraphs. Analyze this team: ${teamNames}`
                    }]
                }]
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error("🚨 GOOGLE API ERROR:", data);
            return res.status(500).json({ error: "API Rejected" });
        }

        // Native Gemini returns data in a slightly different shape!
        const aiText = data.candidates[0].content.parts[0].text;
        res.status(200).json({ result: aiText });

    } catch (error) {
        console.error("🚨 SERVER CRASH:", error);
        res.status(500).json({ error: "Server crashed" });
    }
}
