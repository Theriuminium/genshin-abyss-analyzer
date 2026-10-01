export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Only POST requests allowed' });
    
    const { teamNames } = req.body;

    try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.AI_API_KEY}` 
            },
            body: JSON.stringify({
                model: "gemini-1.5-flash", 
                messages: [
                    { 
                        role: "system", 
                        content: "You are a Genshin Spiral Abyss expert. Analyze the team synergy, point out flaws, and suggest one character swap. Output in HTML format. Keep it under 2 paragraphs." 
                    },
                    { 
                        role: "user", 
                        content: `Analyze this team: ${teamNames}` 
                    }
                ]
            })
        });

        const data = await response.json();
        
        // NEW: If Google rejects the key, it will print the exact reason to Vercel Logs!
        if (!response.ok) {
            console.error("🚨 GOOGLE API ERROR:", data);
            return res.status(500).json({ error: "API Rejected" });
        }

        const aiText = data.choices[0].message.content;
        res.status(200).json({ result: aiText });

    } catch (error) {
        // NEW: If the server itself crashes, it will print why
        console.error("🚨 SERVER CRASH:", error);
        res.status(500).json({ error: "Server crashed" });
    }
}
