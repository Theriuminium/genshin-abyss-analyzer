module.exports = async function(req, res) {
    try {
        // We are hitting the "/models" endpoint to ask Groq what you are allowed to use
        const response = await fetch("https://api.groq.com/openai/v1/models", {
            headers: { "Authorization": `Bearer ${process.env.AI_API_KEY}` }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            console.error("🚨 GROQ ERROR:", data);
            return res.status(500).json({ error: "API Rejected" });
        }

        // Extract the names and print them to the screen
        const modelList = data.data.map(m => m.id).join("<br>• ");
        res.status(200).json({ result: "<b>Your Approved Models:</b><br>• " + modelList });

    } catch (error) {
        console.error("🚨 SERVER CRASH:", error);
        res.status(500).json({ error: "Server crashed" });
    }
}
