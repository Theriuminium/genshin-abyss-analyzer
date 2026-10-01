module.exports = async function(req, res) {
    try {
        // We are hitting Google's /models endpoint to see what your key unlocks
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.AI_API_KEY}`);
        
        const data = await response.json();
        
        if (!response.ok) {
            console.error("🚨 GOOGLE ERROR:", data);
            return res.status(500).json({ error: "API Rejected" });
        }

        // Extract the Google model names and print them to the screen
        const modelList = data.models.map(m => m.name).join("<br>• ");
        res.status(200).json({ result: "<b>Your Approved Gemini Models:</b><br>• " + modelList });

    } catch (error) {
        console.error("🚨 SERVER CRASH:", error);
        res.status(500).json({ error: "Server crashed" });
    }
}
