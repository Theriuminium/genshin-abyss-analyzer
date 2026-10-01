module.exports = async function(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Only POST requests allowed' });
    
    const { teamNames } = req.body;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.AI_API_KEY}` 
            },
            body: JSON.stringify({
                model: "llama3-8b-8192", 
                messages: [
                    { 
                        role: "system", 
                        content: "You are a Genshin Spiral Abyss expert. Analyze the team synergy, point out energy issues, and suggest ONE F2P character swap for better performance. Format your response cleanly in HTML. Keep it under 2 paragraphs." 
                    },
                    { 
                        role: "user", 
                        content: `Analyze this team: ${teamNames}` 
                    }
                ]
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error("🚨 GROQ API ERROR:", data);
            return res.status(500).json({ error: "API Rejected" });
        }

        const aiText = data.choices[0].message.content;
        res.status(200).json({ result: aiText });

    } catch (error) {
        console.error("🚨 SERVER CRASH:", error);
        res.status(500).json({ error: "Server crashed" });
    }
}
